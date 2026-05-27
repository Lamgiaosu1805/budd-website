import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    day: String,
    monthShort_vi: String,
    monthShort_en: String,
    month_vi: String,
    month_en: String,
    date_vi: String,
    date_en: String,
    title_vi: String,
    title_en: String,
    desc_vi: String,
    desc_en: String,
    type_vi: String,
    type_en: String,
    duration_vi: String,
    duration_en: String,
    location: String,
    live: { type: Boolean, default: false },
    attendees_vi: String,
    attendees_en: String,
    imageSlotId: String,
  },
  { timestamps: true }
);

eventSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('Event', eventSchema);
