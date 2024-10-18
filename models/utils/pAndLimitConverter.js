exports.pAndLimitConverter = (p, limit) => {
  const convertedPAndLimit = [];

  limit = Number(limit);
  p = Number(p);

  if (!limit || Number.isNaN(limit) || limit <= 0) {
    limit = 10;
  }

  if (!p || Number.isNaN(p) || p <= 0) {
    p = 1;
  }

  p = (p - 1) * limit;

  convertedPAndLimit.push(p);
  convertedPAndLimit.push(limit);

  return convertedPAndLimit;
};
