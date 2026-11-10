# Plan Changelog

บันทึกประวัติการเปลี่ยนแปลงแผนพัฒนา (Living Document Changelog)
ทุกการแก้ไขแผนต้องระบุ: แก้อะไร, เพราะอะไร, มีหลักฐานอะไรสนับสนุน

---

## [2026-11-09T12:45:00Z] - Initial Plan Baseline Established
- **แก้อะไร**: บันทึกแผนแม่บทตั้งต้นเข้าสู่ `PLAN.original.md` และสร้าง `PLAN.md` เพื่อเป็น Living Plan
- **เพราะอะไร**: เข้าสู่โหมด Autonomous Execution ตามคำสั่งของผู้ใช้ เพื่อพัฒนาอย่างลึกซึ้งและต่อเนื่อง
- **หลักฐาน**: แผนแม่บทผ่านการวิเคราะห์ด้วย TruffleHog (0 leaks), Cloudflare Security Audit, Taste-Skill Anti-Slop, และ UI-UX Pro Max

## [2026-11-09T13:45:00Z] - EXP-A Implementation & Verification Completed
- **แก้อะไร**:
  1. ล็อกเส้นทาง `/admins` ด้วย Apple Passcode Gateway (PIN `8888`)
  2. ลบโมดูลขยะ `src/components/icons.tsx` รวมเข้ากับ `SFSymbols.tsx`
  3. เพิ่ม Explore Modes Carousel แนวนอนสไตล์ Mobbin ในหน้า Home (`/`)
  4. พลิกโฉม Match Options Drawer ใน `/play` สู่ Apple Inset Grouped Sheet พร้อม Selection Checkmarks, iOS Switch, และ SF Symbols
  5. ทดสอบ Unit Tests (15/15 ผ่าน) และ Production Build Nitro SSR ผ่านฉลุย
- **เพราะอะไร**: บรรลุเกณฑ์ EXP-A (Apple Native Spatial + Mobbin Inset Sheets) เพื่อเพิ่มความงามและสรีรศาสตร์ตาม Apple HIG
- **หลักฐาน**: `SCORECARD.md` ให้คะแนน 93.5/100 (`Strong Candidate`), บันทึกใน `EXPERIMENTS.md`

## [2026-11-09T13:55:00Z] - EXP-B Implementation & Verification Completed
- **แก้อะไร**:
  1. แยกบรานช์ `exp/clean-arcade` จาก `main`
  2. พัฒนา Match Setup Drawer ใน `/play` ด้วย High-Contrast Segmented Tiles และระบุพิกัดระยะรัศมีชัดเจน (±250km, ±100km, ±35km, ±10km, ±2km)
  3. เพิ่ม Focus Mode Toggle ใน `GameHud.tsx` ซ่อนข้อมูลรบกวนสายตาขณะแข่งขันเล็งพิกัดบนแผนที่
  4. ทดสอบ Unit Tests (15/15 ผ่าน) และ Production Build Nitro SSR สำเร็จ (1.20s)
- **เพราะอะไร**: บรรลุเกณฑ์ EXP-B (Minimalist Clean Arcade + Zero-Blur High Contrast) เพื่อเพิ่มความเร็วและการเข้าถึง a11y สูงสุด
## [2026-11-09T19:20:00Z] - Core 4-Tab Navigation & Community Removal Overhaul
- **แก้อะไร**:
  1. ปรับลดแถบนำทางเหลือ 4 แกนหลัก: **Home (`/`)**, **Play (`/play`)**, **Rank (`/rank`)**, **Settings (`/settings`)**
  2. กำจัดระบบ Community, Feeds, Clans, และ Stories ออกทั้งหมด ลบไฟล์ขยะและลดโค้ดที่ไม่จำเป็นลงกว่า 1,020 บรรทัด (`ClanSystemTab.tsx`, `SocialFeedTab.tsx`)
  3. กำหนดให้ URL `/community` ส่งสัญญาณ Redirect อัตโนมัติไปยัง `/rank`
  4. ปรับเปลี่ยนส่วน Community Highlights บนหน้าแรกเป็น **"Season 1 Leaderboard Spotlight"** แสดง Top 3 ผู้เล่นชั้นนำระดับโลก
  5. บังคับใช้สีแบรนด์หลักเป็น **`#00ADFF` (Laser Cyan)** พร้อมคู่สี Ink `#03121C` ตามมาตรฐาน WCAG AAA ทั่วทั้งระบบ Light และ Dark theme
  6. เพิ่มชุดการทดสอบ Routing Unit Tests สำหรับ 4 หมวดหลักและระบบ Redirect ครบถ้วน (รวมเป็น 17/17 ผ่านฉลุย 100%)
- **เพราะอะไร**: ตามมติความต้องการของผู้ใช้ที่ต้องการลบฟีเจอร์ Community/Stories ที่ไม่จำเป็นออก และโฟกัสประสบการณ์เล่นเกมที่เฉียบคม สะอาดตา ตามหลัก Apple Human Interface Guidelines และ Mobbin
- **หลักฐาน**:
  - `git commit` `58a01db` (-1,020 บรรทัด)
  - `git commit` `93c2db7` (Unit Tests)
  - `npm test`: 17 passed / 17 tests (100% green)
  - `npm run build`: Production Nitro SSR bundle compile ใน 1.67 วินาที ไร้ข้อผิดพลาด



