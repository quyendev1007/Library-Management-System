📚 Library Management System - Backend
Đây là phần backend cho hệ thống quản lý thư viện, được xây dựng bằng Node.js, Express và MongoDB.

🚀 Công nghệ sử dụng
Node.js + Express – xây dựng API RESTful

MongoDB + Mongoose – cơ sở dữ liệu NoSQL

JWT Authentication – xác thực người dùng

RBAC (Role-based access control) – phân quyền truy cập

Joi – xác thực dữ liệu đầu vào

▶️ Khởi động project
npm install
npm run dev

📦 API Endpoints
📘 Books
Base URL: /books

GET	/	Lấy tất cả sách	Không cần xác thực
GET	/:id	Lấy thông tin sách theo ID	Không cần xác thực
POST	/	Tạo sách mới	isAuthorized, admin
PUT	/:id	Cập nhật sách theo ID	isAuthorized, admin
DELETE	/:id	Xoá sách theo ID	isAuthorized, admin

🛡️ Tất cả các route POST, PUT, DELETE đều yêu cầu quyền "admin"

📚 Các route khác
Module	Base URL
Auth	/auth
Users	/users
Authors	/authors
Publishers	/publishers
Categories	/categories
Borrows	/borrows
Carts	/carts

