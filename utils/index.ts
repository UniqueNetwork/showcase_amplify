export const getMonthString = (d = new Date()): string => {
  return `${d.getUTCFullYear()}-${(d.getUTCMonth() + 1).toString().padStart(2, '0')}`
}
