import mongoose from 'mongoose';

const teacherEventSchema = new mongoose.Schema(
  {
    year: String,
    season_vi: String,
    season_en: String,
    title_vi: String,
    title_en: String,
    attendees_vi: String,
    attendees_en: String,
    location: String,
    imageSlotId: String,
  },
  { timestamps: true }
);

teacherEventSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('TeacherEvent', teacherEventSchema);
