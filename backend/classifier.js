const K = 5;
const MAX_DISTANCE = 1.2;

const distance = (a, b) =>
  Math.sqrt(a.reduce((sum, value, i) => sum + (value - b[i]) ** 2, 0));

export const predict = (samples, features) => {
  const nearest = samples
    .map((sample) => ({ label: sample.label, dist: distance(sample.features, features) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, K);

  if (nearest.length === 0 || nearest[0].dist > MAX_DISTANCE) {
    return { label: null, confidence: 0 };
  }

  const votes = {};
  nearest.forEach((item) => {
    votes[item.label] = (votes[item.label] || 0) + 1;
  });

  const [label, count] = Object.entries(votes).sort((a, b) => b[1] - a[1])[0];
  return { label, confidence: count / nearest.length };
};