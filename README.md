# Budd Website

Monorepo: **client** (Vite + React) + **server** (Express + Mongoose + JWT).

## Cấu trúc

```
budd-website/
├── client/                Vite + React frontend
│   ├── public/image-slot.js
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/      LanguageContext, AuthContext, CMSContext
│   │   ├── lib/api.js     fetch wrapper + token handling
│   │   ├── pages/         AdminPage, LoginPage, RegisterPage
│   │   ├── pages.jsx      Home/Tantra/Teacher/Lectures/Events/Prayer/Forum
│   │   ├── App.jsx        Nav + Footer + hash router
│   │   ├── main.jsx       Provider tree
│   │   └── styles.css
│   ├── index.html
│   └── vite.config.js     proxy /api → :4000
├── server/                Express API
│   ├── src/
│   │   ├── models/        User, Event, Lecture, TeacherEvent
│   │   ├── routes/        auth, events, lectures, teacher-events
│   │   ├── middleware/auth.js
│   │   ├── seed-admin.js  auto-creates admin on first boot
│   │   ├── seed.js        npm run seed → insert sample data
│   │   └── index.js
│   ├── .env               (gitignored — contains Mongo URI + JWT secret)
│   └── .env.example
└── package.json           npm workspaces
```

## Setup lần đầu

```sh
npm install
```

Kiểm tra `server/.env` đã có connection string MongoDB.

## Chạy dev

```sh
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:4000

Vite proxy `/api/*` về server, không cần CORS khi dev.

Lần đầu server boot sẽ tự tạo admin từ biến `ADMIN_DEFAULT_*` trong `.env`.

## Seed dữ liệu mẫu (tùy chọn)

```sh
npm run seed
```

Insert 4 events + 6 lectures + 4 teacher events nếu các collection còn rỗng.

## Build production

```sh
npm run build        # build client/dist
npm start            # chạy server (serve API; client cần host riêng hoặc thêm static)
```

## Tài khoản mặc định

- Admin: `admin@budd.local` / `Admin@1234` — **đổi password ngay sau lần đăng nhập đầu** (đang chỉ đổi qua DB; chưa có UI đổi password).
- User thường: đăng ký qua `/#register`.

## Auth flow

- JWT lưu trong `localStorage` key `kct_auth_token`.
- `AuthContext` rehydrate user qua `GET /api/auth/me` mỗi lần load.
- Trang `#admin` chỉ render khi `user.role === 'admin'`. Nếu chưa đăng nhập → tự chuyển sang `#login`. Nếu đăng nhập sai role → 403.

## API

| Method | Path                    | Auth     | Mô tả                  |
|--------|-------------------------|----------|------------------------|
| GET    | /api/health             | -        | Kiểm tra Mongo + server|
| POST   | /api/auth/register      | -        | Tạo tài khoản user     |
| POST   | /api/auth/login         | -        | Trả về JWT             |
| GET    | /api/auth/me            | Bearer   | User hiện tại          |
| GET    | /api/events             | -        | List                   |
| POST   | /api/events             | admin    | Tạo                    |
| PUT    | /api/events/:id         | admin    | Cập nhật               |
| DELETE | /api/events/:id         | admin    | Xóa                    |
| ...    | /api/lectures, /api/teacher-events giống pattern trên |

## Files gốc (legacy)

Các file root cũ (`app.jsx`, `cms.jsx`, `pages.jsx`, `admin.jsx`, `i18n.jsx`, `index.html`, `styles.css`) còn để tham khảo. Sau khi xác nhận bản mới chạy ổn, có thể xóa để gọn.

## Bảo mật

- `server/.env` đã được `.gitignore`. KHÔNG commit file này.
- Đổi `JWT_SECRET` thành chuỗi ngẫu nhiên dài trước khi deploy production.
- Đổi `ADMIN_DEFAULT_PASSWORD` (hoặc xóa hẳn 2 biến `ADMIN_DEFAULT_*` sau khi đã tạo admin xong).
- Password người dùng được hash bằng `bcrypt` (cost 10).
