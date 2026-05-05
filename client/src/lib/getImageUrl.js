const SERVER_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") ||
  "http://localhost:4000";

export const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${SERVER_URL}${path}`;
};