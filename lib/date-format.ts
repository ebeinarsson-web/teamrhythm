export function formatDateIs(value: string): string {
  if (!value) return "Óskráð dagsetning";

  const dateOnlyMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    return `${day}.${month}.${year}`;
  }

  const dateTime = new Date(value);
  if (Number.isNaN(dateTime.getTime())) return value;

  const day = String(dateTime.getUTCDate()).padStart(2, "0");
  const month = String(dateTime.getUTCMonth() + 1).padStart(2, "0");
  const year = String(dateTime.getUTCFullYear());
  return `${day}.${month}.${year}`;
}
