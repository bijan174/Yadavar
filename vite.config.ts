import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // این خط حیاتی‌ترین بخش برای گیت‌هاب است:
  base: '/Yadavar/', 
})
