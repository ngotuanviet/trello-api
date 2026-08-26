# 📋 Trello Clone API - Backend Service

Hệ thống RESTful API & Realtime Backend cho ứng dụng quản lý công việc theo mô hình Trello Kanban Board, được xây dựng trên nền tảng **Node.js**, **Express**, **MongoDB** kết hợp **Socket.io** cho trải nghiệm thời gian thực.

---

## 🚀 Tính Năng Chính

- 🔐 **Xác thực & Ủy quyền (Authentication & Authorization)**:
  - Đăng ký tài khoản, gửi email xác thực kích hoạt tài khoản qua Resend / Brevo.
  - Đăng nhập, đăng xuất, cơ chế bảo mật với **Access Token** & **Refresh Token** (HTTP-Only Cookie).
  - Quản lý thông tin cá nhân, cập nhật mật khẩu, cập nhật Avatar qua Cloudinary.
- 📌 **Quản lý Bảng (Board Management)**:
  - Tạo bảng, cập nhật, xóa bảng, lấy danh sách bảng có phân trang (pagination).
  - Quản lý thành viên trong bảng, phân quyền (Owner, Member).
  - Mời thành viên tham gia bảng qua Email & thông báo thời gian thực (Real-time Invitations).
- 📑 **Quản lý Cột (Column Management)**:
  - Tạo mới, đổi tên, xóa cột (và toàn bộ thẻ bên trong).
  - Cập nhật thứ tự các cột trên bảng.
- 🗂️ **Quản lý Thẻ (Card Management)**:
  - Thêm mới thẻ, đổi tiêu đề, mô tả.
  - Kéo thả thẻ (Drag & Drop) trong cùng một cột hoặc giữa các cột khác nhau.
  - Upload ảnh bìa / tệp đính kèm (Attachments) lên Cloudinary.
  - Thành viên trong thẻ (Members), Bình luận (Comments) realtime.
- ⚡ **Giao tiếp Thời gian thực (Real-time with Socket.io)**:
  - Đồng bộ tức thì các thao tác kéo thả Column/Card giữa nhiều người dùng trên cùng một bảng.
  - Thông báo lời mời vào bảng (Board Invitations) theo thời gian thực.
- 🛡️ **Bảo mật & Chuẩn hóa Dữ liệu**:
  - Validate dữ liệu đầu vào bằng **Joi**.
  - Xử lý lỗi tập trung (Centralized Error Handling) & chuẩn hóa mã lỗi HTTP với `http-status-codes`.
  - CORS, Cookie Parser, Async Exit Hook đảm bảo đóng kết nối Database an toàn khi tắt server.

---

## 🛠️ Công Nghệ Sử Dụng

| Danh mục | Công nghệ / Thư viện |
| :--- | :--- |
| **Môi trường & Framework** | Node.js, Express.js (v5) |
| **Cơ sở dữ liệu** | MongoDB (Official MongoDB Native Driver) |
| **Realtime Engine** | Socket.io |
| **Trình biên dịch & Tooling** | Babel (ES6+ Module import/export), Nodemon, ESLint |
| **Xác thực & Bảo mật** | JSON Web Token (`jsonwebtoken`), `bcrypt`, `cookie-parser` |
| **Validation** | Joi |
| **Media / File Upload** | Multer, Cloudinary, Streamifier |
| **Email Service** | Resend, Brevo (`@getbrevo/brevo`) |

---

## 📂 Cấu Trúc Dự Án

Dự án áp dụng kiến trúc chuẩn phân tầng **Controller - Service - Model**:

```text
trello-api/
├── src/
│   ├── config/             # Cấu hình môi trường, Database (MongoDB), CORS, Cloudinary...
│   ├── controllers/        # Tiếp nhận Request, điều hướng logic và trả về Response
│   ├── middlewares/        # Auth middleware, upload middleware, error handling middleware
│   ├── models/             # Schema & tương tác trực tiếp với MongoDB collections
│   ├── providers/          # Tích hợp dịch vụ bên thứ 3 (Cloudinary, Resend, Brevo, JWT...)
│   ├── routes/             # Định tuyến API (v1, v2...)
│   │   └── v1/             # Endpoint V1: board, column, card, user, invitation
│   ├── services/           # Xử lý toàn bộ nghiệp vụ (Business Logic)
│   ├── sockets/            # Khởi tạo và xử lý các sự kiện Socket.io realtime
│   ├── utils/              # Các hàm tiện ích, constants, formatters, validators
│   ├── validations/        # Joi schema validation cho request body/params/query
│   └── server.js           # Điểm khởi chạy ứng dụng (Entry point)
├── .babelrc                # Cấu hình Babel
├── .eslintrc.cjs           # Cấu hình ESLint
├── .env.example            # Mẫu cấu hình biến môi trường
├── package.json            # Thông tin dependencies và scripts
└── README.md
```

---

## ⚙️ Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### 1. Yêu cầu môi trường
- **Node.js**: Phiên bản `>= 18.x` hoặc mới nhất
- **NPM** hoặc **Yarn**
- **MongoDB**: MongoDB Atlas Cluster hoặc Local MongoDB instance

