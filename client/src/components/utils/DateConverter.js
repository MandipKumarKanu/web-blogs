export function toDateOnlyISO(date) {
  if (date instanceof Date) {
    return date.toISOString().split("T")[0];
  } else {
    return new Date(date).toISOString().split("T")[0];
  }
}
