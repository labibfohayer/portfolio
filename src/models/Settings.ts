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
    theme: { type: String, default: "cyan" }, // For future expansion
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
