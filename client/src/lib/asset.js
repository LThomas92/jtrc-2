const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const getImageUrl = (path) => {
  if (!path) return "";

  // already full URL (Cloudinary etc.)
  if (path.startsWith("http")) return path;

  return `${API_URL}/${path}`;
};