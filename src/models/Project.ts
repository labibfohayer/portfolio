import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    role: { type: String, required: true },
    desc: { type: String, required: true },
    tech: [{ type: String }],
    image: { type: String },
    contributions: [{ type: String }],
    liveUrl: { type: String },
    githubUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
