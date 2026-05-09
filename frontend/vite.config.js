import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'  // ← thêm dòng này

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),  // ← thêm dòng này
  ],
  server: {
    port: 3000,      // Ép chạy trên cổng 3000
    strictPort: true // Nếu cổng 3000 bị chiếm, nó sẽ báo lỗi chứ không tự đổi sang cổng khác
  }
})