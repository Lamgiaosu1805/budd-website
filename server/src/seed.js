import 'dotenv/config';
import mongoose from 'mongoose';
import Event from './models/Event.js';
import Lecture from './models/Lecture.js';
import TeacherEvent from './models/TeacherEvent.js';
import { ensureSeedAdmin } from './seed-admin.js';

const SEED_EVENTS = [
  { day: '15', monthShort_vi: 'TH06', monthShort_en: 'JUN', month_vi: 'Tháng 6 · 2026', month_en: 'June · 2026', date_vi: '15.06 — 22.06', date_en: 'Jun 15 — 22', title_vi: 'Khóa nhập thất Vajrasattva 7 ngày', title_en: '7-Day Vajrasattva Purification Retreat', desc_vi: 'Thanh tịnh nghiệp chướng qua thực hành Vajrasattva 100 âm thần chú.', desc_en: 'Purifying karmic obscurations through the 100-syllable mantra.', type_vi: 'Nhập thất', type_en: 'Retreat', duration_vi: '7 ngày', duration_en: '7 days', location: 'Samye Memorial, Kathmandu', live: false, attendees_vi: '120/150 hành giả', attendees_en: '120/150 practitioners', imageSlotId: 'event-img-1' },
  { day: '21', monthShort_vi: 'TH06', monthShort_en: 'JUN', month_vi: 'Tháng 6 · 2026', month_en: 'June · 2026', date_vi: '21.06 · 19:00', date_en: 'Jun 21 · 7 PM', title_vi: 'Pháp thoại "Ngöndro — Pháp tu căn bản Dudjom Tersar"', title_en: 'Teaching: "Ngöndro — Dudjom Tersar Preliminaries"', desc_vi: 'Rinpoche giảng giải 4 quán tưởng tiền hành và 5 pháp tu chánh hành.', desc_en: 'Rinpoche explains the four contemplations and five main practices.', type_vi: 'Pháp thoại', type_en: 'Teaching', duration_vi: '2 giờ', duration_en: '2 hours', location: 'Online · Zoom', live: true, imageSlotId: 'event-img-2' },
  { day: '03', monthShort_vi: 'TH07', monthShort_en: 'JUL', month_vi: 'Tháng 7 · 2026', month_en: 'July · 2026', date_vi: '03.07 · 20:00', date_en: 'Jul 3 · 8 PM', title_vi: 'Đêm tụng Lục Tự Đại Minh Chú', title_en: 'Avalokiteśvara Mantra Recitation Evening', desc_vi: 'Đồng tu mantra Quán Thế Âm, hồi hướng công đức cho toàn pháp giới.', desc_en: 'Group recitation of the six-syllable mantra and dedication of merit.', type_vi: 'Lễ hội', type_en: 'Ceremony', duration_vi: '3 giờ', duration_en: '3 hours', location: 'Online + Hanoi', live: true, imageSlotId: 'event-img-3' },
  { day: '12', monthShort_vi: 'TH07', monthShort_en: 'JUL', month_vi: 'Tháng 7 · 2026', month_en: 'July · 2026', date_vi: '12.07 — 14.07', date_en: 'Jul 12 — 14', title_vi: 'Khóa Guḥyagarbha Tantra — Cao cấp', title_en: 'Guḥyagarbha Tantra — Advanced Teachings', desc_vi: 'Truyền giảng tantra cốt lõi của dòng Nyingma cho học trò có Empowerment.', desc_en: 'Core tantra of the Nyingma lineage for empowered students.', type_vi: 'Khóa cao cấp', type_en: 'Advanced', duration_vi: '3 ngày', duration_en: '3 days', location: 'Ho Chi Minh City', live: false, imageSlotId: 'event-img-4' },
];

