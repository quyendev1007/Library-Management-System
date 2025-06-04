import mongoose from "mongoose";

const authorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    bio: String,
    dateOfBirth: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Author = mongoose.model("Author", authorSchema);
export default Author;
