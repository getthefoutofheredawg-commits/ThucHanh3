# Bài tập 3 - Fullstack Auth + CRUD (React Router + Context + localStorage + ASP.NET Core + EF Core)

Kết hợp Bài tập 1 và Bài tập 2 cùng luồng Đăng ký / Đăng nhập hoàn chỉnh:
- **Backend (`backend/`)**: ASP.NET Core 9 Web API + EF Core + SQLite (`Users`, `Rooms` + Migrations), validate `RegisterRequest`/`LoginRequest`, hash mật khẩu bằng `PasswordHasher<User>`, truy vấn DB khi đăng nhập và cấp JWT Bearer token.
- **Frontend (`frontend/`)**: React + Vite + `react-router-dom` + Axios + `AuthContext` lưu `smartstay_token` & `smartstay_user` vào `localStorage`, bảo vệ route `/manage-rooms`.

## Hướng dẫn chạy
### 1. Backend
```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run
```
### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Truy cập `http://localhost:3000`.