const SEED_LECTURES = [
  { title_vi: 'Ngöndro Dudjom Tersar — Bốn quán tưởng tiền hành', title_en: 'Dudjom Tersar Ngöndro — The Four Contemplations', teacher: 'Khenpo Rinpoche', duration: '1h 42m', format: 'VIDEO', level_vi: 'Trung cấp', level_en: 'Intermediate', tags_vi: ['Kinh điển', 'Quán tưởng'], tags_en: ['Sūtra', 'Visualization'], imageSlotId: 'lec-img-1' },
  { title_vi: 'Lục Tự Đại Minh Chú — Ý nghĩa và hành trì', title_en: 'Oṃ Maṇi Padme Hūṃ — Meaning and Practice', teacher: 'Khenpo Rinpoche', duration: '58m', format: 'AUDIO', level_vi: 'Nhập môn', level_en: 'Beginner', tags_vi: ['Thần chú'], tags_en: ['Mantra'], imageSlotId: 'lec-img-2' },
  { title_vi: 'Bardo Thodol — Sáu trạng thái trung ấm', title_en: 'Bardo Thödol — The Six Intermediate States', teacher: 'Khenpo Rinpoche', duration: '2h 15m', format: 'VIDEO', level_vi: 'Cao cấp', level_en: 'Advanced', tags_vi: ['Bardo'], tags_en: ['Bardo'], imageSlotId: 'lec-img-3' },
  { title_vi: 'Bát-nhã Tâm Kinh — Bản dịch & chú giải', title_en: 'Heart Sūtra — Translation & Commentary', teacher: 'Khenpo Rinpoche', duration: '128 trang', format: 'PDF', level_vi: 'Nhập môn', level_en: 'Beginner', tags_vi: ['Kinh điển', 'Sách PDF'], tags_en: ['Sūtra', 'PDF Book'], imageSlotId: 'lec-img-4' },
  { title_vi: 'Dzogchen — Tự tánh trống rỗng', title_en: 'Dzogchen — The Empty Nature of Mind', teacher: 'Khenpo Rinpoche', duration: '3h 04m', format: 'VIDEO', level_vi: 'Cao cấp', level_en: 'Advanced', tags_vi: ['Dzogchen'], tags_en: ['Dzogchen'], imageSlotId: 'lec-img-5' },
  { title_vi: 'Nghi quỹ Vajrasattva 100 âm', title_en: '100-Syllable Vajrasattva Sādhana', teacher: 'Khenpo Rinpoche', duration: '46m', format: 'AUDIO', level_vi: 'Trung cấp', level_en: 'Intermediate', tags_vi: ['Thần chú', 'Lễ khóa'], tags_en: ['Mantra', 'Ritual'], imageSlotId: 'lec-img-6' },
];

const SEED_TEACHER_EVENTS = [
  { year: '2024', season_vi: 'XUÂN', season_en: 'SPRING', title_vi: 'Đại lễ Phật Đản lần thứ 2566 · Khách mời chính', title_en: 'Chief guest at the 2566th Buddha Jayanti', attendees_vi: 'Cộng đồng Phật tử Nepal', attendees_en: 'Nepali Buddhist community', location: 'Ashoka Mangal Bodhi Mahayana Gumba, Patan, Nepal', imageSlotId: 'te-img-1' },
  { year: '2024', season_vi: 'HẠ', season_en: 'SUMMER', title_vi: 'Khóa nhập thất Vajrasattva 21 ngày', title_en: '21-Day Vajrasattva Retreat', attendees_vi: '180 hành giả', attendees_en: '180 practitioners', location: 'Samye Memorial Buddhist Vihara, Kathmandu', imageSlotId: 'te-img-2' },
  { year: '2023', season_vi: 'THU', season_en: 'AUTUMN', title_vi: 'Chuyến hoằng pháp Việt Nam (một tháng)', title_en: 'Month-long teaching tour in Vietnam', attendees_vi: 'Cộng đồng học trò Việt Nam', attendees_en: 'Vietnamese student community', location: 'Hà Nội · TP.HCM · Đà Nẵng', imageSlotId: 'te-img-3' },
  { year: '2023', season_vi: 'ĐÔNG', season_en: 'WINTER', title_vi: 'Pháp hội Ngöndro Dudjom Tersar — 7 đêm', title_en: 'Dudjom Tersar Ngöndro teachings — 7 nights', attendees_vi: '2,100 hành giả', attendees_en: '2,100 practitioners', location: 'Trực tuyến · 12 quốc gia', imageSlotId: 'te-img-4' },
];

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB. Seeding…');

  await ensureSeedAdmin();

  if ((await Event.countDocuments()) === 0) {
    await Event.insertMany(SEED_EVENTS);
    console.log(`Inserted ${SEED_EVENTS.length} events`);
  } else {
    console.log('Events collection already has data — skipping');
  }
  if ((await Lecture.countDocuments()) === 0) {
    await Lecture.insertMany(SEED_LECTURES);
    console.log(`Inserted ${SEED_LECTURES.length} lectures`);
  } else {
    console.log('Lectures collection already has data — skipping');
  }
  if ((await TeacherEvent.countDocuments()) === 0) {
    await TeacherEvent.insertMany(SEED_TEACHER_EVENTS);
    console.log(`Inserted ${SEED_TEACHER_EVENTS.length} teacher events`);
  } else {
    console.log('TeacherEvents collection already has data — skipping');
  }

  await mongoose.disconnect();
  console.log('Done.');
}

run().catch((e) => { console.error(e); process.exit(1); });
