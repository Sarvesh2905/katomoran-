import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'

// ─── PDF Export ───────────────────────────────────────────────────────────────

export const exportToPDF = (link, analytics) => {
  const doc = new jsPDF()
  const pageW = doc.internal.pageSize.getWidth()

  // ── Cover Header ──
  doc.setFillColor(5, 8, 22)
  doc.rect(0, 0, pageW, 42, 'F')

  // Violet accent bar
  doc.setFillColor(124, 58, 237)
  doc.rect(0, 0, 4, 42, 'F')

  doc.setTextColor(167, 139, 250)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('Katomaran Link Analytics', 12, 18)

  doc.setTextColor(148, 163, 184)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(`Report for: ${link.customAlias || link.shortCode}`, 12, 28)
  doc.text(`Generated: ${format(new Date(), 'MMMM dd, yyyy HH:mm')}`, 12, 36)

  let y = 52

  const section = (title) => {
    if (y > 240) { doc.addPage(); y = 14 }
    doc.setTextColor(167, 139, 250)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(title, 14, y)
    y += 6
  }

  const table = (head, body, headColor, altColor = [248, 250, 252]) => {
    autoTable(doc, {
      startY: y,
      head: [head],
      body,
      theme: 'striped',
      headStyles: {
        fillColor: headColor,
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9,
        cellPadding: 4
      },
      bodyStyles: { fontSize: 9, cellPadding: 4, textColor: [30, 30, 30] },
      alternateRowStyles: { fillColor: altColor },
      styles: { overflow: 'linebreak', cellWidth: 'wrap' },
      margin: { left: 14, right: 14 }
    })
    y = doc.lastAutoTable.finalY + 10
    if (y > 250) { doc.addPage(); y = 14 }
  }

  const pct = (v, total) => total > 0 ? `${Math.round((v / total) * 100)}%` : '0%'
  const total = analytics.totalClicks || 0

  // ── 1. Link Information ──
  section('1. Link Information')
  table(
    ['Property', 'Value'],
    [
      ['Short Code',      link.shortCode],
      ['Custom Alias',    link.customAlias || 'None'],
      ['Title',           link.title || 'Untitled'],
      ['Destination URL', (link.originalUrl || '').length > 65 ? (link.originalUrl || '').slice(0, 65) + '…' : (link.originalUrl || '')],
      ['Status',          (link.status || '').toUpperCase()],
      ['Created',         link.createdAt ? format(new Date(link.createdAt), 'MMM dd, yyyy HH:mm') : 'N/A'],
      ['Expiry',          link.expiryDate ? format(new Date(link.expiryDate), 'MMM dd, yyyy HH:mm') : 'Never']
    ],
    [124, 58, 237]
  )

  // ── 2. Performance Summary ──
  section('2. Performance Summary')
  table(
    ['Metric', 'Value'],
    [
      ['Total Clicks',     total.toString()],
      ['Unique Visitors',  (analytics.uniqueVisitors || 0).toString()],
      ['Last Visited',     analytics.lastVisited ? format(new Date(analytics.lastVisited), 'MMM dd, yyyy HH:mm') : 'Never'],
      ['Health Score',     `${link.health?.score ?? 'N/A'} — ${link.health?.label ?? 'N/A'}`]
    ],
    [124, 58, 237]
  )

  // ── 3. Device Breakdown ──
  if (analytics.deviceStats?.length > 0) {
    section('3. Device Breakdown')
    table(
      ['Device', 'Clicks', 'Percentage'],
      analytics.deviceStats.map(d => [d.name, d.value, pct(d.value, total)]),
      [6, 182, 212]
    )
  }

  // ── 4. Browser Breakdown ──
  if (analytics.browserStats?.length > 0) {
    section('4. Browser Breakdown')
    table(
      ['Browser', 'Clicks', 'Percentage'],
      analytics.browserStats.map(b => [b.name, b.value, pct(b.value, total)]),
      [6, 182, 212]
    )
  }

  // ── 5. Referrer Breakdown ──
  if (analytics.referrerStats?.length > 0) {
    section('5. Referrer Breakdown')
    table(
      ['Source', 'Clicks', 'Percentage'],
      analytics.referrerStats.map(r => [r.name, r.value, pct(r.value, total)]),
      [236, 72, 153]
    )
  }

  // ── 6. Country Breakdown ──
  if (analytics.countryStats?.length > 0) {
    section('6. Country Breakdown (Top 10)')
    table(
      ['Country', 'Clicks', 'Percentage'],
      analytics.countryStats.slice(0, 10).map(c => [c.name, c.value, pct(c.value, total)]),
      [236, 72, 153]
    )
  }

  // ── 7. Daily Click Trends ──
  if (analytics.dailyClicks?.length > 0) {
    section(`7. Daily Click Trends (${analytics.days || 7} Days)`)
    table(
      ['Date', 'Clicks'],
      analytics.dailyClicks.map(d => [d.date, d.clicks.toString()]),
      [124, 58, 237]
    )
  }

  // ── Footer on every page ──
  const totalPages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFillColor(5, 8, 22)
    doc.rect(0, doc.internal.pageSize.getHeight() - 14, pageW, 14, 'F')
    doc.setFontSize(7.5)
    doc.setTextColor(100, 116, 139)
    doc.text(
      `Katomaran Link Analytics  |  Page ${i} of ${totalPages}  |  Generated ${format(new Date(), 'MMM dd, yyyy HH:mm')}`,
      14,
      doc.internal.pageSize.getHeight() - 4
    )
  }

  doc.save(`katomaran-${link.shortCode}-${format(new Date(), 'yyyy-MM-dd')}.pdf`)
}

