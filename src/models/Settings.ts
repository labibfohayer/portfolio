import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    type: { type: String, default: "global", unique: true },
    resumeLink: { type: String, default: "#" },
    githubUrl: { type: String, default: "https://github.com" },
    linkedinUrl: { type: String, default: "https://linkedin.com" },
    facebookUrl: { type: String, default: "https://facebook.com" },
    behanceUrl: { type: String, default: "https://behance.net" },
    instagramUrl: { type: String, default: "https://instagram.com" },
    twitterUrl: { type: String, default: "https://x.com" },
    youtubeUrl: { type: String, default: "https://youtube.com" },
    tiktokUrl: { type: String, default: "https://tiktok.com" },
    theme: { type: String, default: "cyan" }, // For future expansion
    profileViews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
