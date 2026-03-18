// Utility to generate a unique loan code based on name and timestamp
export function generateLoanCode(name) {
  if (!name) return "LOAN-" + Date.now();
  const base = name
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase();
  return `${base}_${Date.now().toString().slice(-6)}`;
}
