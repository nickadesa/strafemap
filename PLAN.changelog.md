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
## [2026-11-09T22:30:00Z] - Phase 2 (Gameplay & Map Immersion) Completed
- **แก้อะไร**:
  1. Full Viewport 100% Map Immersion: ซ่อน navigation และรีเซ็ต `--rail-w` เป็น 0px ใน `Sidebar.tsx` เมื่อ unmount
  2. SmartClue cancellable FLIP animation: คง layout และ anim วัดขนาดได้ตามกฎ AGENTS.md
  3. GameHud: กำจัดขอบเทา เปลี่ยน popovers และ score capsules เป็น borderless glass นุ่มนวล
  4. Camera Reveal Arc: ปรับ `fitBounds` padding ใน `MapLibreAdapter.ts` เป็น `top: 90, bottom: 280, left: 60, right: 60` ทำให้การ์ดสรุปผลด้านล่างไม่บดบังหมุดเล็งและหมุดเฉลย
  5. RoundReveal: การ์ดสรุปผลคะแนนเลื่อนขึ้นจากขอบจอด้านล่างแบบ Bottom Card Inset พร้อมคะแนนและปุ่ม Next Round ทันใจ
- **เพราะอะไร**: ปฏิรูปประสบการณ์การเล่นเกมให้ลื่นไหล สบายตา สมจริงตามมาตรฐาน Apple Spatial HIG
- **หลักฐาน**: Commit `f5a82bf`, Unit tests 17/17 passing, Nitro SSR Build success.

## [2026-11-09T23:30:00Z] - Phase 3 (Home, Play Hub, Rank, and Settings Overhaul) Completed
- **แก้อะไร**:
  1. Home (`index.tsx`): ตัด Top Bar Header ออก, กำจัดขอบเทา (`border: none` บน `.plate`), ไม่มี Activity Rings ตามคำสั่งผู้ใช้ โฟกัสการ์ด Daily Challenge ทันที
  2. Play Hub (`play.tsx`): แถบค้นหาและ Daily Card ไร้ขอบเทา, ไอคอนโหมดเปลี่ยนเป็น Squircle สีเฉพาะตัว (`${accentColor}20`), Drawer Header ปรับ divider นุ่มนวล
  3. Rank Hub (`rank.tsx`): กำจัดเส้นขอบเทาจาก Placements card, Stats grid, Guide Tab pyramid, Leaderboard podium pedestals (Soft Rounded Pillars), Season Rewards Drawer
  4. Settings Hub (`settings.tsx`): Apple iOS Inset Grouped Table ไร้ขอบเทา, Quick Emojis Drawer นุ่มนวล, Map Style Grid พร้อมกรอบแสงเลเซอร์ `#00ADFF`
  5. การกระจาย Settings Event: ยืนยันการ broadcast `strafe:settings` อัปเดต UI และภาษาทันที
- **เพราะอะไร**: บรรลุหลักสรีรศาสตร์และความสะอาดตาตามคำสั่งตรงของผู้ใช้ "การดีไซน์ไม่ต้องใส่ขอบเทาๆ"
- **หลักฐาน**: Commit `ec62d12`, Unit tests 17/17 passing, Nitro SSR Build success.

## [2026-11-10T02:15:00Z] - Phase 5 (Direct Reference Overhaul matching 5 Screenshots) Completed
- **แก้อะไร**:
  1. ซ่อน Mobile Top Bar ซ้ำซ้อนใน `Sidebar.tsx` เมื่ออยู่ที่หน้าแรก (`/`) เพื่อให้เป็น Native App Flow
  2. ยกเครื่องหน้าแรก (`index.tsx`):
     - Native Organic Header: Avatar + User Greeting + Coin Pill
     - Soft Frosted Gradient Hero Card พร้อม 3D Compass, 5 Pins Badge, และ Pagination Dots `── ─` (Reference Image 1)
     - Explore Interests Pills แถบแนวนอนพร้อม Circular Icon Badges (Reference Image 1)
     - Honk Games 3x2 Grid 6 Vibrant Circular Game Icons + Feature Bullets + Wide Pill CTA (Reference Image 3)
     - Streak & Rank Cards พร้อม 56px Circular Flame / Trophy Containers (Reference Image 5)
     - Season 1 Global Top 3 พร้อม Gold/Silver/Bronze Circular Medal Badges (Reference Image 5)
  3. ยกเครื่องหน้า Play Hub (`play.tsx`):
     - Daily Challenge Hero Card พร้อม 64px Glowing Flame Badge และ Wide Pill CTA (Reference Image 1 & 5)
     - รายการโหมดเกมทั้งหมดเปลี่ยนจากการ์ดตั้งค่าเรียบๆ เป็นการ์ดโค้งมน 56px Circular Icon Container สีสันสดใสเต็มตา (Reference Image 5)
     - Match Options Drawer: Inset Radio Rows พร้อม Soft Active Pill Background + Checkmark และปุ่ม Start Game แบบ Full-width Rounded-Full Pill (Reference Image 2)
- **เพราะอะไร**: แก้ปัญหา User Feedback ที่รู้สึกว่าการปรับก่อนหน้าเปลี่ยนเพียงแค่ขอบ CSS แต่โครงสร้างและ visual ยังดูเหมือนเดิม โดยนำแบบ 5 ภาพถ่ายของ Reference Designs มาปรับใช้จริง 100%
- **หลักฐาน**: Commit `93abb45` บน `main`, Unit tests 17/17 passing, Production Nitro SSR Build success.



