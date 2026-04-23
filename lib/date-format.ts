const icelandicDateFormatter = new Intl.DateTimeFormat("is-IS", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function formatDateIs(value: string): string {
  if (!value) return "Óskráð dagsetning";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return icelandicDateFormatter.format(date);
}
