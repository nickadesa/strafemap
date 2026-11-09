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
- **หลักฐาน**: `SCORECARD.md` ให้คะแนน 93.5/100 (`Strong Candidate`), บันทึกใน `EXPERIMENTS.md`



