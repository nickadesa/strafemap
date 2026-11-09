# Experiments Tracker

ตารางติดตามการทดลองทุกแนวทาง (Experiments) พัฒนาในบรานช์แยก `exp/<name>` ห้ามแตะ main

| ID | แนวทาง (Approach) | บรานช์ (Branch) | ฟังก์ชัน (20) | ความงาม (20) | สรีรศาสตร์ (20) | ประสิทธิภาพ (15) | a11y (15) | ความปลอดภัย (10) | รวม (100) | สถานะ (Status) | ข้อสังเกตเด่น / จุดแข็ง-จุดอ่อน |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- | :--- |
| **EXP-A** | Apple Native Spatial (Mobbin Bottom Sheets + Vibrancy) | `exp/apple-spatial` | 18.0 | 18.5 | 19.5 | 14.0 | 13.5 | 10.0 | **93.5** | `Strong Candidate` | **จุดเด่น**: Bottom Sheet สไตล์ Mobbin ภาพ 2-3 ไหลลื่น สรีรศาสตร์นิ้วโป้งดีเยี่ยม, Passcode Guard `/admins` แข็งแกร่ง, SmartClue FLIP สมบูรณ์แบบ<br>**จุดพัฒนา**: การใช้ Glassmorphism หลายชั้นอาจมีภาระ GPU ในอุปกรณ์รุ่นเก่า |
| **EXP-B** | Minimalist Clean Arcade (Focus Mode + High Contrast Pill) | `exp/clean-arcade` | - | - | - | - | - | - | - | `In Progress` | มุ่งเน้นเลย์เอาต์มินิมอล ลดภาระ GPU เพิ่มความเร็วโหลด 0-latency และ High Contrast A11y |

---

## สรุปผลการทดลองและการสังเกตการณ์
- **EXP-A (Apple Native Spatial)**: ได้คะแนน 93.5/100 ผ่านเกณฑ์ Champion ระดับแรก การทดสอบ 15/15 unit tests ผ่านฉลุย, Build Nitro SSR สำเร็จไร้ข้อผิดพลาด
- กำลังเริ่มการทดลอง **EXP-B (Minimalist Clean Arcade)** บนบรานช์แยก `exp/clean-arcade` เพื่อเปรียบเทียบเชิงประสิทธิภาพและความกระชับของข้อมูล
