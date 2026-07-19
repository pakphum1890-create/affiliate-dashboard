# Affiliate Dashboard

แดชบอร์ดสำหรับ TikTok + Shopee Affiliate สร้างด้วย Next.js 14, Tailwind CSS, Recharts

## วิธี deploy ผ่าน Vercel (แนะนำ)

1. อัปโหลดโฟลเดอร์นี้ทั้งหมดขึ้น GitHub repo ของคุณ
   (ลากไฟล์/โฟลเดอร์ทั้งหมดในนี้ไปวางที่หน้า "uploading an existing file" บน GitHub)
2. เข้า https://vercel.com แล้ว Sign in ด้วยบัญชี GitHub
3. กด "New Project" แล้วเลือก repo `affiliate-dashboard`
4. Vercel จะตรวจพบว่าเป็นโปรเจกต์ Next.js อัตโนมัติ กด "Deploy" ได้เลย ไม่ต้องตั้งค่าอะไรเพิ่ม
5. รอสักครู่ จะได้ลิงก์เว็บจริง เช่น `affiliate-dashboard.vercel.app`

## รันทดสอบในเครื่องตัวเอง (ถ้ามี Node.js)

```bash
npm install
npm run dev
```

เปิดเบราว์เซอร์ไปที่ http://localhost:3000

## โครงสร้างไฟล์

- `app/page.jsx` — หน้าแรกของเว็บ เรียกใช้ component Dashboard
- `app/layout.jsx` — โครงหลักของเว็บ (head, body)
- `components/Dashboard.jsx` — โค้ดแดชบอร์ดทั้งหมด
- `app/globals.css` — ไฟล์ตั้งต้น Tailwind CSS

## ขั้นตอนต่อไป (แนะนำ)

ตอนนี้ข้อมูลในแดชบอร์ด (คลิป, สินค้า, สปอนเซอร์, ปฏิทิน) เก็บอยู่ใน state ของหน้าเว็บเท่านั้น
รีเฟรชหน้าแล้วข้อมูลจะรีเซ็ต ถ้าต้องการให้ข้อมูลบันทึกถาวรและอัปเดตได้โดยไม่ต้อง deploy ใหม่ทุกครั้ง
แนะนำให้ต่อฐานข้อมูล เช่น Supabase (supabase.com ฟรี)
