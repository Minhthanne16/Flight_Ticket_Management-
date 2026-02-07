# Flight_Ticket_Management - Contributing Guide

Chào mừng bạn đến với dự án quản lý vé máy bay! Vui lòng đọc kỹ các hướng dẫn sau đây để đảm bảo quy trình làm việc thống nhất và hiệu quả.

## 🛠 Prerequisites (Yêu cầu môi trường)
Để chạy được dự án, máy tính của bạn cần cài đặt:
* **Java SDK:** 17+ (Dùng cho Spring Boot)
* **Maven:** 3.8+
* **Node.js:** >= 18 & **npm:** >= 9
* **Git**

---

## 🌿 Git Workflow (Mô hình Agile)
Chúng ta sử dụng chiến lược nhánh (Branching Strategy) để quản lý các đầu việc trong Sprint.

### 1. Luồng làm việc (Workflow)
**Bước 1: Clone repo & Setup**
```bash
git clone <repo-url>
cd Flight_Ticket_Management
npm install
```
**Bước 2: Bắt đầu Task mới: (Luôn pull từ `develop` mới nhất)**
```bash
    git checkout develop
    git pull origin develop
    git checkout -b feature/nhan-lich-chuyen-bay`
``` 
**Bước 3: Commit & Push: nhớ commit thường xuyên**
```bash
    `git add .
    git commit -m "feat: add flight schedule management api"
    git push origin feature/nhan-lich-chuyen-bay`
```
**Bước 4: Tạo Pull Request (PR):**
```bash
    - Target: `develop` ← Source: `feature/...`
    - Yêu cầu: Có mô tả rõ ràng, đã qua bộ lọc kiểm tra (CI/CD).
```
**Bước 5: Sau khi yêu cầu được merge, xóa branch local:**
```bash
    - git checkout develop
    - git pull origin develop
    - git branch -d ten_branch
```