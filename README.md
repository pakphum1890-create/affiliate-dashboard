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

## วิธีคีย์ข้อมูลของคุณเองเข้าเว็บ

แดชบอร์ดนี้ไม่มีข้อมูลตัวอย่างอีกต่อไป (เอาออกแล้วตามที่แจ้ง) ทุกตัวเลขในหน้า "แดชบอร์ด"
(ยอดขาย, คอมมิชชั่น, กราฟ ฯลฯ) คำนวณจากสิ่งที่คุณกรอกเองในหน้าต่างๆ ดังนี้:

1. **หน้า "คลิปวิดีโอ"** — กรอกชื่อคลิป, ยอดวิว, คลิก, ออเดอร์, ยอดขาย, คอมมิชชั่น ของแต่ละคลิปที่ทำจริง แล้วกด "เพิ่มคลิป"
2. **หน้า "สินค้า"** — กรอกชื่อสินค้า, ออเดอร์, ยอดขาย, คอมมิชชั่น, เลือกแพลตฟอร์ม (TikTok/Shopee) แล้วกด "เพิ่มสินค้า"
3. **หน้า "สปอนเซอร์"** — กรอกชื่อแบรนด์, ประเภทงาน, มูลค่า, กำหนดส่งงาน แล้วกด "เพิ่มดีล"
4. **หน้า "ปฏิทินงาน"** — ใส่วันที่ + เลือกประเภท (ถ่าย/ตัดต่อ/โพสต์) แล้วกด +

พอกรอกครบ กลับไปหน้า "แดชบอร์ด" ตัวเลข KPI, กราฟ, สินค้าขายดี, คลิปที่มาแรง จะอัปเดตให้เองอัตโนมัติ
ทุกอย่างที่กรอกจะถูกบันทึกลง Supabase (ถ้าตั้งค่าไว้แล้ว) ทันที ไม่ต้องกด save เพิ่ม

ลบข้อมูลออกได้โดยกดไอคอนถังขยะ (คลิป/สินค้า/สปอนเซอร์) หรือปุ่ม X มุมขวาบนของช่องวันที่ (ปฏิทิน)
ปุ่มลบตอนนี้แสดงตลอดเวลา ไม่ต้องเอาเมาส์ชี้ก่อน ใช้ได้ทั้งจากคอมและมือถือ



## เชื่อมต่อ Supabase (บันทึกข้อมูลถาวร)

โปรเจกต์นี้ต่อกับ Supabase ไว้แล้วในโค้ด (ดู `lib/supabaseClient.js`)
ถ้าไม่ตั้งค่า Environment Variables ไว้ แดชบอร์ดจะทำงานแบบ "โหมดออฟไลน์" อัตโนมัติ
(ข้อมูลอยู่แค่ในเบราว์เซอร์ รีเฟรชแล้วหาย) — พอตั้งค่าตามด้านล่างแล้ว จะสลับไปบันทึกลง Supabase จริงทันที

1. สร้างตาราง `videos`, `products`, `sponsors`, `calendar`, `live_stats` ใน Supabase (รัน SQL ที่ให้ไว้ใน SQL Editor — ดูตาราง `live_stats` เพิ่มเติมด้านล่าง)
2. ไปที่โปรเจกต์บน Vercel → Settings → Environment Variables ใส่:
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL ของ Supabase (ไม่ต้องมี `/rest/v1/` ต่อท้าย)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Publishable key (ขึ้นต้นด้วย `sb_publishable_...`)
3. Redeploy โปรเจกต์ (Vercel จะ deploy ใหม่อัตโนมัติทุกครั้งที่ push โค้ดขึ้น GitHub)

เมื่อเชื่อมสำเร็จ จะเห็นป้าย "เชื่อมฐานข้อมูลแล้ว" มุมขวาบนของแดชบอร์ด และข้อมูลที่เพิ่ม/ลบทุกหน้า
(คลิปวิดีโอ, สินค้า, สปอนเซอร์, ปฏิทิน) จะบันทึกถาวร เห็นเหมือนกันทุกเครื่องที่เข้าเว็บนี้

## ตาราง live_stats (สำหรับหน้า "ไลฟ์")

รันเพิ่มใน SQL Editor ของ Supabase:

```sql
create table live_stats (
  id bigint primary key,
  sessions int default 0,
  sales numeric default 0,
  avg_viewers int default 0,
  peak_viewers int default 0
);

alter table live_stats enable row level security;
create policy "allow all live_stats" on live_stats for all using (true) with check (true);
```

หน้า "ไลฟ์" มีปุ่ม "แก้ไขตัวเลข" ให้กรอกเองได้เลยในเว็บ (TikTok ยังไม่มี API สาธารณะให้ดึงข้อมูลไลฟ์อัตโนมัติ)

