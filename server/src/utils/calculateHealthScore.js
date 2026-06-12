export const calculateHealthScore = (link) => {
  let score = 100;
  const now = Date.now();
  const ageDays = (now - new Date(link.createdAt).getTime()) / (1000 * 60 * 60 * 24);

  if (ageDays > 90) score -= 10;
  if (ageDays > 180) score -= 10;
  if (link.clickCount === 0) score -= 20;

  if (link.status === 'expired') score -= 30;
  else if (link.status === 'disabled') score -= 25;

  if (link.lastVisited) {
    const daysSinceVisit = (now - new Date(link.lastVisited).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceVisit > 30) score -= 15;
  } else {
    score -= 15;
  }

  score = Math.max(0, Math.min(100, score));

  let label = 'Excellent';
  let color = 'emerald';
  if (score < 80) { label = 'Good'; color = 'blue'; }
  if (score < 60) { label = 'Average'; color = 'amber'; }
  if (score < 40) { label = 'Poor'; color = 'rose'; }

  return { score, label, color };
};