/**
 * Some backend responses (e.g. playlist videos) represent media fields
 * as `{ url: "..." }` objects, while most others (video list/detail,
 * user avatar/coverImage) represent them as plain URL strings. This
 * helper normalizes either shape to a plain URL string so components
 * don't need to special-case it.
 */
export function getMediaUrl(field) {
  if (!field) return "";
  if (typeof field === "string") return field;
  if (typeof field === "object" && typeof field.url === "string") return field.url;
  return "";
}