// ─── CSV Export (client-side) ─────────────────────────────────────────────────

export const exportToCSV = (link, analytics) => {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const row = (cols) => cols.map(esc).join(',')
  const total = analytics.totalClicks || 0
  const pct = (v) => total > 0 ? `${Math.round((v / total) * 100)}%` : '0%'

  const sections = [
    '# LINK SUMMARY',
    row(['Property', 'Value']),
    row(['Short Code', link.shortCode]),
    row(['Custom Alias', link.customAlias || 'None']),
    row(['Title', link.title || 'Untitled']),
    row(['Destination URL', link.originalUrl]),
    row(['Status', link.status]),
    row(['Total Clicks', total]),
    row(['Unique Visitors', analytics.uniqueVisitors || 0]),
    row(['Health Score', `${link.health?.score} - ${link.health?.label}`]),
    row(['Created', link.createdAt ? format(new Date(link.createdAt), 'yyyy-MM-dd HH:mm') : 'N/A']),
    row(['Last Visited', analytics.lastVisited ? format(new Date(analytics.lastVisited), 'yyyy-MM-dd HH:mm') : 'Never']),
    '',
    '# DEVICE BREAKDOWN',
    row(['Device', 'Clicks', 'Percentage']),
    ...(analytics.deviceStats || []).map(d => row([d.name, d.value, pct(d.value)])),
    '',
    '# BROWSER BREAKDOWN',
    row(['Browser', 'Clicks', 'Percentage']),
    ...(analytics.browserStats || []).map(b => row([b.name, b.value, pct(b.value)])),
    '',
    '# REFERRER BREAKDOWN',
    row(['Source', 'Clicks', 'Percentage']),
    ...(analytics.referrerStats || []).map(r => row([r.name, r.value, pct(r.value)])),
    '',
    '# COUNTRY BREAKDOWN',
    row(['Country', 'Clicks', 'Percentage']),
    ...(analytics.countryStats || []).map(c => row([c.name, c.value, pct(c.value)])),
    '',
    '# DAILY CLICK TRENDS',
    row(['Date', 'Clicks']),
    ...(analytics.dailyClicks || []).map(d => row([d.date, d.clicks])),
    '',
    `# Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`,
    '# Katomaran Link Analytics — https://katomaran.app'
  ]

  const csvContent = sections.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `katomaran-${link.shortCode}-${format(new Date(), 'yyyy-MM-dd')}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
