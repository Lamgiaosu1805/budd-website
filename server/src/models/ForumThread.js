import mongoose from 'mongoose';

const ForumThreadSchema = new mongoose.Schema({
  avatar:    { type: String, default: '❓' },
  title:     { type: String, required: true, maxlength: 200 },
  preview:   { type: String, required: true },
  author:    { type: String, default: 'anonymous' },
  topic:     { type: String, default: '' },
  replied:   { type: Boolean, default: false },
  byTeacher: { type: Boolean, default: false },
  replies:   { type: Number, default: 0 },
  views:     { type: Number, default: 1 },
}, { timestamps: true });

export default mongoose.model('ForumThread', ForumThreadSchema);
