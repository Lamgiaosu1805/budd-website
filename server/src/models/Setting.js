import mongoose from 'mongoose';

// Simple key-value store for site-wide settings
const SettingSchema = new mongoose.Schema({
  key:   { type: String, required: true, unique: true },
  value: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Setting', SettingSchema);
