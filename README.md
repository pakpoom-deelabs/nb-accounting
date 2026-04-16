# NB Accounting Visa Services

เว็บไซต์ landing page ของ **NB Accounting Visa Services** — สำนักงานบัญชี · วีซ่า · ใบอนุญาตทำงาน · ที่ปรึกษาภาษี · จดทะเบียนบริษัท · รายงานธุรกิจเฉพาะทาง (กัญชา, แลกเปลี่ยนเงินตรา)

---

## โครงสร้างโปรเจกต์

```
.
├── index.html          # หน้าเว็บหลัก (single-page, Thai/English)
├── images/             # รูปภาพทั้งหมด (logo, team, office)
├── robots.txt          # SEO: คำสั่งให้ crawler
├── sitemap.xml         # SEO: แผนผังเว็บ
├── vercel.json         # Vercel config (headers, caching, redirects)
├── package.json        # สคริปต์ dev / format / validate
├── .gitignore          # ไฟล์ที่ git จะไม่ track
├── .vercelignore       # ไฟล์ที่ Vercel จะไม่ deploy
└── .github/workflows/  # CI workflow (HTML validation)
```

---

## รันเครื่องของคุณเอง (Local dev)

ต้องมี **Node.js 18+**

```bash
# ติดตั้งและรัน dev server ที่ http://localhost:3000
npm run dev
```

หรือถ้าไม่อยากใช้ Node แค่เปิดไฟล์ตรง ๆ ก็ได้

```bash
open index.html       # macOS
xdg-open index.html   # Linux
```

---

## Push ขึ้น GitHub

1. สร้าง repository ใหม่บน GitHub (ชื่อแนะนำ: `nb-accounting-website`)

2. รันคำสั่งในโฟลเดอร์นี้

```bash
git init
git add .
git commit -m "Initial commit — NB Accounting landing page"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/nb-accounting-website.git
git push -u origin main
```

---

## Deploy บน Vercel

### วิธีที่ 1 — เชื่อม GitHub (แนะนำ)

1. เข้า [vercel.com/new](https://vercel.com/new)
2. เลือก Import Project จาก GitHub repo ที่ push ไว้
3. Vercel จะตรวจพบว่าเป็นเว็บ static อัตโนมัติ — กด Deploy ได้เลย
4. ทุกครั้งที่ push เข้า `main` Vercel จะ deploy ให้อัตโนมัติ

### วิธีที่ 2 — Vercel CLI

```bash
npm i -g vercel
vercel           # preview deploy
vercel --prod    # production deploy
```

### ผูกโดเมนจริง

หลัง deploy ครั้งแรก ให้เข้า Vercel Dashboard → Project → Settings → Domains แล้วเพิ่มโดเมน (เช่น `nbaccounting.com`) ตามคำแนะนำของ Vercel

---

## หลัง deploy แล้วต้องอัปเดต 3 จุด

1. **`sitemap.xml`** — เปลี่ยน `https://nbaccounting.com/` ให้เป็นโดเมนจริง
2. **`robots.txt`** — อัปเดตบรรทัด `Sitemap:` ให้ตรงกับโดเมน
3. **`index.html`** — เปลี่ยน `<meta property="og:url">` และ `<link rel="canonical">` ให้ตรงกับโดเมนจริง

---

## สิ่งที่ควรทำต่อ (แนะนำ)

- [ ] เพิ่ม Google Analytics 4 / Tag Manager tracking
- [ ] เชื่อมกับ Google Search Console และ submit sitemap
- [ ] สร้าง Google Business Profile แล้วเชื่อม review
- [ ] เพิ่ม Privacy Policy / Terms / Cookie Policy ตาม PDPA
- [ ] optimize รูปภาพด้วย AVIF/WebP (ปัจจุบันรูปขนาด ~1MB ควรลดเหลือ < 200KB)
- [ ] ต่อ contact form กับ Resend / EmailJS / Formspree
- [ ] เชื่อม LINE Official Account และ WhatsApp Business

---

## ข้อมูลติดต่อบริษัท

- **โทร:** 097-008-1294 · 082-959-5750
- **WhatsApp:** [+66 82 959 5750](https://wa.me/66829595750)

---

## Tech Stack

- HTML5 + Vanilla JavaScript
- [Tailwind CSS](https://tailwindcss.com/) (CDN)
- [Iconify](https://iconify.design/) (icons via CDN)
- IBM Plex Sans Thai + Plus Jakarta Sans (Google Fonts)
- Deploy: [Vercel](https://vercel.com)

## License

© 2026 NB Accounting Visa Services — All rights reserved
