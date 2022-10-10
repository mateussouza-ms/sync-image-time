/**
 *
 * @param {Date} dateA
 * @param {Date} dateB
 * @returns {number} Time difference in milliseconds
 */
export function getDifferenceBetweenDates(dateA, dateB) {
  return Math.abs(dateB.getTime() - dateA.getTime());
}
