import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema(
  {
    title_vi: String,
    title_en: String,
    teacher: String,
    duration: String,
    format: { type: String, enum: ['VIDEO', 'AUDIO', 'PDF'], default: 'VIDEO' },
    level_vi: String,
    level_en: String,
    tags_vi: { type: [String], default: [] },
    tags_en: { type: [String], default: [] },
    imageSlotId: String,
  },
  { timestamps: true }
);

lectureSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('Lecture', lectureSchema);
