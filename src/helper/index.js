export function getRs(rupee) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    // limit to six significant digits (Possible values are from 1 to 21).
    maximumSignificantDigits: 6
  }).format(rupee);
}
export function sortText(text, length) {
  return text.length < length ? text : `${text.slice(0, length)}...`;
}