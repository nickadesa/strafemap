# STRAFE: Unified Evaluation Scorecard (เกณฑ์ประเมิน 100 คะแนน)

เกณฑ์ประเมินมาตรฐานเดียวกันสำหรับทุกแนวทางการทดลอง (Experiments) เพื่อให้สามารถเปรียบเทียบผลได้อย่างเที่ยงธรรมและเป็นวิทยาศาสตร์

---

## 1. เกณฑ์การให้คะแนน (Scoring Rubric - เต็ม 100 คะแนน)

### หมวดที่ 1: การทำงานและความเสถียร (Functionality & Resilience) - 20 คะแนน
- [ ] ผ่าน Unit & Integration Tests ทั้งหมด 100% (5 คะแนน)
- [ ] ไม่มี Unhandled Exceptions หรือ Console Errors ในทุก Flow (5 คะแนน)
- [ ] รองรับ Edge Cases: ข้อความภาษาไทยยาวพิเศษ, อิโมจิ, ค่าว่าง (Null/Undefined), ข้อมูลหลุดขอบ (5 คะแนน)
- [ ] การจัดการ Network Offline / Fallback อย่างนุ่มนวล (5 คะแนน)

### หมวดที่ 2: ความงามตามมาตรฐาน Apple HIG & Anti-Slop (Aesthetics & Craft) - 20 คะแนน
- [ ] ใช้วัสดุโปร่งแสงสมจริง (Frosted Glass / Vibrancy) ขอบคมชัด ไร้เกรเดียนต์เลอะเทอะ (5 คะแนน)
- [ ] สัดส่วนความโค้งมนแบบ Continuous Squircle (Apple Corner Radius) ทั้งปุ่มและการ์ด (5 คะแนน)
- [ ] การจัดวางพื้นที่ขอบซ้าย-ขวาเท่ากัน (Equal Edges) และระยะ Spacing เป็นระเบียบ (5 คะแนน)
- [ ] ไอคอน SF Symbols / Lucide มี optical weight สม่ำเสมอ 1.8–2.0px (5 คะแนน)

### หมวดที่ 3: สรีรศาสตร์บนมือถือและทุกหน้าจอ (Responsive & Touch Ergonomics) - 20 คะแนน
- [ ] Touch Targets ทุกปุ่มและจุดแตะมีขนาดอย่างน้อย 44×44px (5 คะแนน)
- [ ] ฟังก์ชันหลักอยู่ใน One-Handed Thumb Zone ด้านล่างหน้าจอ (5 คะแนน)
- [ ] การใช้ iOS Native Bottom Sheet พร้อม Grab Handle แทน Modal แข็งๆ (5 คะแนน)
- [ ] รองรับ iPhone Dynamic Island, Notch, และ Android Navigation Bar Insets (5 คะแนน)

### หมวดที่ 4: ประสิทธิภาพและความลื่นไหล (Performance & Fluid Motion) - 15 คะแนน
- [ ] สปริงฟิสิกส์ (Spring Physics) 60fps ลื่นไหล ไม่กระตุก (5 คะแนน)
- [ ] Cumulative Layout Shift (CLS) < 0.1 ไม่มีการกระตุกของเลย์เอาต์ขณะโหลด (5 คะแนน)
- [ ] การเรนเดอร์แผนที่ MapLibre GL มีความหน่วงต่ำ ไม่กิน Memory เกินขนาด (5 คะแนน)

### หมวดที่ 5: การเข้าถึงสำหรับทุกคน (Accessibility / a11y) - 15 คะแนน
- [ ] Contrast Ratio ตัวอักษรกับพื้นหลังผ่านเกณฑ์ WCAG AAA (อย่างน้อย 4.5:1 / 7:1) (5 คะแนน)
- [ ] มี `aria-label` และ Screen Reader Accessible Names ครบทุกปุ่ม (5 คะแนน)
- [ ] Keyboard Navigation สามารถกด `Tab`, `Enter`, `Escape` ใช้งานได้ครบถ้วน พร้อม Focus Rings (5 คะแนน)

### หมวดที่ 6: ความปลอดภัยและความถูกต้องของข้อมูล (Security & Integrity) - 10 คะแนน
- [ ] ไม่มีการรั่วไหลของ Secret หรือ Private Key (ผ่านการตรวจด้วย TruffleHog) (3 คะแนน)
- [ ] เส้นทาง `/admins` ถูกล็อกด้วย Passcode / Role Guard (4 คะแนน)
- [ ] ป้องกัน XSS และ Injection ในชื่อผู้ใช้, แชท, และแท็กแคลน (3 คะแนน)

---

## 2. ระดับการตัดสินผลลัพธ์ (Decision Thresholds)
- **90 - 100 คะแนน**: **`CHAMPION / READY TO ADOPT`** - ดีเยี่ยมรอบด้าน สามารถเป็นตัวเลือกหลัก
- **75 - 89 คะแนน**: **`PROMISING / UNDECIDED`** - มีศักยภาพสูง แต่ยังมีจุดอ่อนบางด้าน ต้องปรับปรุงก่อนตัดสิน
- **ต่ำกว่า 75 คะแนน**: **`NEEDS REWORK / ARCHIVED`** - มีจุดบกพร่องเชิงโครงสร้าง ต้องนำข้อดีไปรวมกับแนวทางอื่น
