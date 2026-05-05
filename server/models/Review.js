import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    event: { type: String, required: true }, // e.g. "Graduation Party"
    city: { type: String, required: true },
    state: { type: String, default: 'GA' },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    text: { type: String, required: true },
    postmark: {
      city: String,
      date: String, // e.g. "Mar 12"
      year: String, // e.g. "Ga · 2025"
    },
    emoji: { type: String, default: '🎉' },
    bg: { type: String, default: 'bg-1' },
    featured: { type: Boolean, default: true, index: true },
    reviewDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Review = mongoose.model('Review', reviewSchema);
