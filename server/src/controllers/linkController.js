import Link from '../models/Link.js';
import Analytics from '../models/Analytics.js';
import { generateShortCode } from '../utils/generateShortCode.js';
import { calculateHealthScore } from '../utils/calculateHealthScore.js';
import { validationResult } from 'express-validator';
import QRCode from 'qrcode';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { format } from 'date-fns';

// Helper to get the canonical short URL using BASE_URL env var
const getShortUrl = (shortCode) => {
  const base = (process.env.BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
  return `${base}/${shortCode}`;
};

export const createLink = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { originalUrl, customAlias, title, expiryDate } = req.body;
    let shortCode = customAlias || generateShortCode();

    if (customAlias) {
      const existing = await Link.findOne({ $or: [{ shortCode: customAlias }, { customAlias }] });
      if (existing) return res.status(400).json({ message: 'Custom alias already in use' });
    } else {
      let exists = await Link.findOne({ shortCode });
      while (exists) {
        shortCode = generateShortCode();
        exists = await Link.findOne({ shortCode });
      }
    }

    const shortUrl = getShortUrl(shortCode);
    const qrCode = await QRCode.toDataURL(shortUrl);

    const link = await Link.create({
      user: req.user._id,
      originalUrl,
      shortCode,
      customAlias: customAlias || null,
      title: title || originalUrl,
      qrCode,
      expiryDate: expiryDate ? new Date(expiryDate) : null
    });

    res.status(201).json({ success: true, link: { ...link.toObject(), health: calculateHealthScore(link) } });
  } catch (error) {
    next(error);
  }
};

export const getLinks = async (req, res, next) => {
  try {
    const { search, status, sortBy = 'createdAt', order = 'desc', page = 1, limit = 20 } = req.query;
    const query = { user: req.user._id };

    if (status && ['active', 'expired', 'disabled'].includes(status)) query.status = status;

    if (search) {
      query.$or = [
        { originalUrl: { $regex: search, $options: 'i' } },
        { shortCode: { $regex: search, $options: 'i' } },
        { customAlias: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = {};
    if (sortBy === 'clicks') sortOptions.clickCount = sortOrder;
    else if (sortBy === 'oldest') sortOptions.createdAt = 1;
    else sortOptions.createdAt = sortOrder;

    const skip = (Number(page) - 1) * Number(limit);
    const links = await Link.find(query).sort(sortOptions).skip(skip).limit(Number(limit)).lean();
    const total = await Link.countDocuments(query);

    const linksWithHealth = links.map(link => ({
      ...link,
      health: calculateHealthScore(link)
    }));

    res.json({
      success: true,
      links: linksWithHealth,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) }
    });
  } catch (error) {
    next(error);
  }
};

export const getLink = async (req, res, next) => {
  try {
    const link = await Link.findOne({ _id: req.params.id, user: req.user._id }).lean();
    if (!link) return res.status(404).json({ message: 'Link not found' });
    res.json({ success: true, link: { ...link, health: calculateHealthScore(link) } });
  } catch (error) {
    next(error);
  }
};

export const updateLink = async (req, res, next) => {
  try {
    const { originalUrl, customAlias, title, expiryDate, status } = req.body;
    const link = await Link.findOne({ _id: req.params.id, user: req.user._id });
    if (!link) return res.status(404).json({ message: 'Link not found' });

    let aliasChanged = false;
    if (customAlias !== undefined && customAlias !== link.customAlias) {
      if (customAlias) {
        const existing = await Link.findOne({ customAlias, _id: { $ne: link._id } });
        if (existing) return res.status(400).json({ message: 'Custom alias already in use' });
      }
      link.customAlias = customAlias || null;
      aliasChanged = true;
    }

    if (originalUrl) link.originalUrl = originalUrl;
    if (title !== undefined) link.title = title;
    if (expiryDate !== undefined) link.expiryDate = expiryDate ? new Date(expiryDate) : null;
    if (status && ['active', 'disabled'].includes(status)) link.status = status;

    // Regenerate QR if alias changed
    if (aliasChanged) {
      const shortUrl = getShortUrl(link.customAlias || link.shortCode);
      link.qrCode = await QRCode.toDataURL(shortUrl);
    }

    await link.save();
    res.json({ success: true, link: { ...link.toObject(), health: calculateHealthScore(link) } });
  } catch (error) {
    next(error);
  }
};

export const deleteLink = async (req, res, next) => {
  try {
    const link = await Link.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!link) return res.status(404).json({ message: 'Link not found' });
    await Analytics.deleteMany({ link: req.params.id });
    res.json({ success: true, message: 'Link deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const bulkCreate = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please upload a CSV file' });

    const errors = [];
    const created = [];

    // Parse CSV from buffer (memoryStorage)
    const readable = new Readable();
    readable.push(req.file.buffer);
    readable.push(null);
    const stream = readable.pipe(csv());

    for await (const row of stream) {
      const { originalUrl, customAlias, title, expiryDate } = row;
      if (!originalUrl || !originalUrl.startsWith('http')) {
        errors.push({ row, error: 'Missing or invalid originalUrl' });
        continue;
      }

      try {
        let shortCode = customAlias || generateShortCode();
        if (customAlias) {
          const existing = await Link.findOne({ $or: [{ shortCode: customAlias }, { customAlias }] });
          if (existing) {
            errors.push({ row, error: 'Alias already exists' });
            continue;
          }
        } else {
          let exists = await Link.findOne({ shortCode });
          while (exists) {
            shortCode = generateShortCode();
            exists = await Link.findOne({ shortCode });
          }
        }

        const shortUrl = getShortUrl(shortCode);
        const qrCode = await QRCode.toDataURL(shortUrl);

        const link = await Link.create({
          user: req.user._id,
          originalUrl,
          shortCode,
          customAlias: customAlias || null,
          title: title || originalUrl,
          qrCode,
          expiryDate: expiryDate ? new Date(expiryDate) : null
        });
        created.push(link);
      } catch (err) {
        errors.push({ row, error: err.message });
      }
    }

    res.json({ success: true, created: created.length, errors, links: created });
  } catch (error) {
    next(error);
  }
};