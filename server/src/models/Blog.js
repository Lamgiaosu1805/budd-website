import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title_vi: String,
    title_en: String,
    body_vi: String,
    body_en: String,
    imageUrl: String,
    tags_vi: { type: [String], default: [] },
    tags_en: { type: [String], default: [] },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

blogSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('Blog', blogSchema);
