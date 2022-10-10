export function getDifferenceBetweenDates(dateA, dateB) {
  return Math.abs(dateB.getTime() - dateA.getTime());
}
