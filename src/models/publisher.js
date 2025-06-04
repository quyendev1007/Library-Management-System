import mongoose from "mongoose";

const publisherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: String,
    phone: String,
    email: String,
    website: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Publisher = mongoose.model("Publisher", publisherSchema);
export default Publisher;