### 2. Cài đặt Dependencies

```bash
# Clone repository
git clone <URL_REPO>
cd trello-api

# Cài đặt các gói thư viện
npm install
# hoặc
yarn install
```

### 3. Cấu hình biến môi trường (`.env`)

Tạo file `.env` từ file `.env.example` và điền các thông số tương ứng:

```bash
cp .env.example .env
```

Nội dung cấu hình mẫu:

```env
# Server Config
PORT=8017
HOSTNAME=localhost
DOMAIN_DEV=http://localhost:5173
DOMAIN_PRO=https://your-production-app.com

# Database Config
MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=trello-api-database

# Email Service Config (Resend / Brevo)
RESEND_APIKEY=re_xxxxxxxxxxxxxxxx
ADMIN_EMAIL_ADDRESS=no-reply@yourdomain.com
ADMIN_EMAIL_NAME=Trello Support

# JWT Authentication Config
ACCESS_SECRET_SIGNATURE=your_jwt_access_secret_key
ACCESS_TOKEN_LIFE=1h
REFRESH_SECRET_SIGNATURE=your_jwt_refresh_secret_key
REFRESH_TOKEN_LIFE=14d

# Cloudinary Config
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Khởi chạy Ứng dụng

```bash
# Chạy ở môi trường Development (Auto-reload với nodemon + Babel)
npm run dev

# Kiểm tra cú pháp & Lint code
npm run lint

# Build mã nguồn sang ES5 (Production)
npm run build

# Chạy bản build ở môi trường Production
npm run production
```

Sau khi chạy lệnh `npm run dev`, server sẽ lắng nghe tại: `http://localhost:8017`

---

## 📡 Danh Sách API Endpoints (v1)

Root URL: `/v1`

### 1. 👥 Người dùng (Users) - `/v1/users`
| Phương thức | Endpoint | Mô tả | Yêu cầu xác thực |
| :--- | :--- | :--- | :---: |
| `POST` | `/register` | Đăng ký tài khoản mới | ❌ |
| `PUT` | `/verify` | Xác thực tài khoản qua email token | ❌ |
| `POST` | `/login` | Đăng nhập hệ thống | ❌ |
| `DELETE`| `/logout` | Đăng xuất, xóa cookies | ✅ |
| `GET` | `/refresh_token` | Cấp mới Access Token bằng Refresh Token | ❌ |
| `PUT` | `/update` | Cập nhật thông tin / avatar / đổi mật khẩu | ✅ |

### 2. 📋 Bảng làm việc (Boards) - `/v1/boards`
| Phương thức | Endpoint | Mô tả | Yêu cầu xác thực |
| :--- | :--- | :--- | :---: |
| `GET` | `/` | Lấy danh sách Board của người dùng (có phân trang) | ✅ |
| `POST` | `/` | Tạo mới một Board | ✅ |
| `GET` | `/:id` | Lấy chi tiết Board (kèm danh sách Columns & Cards) | ✅ |
| `PUT` | `/:id` | Cập nhật thông tin Board | ✅ |
| `PUT` | `/supports/moving_cards` | Cập nhật vị trí Card khi kéo thả giữa các Column khác nhau | ✅ |

### 3. 📑 Cột (Columns) - `/v1/columns`
| Phương thức | Endpoint | Mô tả | Yêu cầu xác thực |
| :--- | :--- | :--- | :---: |
| `POST` | `/` | Tạo mới Column | ✅ |
| `PUT` | `/:id` | Cập nhật Column (tiêu đề, thứ tự cardIds...) | ✅ |
| `DELETE`| `/:id` | Xóa Column và các Cards thuộc Column | ✅ |

### 4. 🗂️ Thẻ công việc (Cards) - `/v1/cards`
| Phương thức | Endpoint | Mô tả | Yêu cầu xác thực |
| :--- | :--- | :--- | :---: |
| `POST` | `/` | Tạo mới Card | ✅ |
| `PUT` | `/:id` | Cập nhật chi tiết Card (Title, Description, Cover, Comments, Members...) | ✅ |

### 5. ✉️ Lời mời (Invitations) - `/v1/invitations`
| Phương thức | Endpoint | Mô tả | Yêu cầu xác thực |
| :--- | :--- | :--- | :---: |
| `POST` | `/board` | Gửi lời mời tham gia Board cho người dùng khác | ✅ |
| `GET` | `/` | Lấy danh sách lời mời của người dùng hiện tại | ✅ |
| `PUT` | `/board/:invitationId` | Phản hồi lời mời (Accept / Reject) | ✅ |

---

## 🔌 Socket.io Events (Real-time)

| Event Name | Chiều | Mô tả |
| :--- | :--- | :--- |
| `FE_USER_INVITED_TO_BOARD` | Client ➔ Server ➔ Client | Thông báo cho user khi nhận được lời mời vào Board mới |
| `FE_MOVE_CARD_TO_DIFFERENT_COLUMN` | Client ➔ Server ➔ Client | Broadcast dữ liệu khi có thành viên kéo thả Card sang cột khác |

---

## 📝 License
Dự án được phân phối dưới giấy phép **ISC License**.
