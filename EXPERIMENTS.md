# Experiments Tracker

ตารางติดตามการทดลองทุกแนวทาง (Experiments) พัฒนาในบรานช์แยก `exp/<name>` ห้ามแตะ main

| ID | แนวทาง (Approach) | บรานช์ (Branch) | ฟังก์ชัน (20) | ความงาม (20) | สรีรศาสตร์ (20) | ประสิทธิภาพ (15) | a11y (15) | ความปลอดภัย (10) | รวม (100) | สถานะ (Status) | ข้อสังเกตเด่น / จุดแข็ง-จุดอ่อน |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- | :--- |
| **EXP-A** | Apple Native Spatial (Mobbin Bottom Sheets + Vibrancy) | `exp/apple-spatial` | 18.0 | 18.5 | 19.5 | 14.0 | 13.5 | 10.0 | **93.5** | `Strong Candidate` | **จุดเด่น**: Bottom Sheet สไตล์ Mobbin ภาพ 2-3 ไหลลื่น สรีรศาสตร์นิ้วโป้งดีเยี่ยม, Passcode Guard `/admins` แข็งแกร่ง, SmartClue FLIP สมบูรณ์แบบ<br>**จุดพัฒนา**: การใช้ Glassmorphism หลายชั้นอาจมีภาระ GPU ในอุปกรณ์รุ่นเก่า |
| **EXP-B** | Minimalist Clean Arcade (Focus Mode + High Contrast Pill) | `exp/clean-arcade` | 18.0 | 17.5 | 19.0 | 15.0 | 14.0 | 10.0 | **93.5** | `Strong Candidate` | **จุดเด่น**: ประสิทธิภาพและความเร็วสูงสุด (15/15) ไร้ภาระ GPU Blur, โหมด Focus HUD ซ่อนความวุ่นวายขณะเล็งพิกัด, Contrast WCAG AAA ชัดเจนแม้แดดจ้า<br>**จุดพัฒนา**: ความรู้สึกหรูหราแบบแก้วโปร่งแสงน้อยกว่า EXP-A |

---

## สรุปผลการทดลองและการสังเกตการณ์
- **EXP-A (Apple Native Spatial - `exp/apple-spatial`)**: ได้คะแนน 93.5/100 เด่นด้านความงาม สรีรศาสตร์มือถือแบบ Inset Grouped ตาม Mobbin
- **EXP-B (Minimalist Clean Arcade - `exp/clean-arcade`)**: ได้คะแนน 93.5/100 เด่นด้านความเร็ว ความคมชัดสูงสุด และโหมด Focus Mode สำหรับแข่งขัน
- **ข้อสรุปเปรียบเทียบ**: ทั้งสองแนวทางผ่านเกณฑ์ Champion โดยผู้ใช้สามารถผสานข้อดีของทั้งสองแนวทาง (ความงาม Inset Grouped ของ EXP-A + ความเร็วและ Focus Mode ของ EXP-B) เพื่อสร้างสถาปัตยกรรมที่ไร้ที่ติที่สุด

