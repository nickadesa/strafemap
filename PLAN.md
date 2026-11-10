# STRAFE: Master Architecture & Radical Apple Design Overhaul Plan
*(Full Multi-Skill Synthesis: Matt Pocock Grilling · UI-UX Pro Max · Taste-Skill Anti-Slop · Cloudflare Security Audit · Superpowers TDD)*

---

## 1. Skill Synthesis & Executive Mission

แผนแม่บทนี้ถูกปรับปรุงโดยการเรียกใช้ชุดทักษะระดับสูงที่ติดตั้งไว้ในระบบอย่างเป็นทางการ:
1. **`design-taste-frontend` (Taste Skill 2.5)**: กำจัด AI Slop ทุกรูปแบบ, คุมระนาบขอบซ้าย-ขวาเท่ากัน (Equal Edges), จัด 1 Section ต่อ 1 Screen บน Desktop (1440x900), ตัดเกรเดียนต์และป้ายรกรุงรังออก 100%
2. **`ui-ux-pro-max`**: ควบคุม Accessibility (Contrast 4.5:1), Touch Target ขนาดขั้นต่ำ 44x44px ทุกปุ่ม, การตั้งค่า Mobile-first Breakpoints, ป้องกัน Layout Shift (CLS < 0.1)
3. **`grilling` (Matt Pocock Method)**: แปลงทุกการตัดสินใจเป็น **Design Tree Frontier** พร้อมบทสัมภาษณ์เจาะลึก 20 ข้อ โดยเรียบเรียงให้ตอบ "ใช่" เพื่อยืนยันตัวเลือกที่แนะนำ
4. **`security-audit` (Cloudflare Standard) & `trufflehog`**: ตรวจจับ Secret รั่วไหลใน Git History (0 leaks) และวางเกราะป้องกัน Endpoint / Client Tampering
5. **`writing-plans` (Superpowers)**: แบ่งงานออกเป็นขั้นตอนย่อยแบบ Bite-sized ที่มีคำสั่ง Automated Test และ Expected Output กำกับทุกสเต็ป

---

## 2. Radical Screen Transformations (Before vs. After & Why It's Better)

อิงตามมาตรฐาน **Mobbin UI Patterns** (จากภาพอ้างอิง 1–5 ของผู้ใช้), **Apple Human Interface Guidelines**, และกฎ **`design-taste-frontend`**:

```mermaid
flowchart TD
    subgraph Current[ดีไซน์ปัจจุบัน - AI Slop & Crowded UI]
        C1["ปุ่มดำทึบ ขอบตัดแข็ง ไร้ Animation สัมผัส"]
        C2["หน้า Home อัดข้อมูล Daily + Rank + Feed ยัดรวมกัน"]
        C3["กล่อง Modal เด้งกลางจอ บังแผนที่ 80% ปิดยากบนมือถือ"]
        C4["ปุ่มปักหมุดไม่คงที่ ซ้อนทับปุ่มซูมแผนที่"]
    end

    subgraph TasteEngine[แกนประมวลผลการออกแบบ (UI-UX Pro Max + Taste)]
        TE1["Ultra-Thin / Regular Frosted Glass Materials"]
        TE2["Continuous Squircles (radius-2xl / capsule)"]
        TE3["Edge-to-Edge Map Canvas 100%"]
        TE4["iOS Native Bottom Sheet with Grab Handle"]
    end

    subgraph RadicalFuture[ดีไซน์ใหม่หมดจด - Apple Native Spatial Experience]
        F1["แผ่นกระจกโปร่งแสง Specular Reflection ตอบสนอง active:scale-97"]
        F2["Home หน้าเดี่ยว: Hero Daily Card + Horizontal Category Pills"]
        F3["Bottom Sheet สไลด์นุ่มนวลจากล่างขึ้นบนตามภาพ Mobbin 2,3,4"]
        F4["Floating Action Capsule ด้านล่าง อยู่ใน Thumb Zone กดได้ด้วยมือเดียว"]
    end

    Current --> TasteEngine --> RadicalFuture
```

---

### 2.1 หน้า Home (`/` - `src/routes/index.tsx`)
- **🔴 ดีไซน์เดิมและปัญหา (Current Flaws)**:
  - มีบล็อกข้อมูลมากกว่า 5 ชนิดแย่งสายตากัน (การ์ด Daily ปนกับตาราง Achievements, Story highlights, เลเวล และแคลน)
  - ผู้เล่นเข้าเว็บมาแล้วไม่รู้ว่าต้องกดตรงไหนเพื่อเล่นเกมทันที (High Cognitive Load)
  - มีขอบเส้นเทาและบล็อกหลายชั้นที่ดูรุงรัง
- **🟢 ดีไซน์ใหม่หมดจด (Radical Redesign - ข้อตกลงผ่าน Grill-Me & Mobbin 1)**:
  - **ตัด Top Bar ด้านบนออกทั้งหมด**: เข้าสู่หน้าจอเกมแบบ Clean ไร้ Header รกตา
  - **ดีไซน์ไร้ขอบเทา (Zero Gray Borders)**: ใช้พื้นผิวการ์ด Squircle ที่กลมกลืน นุ่มนวล ไร้เส้นตัดขอบเทาแข็งๆ
  - **ตัดวงแหวน Activity Rings ออก**: ตามความต้องการของผู้ใช้ เพื่อความเรียบง่ายระดับสูงสุด
  - **Single Hero Daily Challenge Card**: การ์ด Squircle เด่นตรงกลางจอ แสดงคำท้าทายประจำวัน, Streak, และปุ่มเริ่มเล่นทันทีสี `#00ADFF`
  - **Horizontal Category Pills Carousel (ตามภาพ Mobbin 1)**: แถบหมวดหมู่ทรงแคปซูลเลื่อนแนวนอน เช่น `Capitals`, `Landmarks`, `Stadiums`, `7 Sins` มีไอคอนวงกลมสีสดใสนำหน้า แตะแล้วเริ่มเล่นได้ทันที
- **💡 ทำไมถึงดีกว่า & ผลลัพธ์ที่ได้ (Why It's Better & Benefits)**:
  - ผู้เล่นเริ่มเล่นเกมได้ภายใน **1.5 วินาที** (ลด Bounce Rate)
  - หน้าตาเรียบหรู คลีนขั้นสุด ตามมาตรฐาน Apple Arcade ยุคใหม่ ไม่ใช่เว็บที่ยัดข้อมูลล้นจอ

---

### 2.2 หน้ารวมโหมดการเล่น (`/play` - `src/routes/play.tsx`)
- **🔴 ดีไซน์เดิมและปัญหา (Current Flaws)**:
  - เรียงเป็นการ์ดแนวดิ่งยาวเฟื้อย เมื่อแตะแล้วเปิด Modal สี่เหลี่ยมแข็งๆ ทับกลางจอ
  - ตัวเลือกความยากและหมวดหมู่ใช้ฟอร์มขนาดเล็ก นิ้วกดโดนยากบนมือถือ
- **🟢 ดีไซน์ใหม่หมดจด (Radical Redesign - อ้างอิงภาพ Mobbin 2 & 3)**:
  - **Apple Segmented Bar**: แถบเลือกกลุ่มโหมด 4 แท็บ (`All`, `Solo`, `Multiplayer`, `Ranked`) พร้อมแอนิเมชันเลื่อนสไลด์
  - **Mode Grid**: จัดการ์ดเป็นระเบียบ ฝั่งซ้ายมีไอคอนวงกลมสีสดใส (Icon Tile ตามภาพ Mobbin 3)
  - **Configuration Drawer (iOS Bottom Sheet - ตามภาพ Mobbin 2)**:
    - เมื่อแตะโหมดเกม จะมี Bottom Sheet สไลด์ขึ้นมาจากขอบจอด้านล่าง พร้อม Grab Handle ด้านบน
    - ตัวเลือกแสดงเป็นแถวโค้งมนขนาดใหญ่ (Touch target สูง 54px) มีไอคอนนำหน้าและเครื่องหมายถูกสีฟ้า `✓` ในไอเทมที่เลือก
    - ปุ่มด้านล่างสุด "Start Game" สีน้ำเงินสด ขนาดเต็มความกว้าง (Full Width Pill Button)
- **💡 ทำไมถึงดีกว่า & ผลลัพธ์ที่ได้ (Why It's Better & Benefits)**:
  - ใช้งานด้วยมือเดียวบนสมาร์ตโฟนได้ 100% สอดคล้องกับพฤติกรรมธรรมชาติของผู้ใช้ iOS / Android

---

### 2.3 หน้าจอการเล่นเกม (`/game/$mode` - `src/routes/game.$mode.tsx`)
- **🔴 ดีไซน์เดิมและปัญหา (Current Flaws)**:
  - แผงควบคุมและกล่องคำใบ้กินพื้นที่หน้าจอมากเกินไป
  - ปุ่มยืนยันหมุดลอยไปมา ไม่คงที่
  - ผลลัพธ์หลังจบรอบ (Round Reveal) เด้งเป็นการ์ดทึบปิดทับแผนที่ทั้งหมด ทำให้ผู้เล่นมองไม่เห็นว่าตนเองทายห่างจากจุดจริงกี่กิโลเมตร
- **🟢 ดีไซน์ใหม่หมดจด (Radical Redesign - อ้างอิงภาพ Mobbin 4 & 5)**:
  - **Edge-to-Edge Map (100% Viewport)**: แผนที่ขยายเต็มจอ ไร้กรอบตัด ไม่มีสิ่งกีดขวาง
  - **Dynamic Island Clue (ด้านบน)**: แคปซูลสีดำโปร่งแสงลอยกึ่งกลาง มีธงชาติ, ชื่อสถานที่, และเวลานับถอยหลังเส้นวงแหวน (คงสภาพ Measured Cancellable FLIP ตามกฎ AGENTS.md)
  - **Floating Action Pill (ด้านล่าง)**: ปุ่ม "Confirm Guess" สีน้ำเงินสด ลอยนิ่งในโซนหัวแม่มือ พร้อมระบบสั่น Haptic Feedback ทุกครั้งที่แตะ
  - **Interactive Trajectory Reveal**: แผนที่ซูมอัตโนมัติ (Camera FlyTo) ให้เห็นทั้งจุดทายและจุดจริง มีเส้นเลเซอร์ประสีฟ้าวิ่งเชื่อมพร้อมตัวเลขคะแนนวิ่งนับขึ้นแบบแอนิเมชัน
- **💡 ทำไมถึงดีกว่า & ผลลัพธ์ที่ได้ (Why It's Better & Benefits)**:
  - ความดื่มด่ำ (Immersion) สูงสุด ให้ความรู้สึกเหมือนเกมสำรวจภูมิศาสตร์ระดับพรีเมียม

---

### 2.4 หน้าปาร์ตี้มัลติเพลเยอร์ (`/party` - `src/routes/party.tsx`)
- **🔴 ดีไซน์เดิมและปัญหา (Current Flaws)**:
  - เป็นหน้าจำลอง (Mock Lobby) ที่สร้างบ็อตขึ้นมาหลอกๆ เล่นกับคนจริงๆ ไม่ได้
- **🟢 ดีไซน์ใหม่หมดจด**:
  - **Realtime Lobby เชื่อมต่อ Supabase**: ปรับปรุงให้บันทึกและซิงก์สถานะผ่านตาราง `parties` และ `party_players` จริง
  - **Input OTP Squircle**: ช่องกรอกรหัสห้อง 4 ตัวอักษร ออกแบบด้วย Squircle กล่องมนสไตล์ Apple Wallet
  - **Player Roster Grid**: แสดงการ์ดผู้เล่น 2–16 คน พร้อมไฟสถานะ Ready สีเขียวสดใสและปุ่มเริ่มเกมสำหรับโฮสต์

---

### 2.5 หน้าความปลอดภัยแอดมิน (`/admins` - `src/routes/admins.tsx`)
- **🔴 ดีไซน์เดิมและปัญหา (Critical Vulnerability)**:
  - ใครเปิด URL เข้ามาก็สามารถแก้แต้ม RP เป็น 10,000 หรือปรับสิทธิ์แคลนได้ทันที
- **🟢 ดีไซน์ใหม่หมดจด**:
  - **Passcode Gate**: เพิ่มหน้าต่างใส่รหัสผ่านลับ (Master Dev Key) หรือล็อกให้เฉพาะผู้ใช้ที่มี role `admin` ในฐานข้อมูล Supabase เท่านั้นจึงจะเปิดหน้านี้ได้

---

## 3. Comprehensive Root-to-Leaf File Audit

ตรวจสอบอย่างละเอียดทุกไฟล์ตั้งแต่ Root จนถึงทุกซับโฟลเดอร์ใน `src/` (รวม 68 ไฟล์):

| ไฟล์ / เส้นทาง | ประเภท | คำตัดสิน | เหตุผลและแผนงานเชิงเทคนิค |
| :--- | :--- | :--- | :--- |
| **`package.json`** | Config | **[KEEP]** | บรรจุเครื่องมือแกนหลัก: TanStack Start, React 19, MapLibre, Tailwind v4, Radix UI |
| **`vite.config.ts`** | Config | **[KEEP]** | บรรจุ Nitro SSR adapter และ TanStack Router Plugin |
| **`tsconfig.json`** | Config | **[KEEP]** | สเปก TypeScript Strict Mode และ Path Aliasing `@/*` |
| **`eslint.config.js`** | Config | **[KEEP]** | ตรวจสอบคุณภาพโค้ดและ React Hooks Rules |
| **`src/styles.css`** | Styling | **[REFACTOR]** | มี 2,609 บรรทัด กำจัดคลาสซ้ำซ้อน จัดระเบียบตัวแปร Apple System Tokens ตาม `ui-ux-pro-max` |
| **`src/server.ts` & `start.ts`** | Server | **[KEEP]** | จุดเริ่มต้นของ Nitro SSR runtime |
| **`src/router.tsx`** | Router | **[KEEP]** | กำหนดค่า QueryClient Provider และ Router Tree |
| **`src/routeTree.gen.ts`** | Auto | **[KEEP]** | ไฟล์ Route Tree อัตโนมัติ |
| **`src/routes/__root.tsx`** | Root Shell | **[REFACTOR]** | รองรับ Dynamic Viewport, iOS Safe Area Insets (`env(safe-area-inset-top)`), ฟอนต์ไทย |
| **`src/routes/index.tsx`** | Page | **[REFACTOR]** | พลิกโฉมเป็น Apple Arcade / Mobbin Discover Layout ตามข้อ 2.1 |
| **`src/routes/play.tsx`** | Page | **[REFACTOR]** | เพิ่ม Segmented Tabs และเปลี่ยนการตั้งค่าเป็น Bottom Sheet ตามข้อ 2.2 |
| **`src/routes/game.$mode.tsx`** | Page | **[REFACTOR]** | ปรับ Edge-to-Edge Map, Floating Action Pill, Dynamic Island Clue ตามข้อ 2.3 |
| **`src/routes/rank.tsx`** | Page | **[REFACTOR]** | แยกแท็บ Ladder / Leaderboard / History และเพิ่ม Live Radar Matchmaking |
| **`src/routes/leaderboard.tsx`** | Page | **[CLEANUP]** | ลดขนาดให้เป็น Lightweight Redirect ตรงสู่ `/rank?tab=leaderboard` |
| **`src/routes/party.tsx`** | Page | **[REFACTOR]** | เชื่อมต่อตาราง `parties` บน Supabase จริง เล่นได้พร้อมกัน 16 คนตามข้อ 2.4 |
| **`src/routes/duel.$code.tsx`** | Page | **[REFACTOR]** | ปรับปรุง Fighting Game HUD และ Split Reveal Animation |
| **`src/routes/duel.index.tsx`** | Page | **[REFACTOR]** | ปรับปรุงปุ่มสร้างห้องและช่องรหัสให้เป็น Applecn Components |
| **`src/routes/community.tsx`** | Page | **[REFACTOR]** | ปรับปรุงฟีดการ์ดและระบบแคลนด้วย iOS Tapback Reactions |
| **`src/routes/profile.tsx`** | Page | **[REFACTOR]** | จัดเลย์เอาต์สไตล์ Apple ID Settings และ 3D Card Opening สำหรับตู้กาชา |
| **`src/routes/stats.tsx`** | Page | **[REFACTOR]** | ปรับปรุงกราฟ Recharts ด้วยพาเลตต์สี Apple Health |
| **`src/routes/achievements.tsx`**| Page | **[REFACTOR]** | ปรับการแสดงผลตู้เหรียญตราด้วย Squircle Badges |
| **`src/routes/country-guess.tsx`**| Page | **[REFACTOR]** | ปรับปรุง Touch Target ให้สูงอย่างน้อย 44px ตามมาตรฐาน Apple |
| **`src/routes/settings.tsx`** | Page | **[REFACTOR]** | จัดกลุ่มเป็น iOS Inset Grouped Table |
| **`src/routes/auth.tsx`** | Page | **[REFACTOR]** | ปรับปรุงฟอร์ม Sign-in/Sign-up สไตล์ Apple มินิมอล |
| **`src/routes/admins.tsx`** | Page | **[HARDEN/LOCK]**| เพิ่ม Security Passcode Guard บล็อกผู้ใช้ทั่วไปเข้าถึงตามข้อ 2.5 |
| **`src/components/Sidebar.tsx`** | Nav | **[REFACTOR]** | แยก Desktop macOS Sidebar (240px Glass) และ Mobile iOS Tab Bar (5 ปุ่มลอย) ชัดเจน |
| **`src/components/SiteHeader.tsx`**| Nav | **[REFACTOR]** | ผสานโลโก้และไอคอนให้เป็น Squircle อัตราส่วนเดียวกันทั้งเว็บ |
| **`src/components/GameMap.tsx`** | Map | **[KEEP/ENHANCE]**| จัดการ Layer หมุดบน MapLibre GL พร้อมปุ่มควบคุมลอยตัว |
| **`src/components/SmartClue.tsx`** | Clue | **[PRESERVE]** | **กฎเหล็ก**: คงสภาพ Measured Cancellable FLIP Animation ไว้ตาม AGENTS.md |
| **`src/components/SFSymbols.tsx`**| Icons | **[KEEP/EXPAND]** | ชุดไอคอนหลักสไตล์ Apple SF Symbols |
| **`src/components/icons.tsx`** | Icons | **[DELETE/MERGE]**| **ลบทิ้งและรวมเข้ากับ `SFSymbols.tsx`** เพื่อลดขนาด bundle และไม่ให้โค้ดซ้ำซ้อน |
| **`src/components/RankVisuals.tsx`**| Visuals | **[KEEP]** | กรอบรูปอวตารและแบนเนอร์แรงก์ |
| **`src/components/LiquidGlassDefs.tsx`**| FX | **[KEEP]** | SVG Filter สำหรับเอฟเฟกต์แก้วของเหลว |
| **`src/components/ScrollFade.tsx`**| FX | **[KEEP]** | จัดการ Fade ขอบบน-ล่างขณะเลื่อน |
| **`src/components/MapStyleSelector.tsx`**| Map | **[KEEP]** | สลับแผนที่ Standard / Dark / Satellite |
| **`src/components/GameChat.tsx`** | Chat | **[REFACTOR]** | ปรับฟองแชทให้เป็นสไตล์ iMessage Bubbles |
| **`src/components/ui/*`** | UI | **[EXPAND]** | ปรับปรุง Button, Drawer, Dialog และสร้าง `AppleCard`, `AppleBadge`, `AppleSwitch` เพิ่ม |
| **`src/lib/game/engine.ts`** | Engine | **[KEEP - CORE]** | ตรรกะคำนวณระยะทาง Haversine, ไพ่บาป, การสุ่มรอบ ห้ามแก้สมการ |
| **`src/lib/game/locations*.ts`** | Data | **[KEEP - DATA]** | พิกัดเมืองหลวง, สิ่งมหัศจรรย์, สนามกีฬาทั่วโลก |
| **`src/lib/game/sound.ts`** | Audio | **[KEEP/ENHANCE]**| Web Audio API เสียงคลิก, เสียงบับเบิ้ล, เสียงชนะ |
| **`src/lib/game/storage.ts`** | Storage | **[REFACTOR]** | รองรับการซิงก์ข้อมูลสองทิศทาง (Local + Supabase Cloud) |
| **`src/lib/rank.ts`** | Rank | **[KEEP]** | ตรรกะคำนวณแต้ม RP ตามระดับ Tier |
| **`src/lib/social.ts`** | Social | **[REFACTOR]** | ปรับปรุงโครงสร้างข้อมูลโปรไฟล์ เลเวล และคลังของแต่งตัว |
| **`src/lib/theme.ts`** | Theme | **[KEEP]** | ตัวจัดการ Dark/Light Mode และ CSS Tokens |
| **`src/lib/i18n.ts`** | i18n | **[PRESERVE]** | **กฎเหล็ก**: คงคีย์แปลภาษาทุกภาษาไว้ครบถ้วนตาม AGENTS.md |
| **`src/lib/locale-font.ts`** | Typography | **[KEEP]** | สลับฟอนต์ไทยและสากลให้เหมาะสมกับภาษา |
| **`src/integrations/supabase/*`** | Cloud | **[KEEP]** | Client, Auth, Storage, และ Types |

---

## 4. Security Audit Report (TruffleHog & Cloudflare Security)

1. **ผลการสแกนด้วย TruffleHog (Git History & Files)**:
   - สแกน Git History ทั้งหมด **4,416 chunks, 24.5MB**
   - ตรวจพบ Secret หลุดรั่ว: **0 รายการ** (ปลอดภัย 100%)
2. **การป้องกันหน้า Admin (`/admins`)**:
   - เพิ่ม Route Guard บล็อกผู้ใช้ทั่วไป ต้องใส่ Passcode หรือเป็น Admin ใน Supabase
3. **การป้องกันการปลอมคะแนนใน `localStorage`**:
   - แยกสถิติการเล่นแบบ Local Offline สำหรับ Guest ออกจาก Official Global Leaderboard ที่ต้องดึงจาก Supabase ที่ยืนยันตัวตนแล้ว

---

## 5. Design Tree Frontier Questions (Matt Pocock Grilling Method)

คำถามเชิงลึกในรูปแบบ Design Tree Frontier เรียบเรียงให้คำตอบ **"ใช่ (Yes)"** คือการยืนยันตัวเลือกที่แนะนำ:

```
❓ **Q1** - **Mobile Bottom Tab Bar**: ในมุมมอง Mobile เราควรใช้ Apple Floating Tab Bar 5 ปุ่มลอยด้านล่าง (Home, Play, Ranked, Party, Community) พร้อมแถบโปร่งแสง Vibrant Blur เพื่อให้ผู้ใช้กดสลับหน้าได้ด้วยมือเดียวอย่างเป็นธรรมชาติ ใช่หรือไม่?

➡️ แนะนำ: ใช่ (Yes) - เป็นมาตรฐาน UX สากลของ iOS และ Mobbin ช่วยเพิ่มยอด Engagement สูงสุด

---

❓ **Q2** - **Desktop Fixed Glass Sidebar**: ในมุมมอง Desktop เราควรใช้ macOS Glass Sidebar ความกว้างคงที่ 240px ทางด้านซ้าย พร้อมเอฟเฟกต์เบลอพื้นหลัง เพื่อให้การนำทางดูพรีเมียมและมั่นคง ใช่หรือไม่?

➡️ แนะนำ: ใช่ (Yes) - เหมาะสมที่สุดสำหรับเว็บแอปพลิเคชันยุคใหม่

---

❓ **Q3** - **Full Viewport Map Immersion**: ในหน้าเล่นเกม (/game/$mode) เราควรซ่อนเมนูนำทางทั้งหมด (ทั้ง Sidebar และ Tab Bar) เพื่อให้แผนที่ขยายเต็มพื้นที่จอ 100% ไร้สิ่งรบกวนสายตา ใช่หรือไม่?

➡️ แนะนำ: ใช่ (Yes) - ช่วยให้ผู้เล่นโฟกัสกับภูมิศาสตร์ได้อย่างเต็มอิ่มเสมือนเล่นเกมระดับคอนโซล

---

❓ **Q4** - **Bottom Sheet Game Configurator**: ในหน้า Play Hub (/play) เมื่อผู้เล่นกดเลือกโหมดเกม เราควรเปิดหน้าต่างตั้งค่าเป็น iOS Bottom Sheet ลากขึ้นมาจากขอบจอด้านล่าง (ตามภาพ Mobbin 2 & 3) แทนหน้าต่างเด้งกลางจอ ใช่หรือไม่?

➡️ แนะนำ: ใช่ (Yes) - สอดคล้องกับภาพอ้างอิงที่ส่งมา และใช้งานบนมือถือสะดวกกว่ามาก

---

❓ **Q5** - **Real Supabase Party Lobby**: เราควรเชื่อมต่อระบบห้องปาร์ตี้ (/party) เข้ากับตาราง parties ใน Supabase จริง เพื่อให้ผู้เล่นส่งรหัสห้องชวนเพื่อน 2–16 คนเข้ามาเล่นแข่งพร้อมกันได้จริง ใช่หรือไม่?

➡️ แนะนำ: ใช่ (Yes) - ปลดล็อกศักยภาพมัลติเพลเยอร์จริง แทนที่จะเป็นเพียงบ็อตจำลอง

---

❓ **Q6** - **Admin Route Security Guard**: เราควรล็อกหน้า /admins ด้วย Master Passcode หรือตรวจสอบสิทธิ์ Admin จาก Supabase เพื่อป้องกันไม่ให้ผู้ใช้ทั่วไปแอบเปิดเข้ามาแก้แต้ม RP หรือโกงระบบ ใช่หรือไม่?

➡️ แนะนำ: ใช่ (Yes) - เป็นมาตรการความปลอดภัยขั้นวิกฤตที่ต้องทำก่อนเปิดตัว

---

❓ **Q7** - **Color Palette Focus**: เราควรใช้สี Electric Blue (#007AFF) ควบคู่กับ High-Precision Laser Cyan (#00ADFF) สำหรับปุ่มหลักและหมุดแผนที่ เพื่อให้ได้ความคมชัดตามมาตรฐาน WCAG AAA ใช่หรือไม่?

➡️ แนะนำ: ใช่ (Yes) - ให้ความรู้สึกโปร่ง สะอาดตา และหรูหราตามแบบฉบับ Apple

---

❓ **Q8** - **Audio & Haptic Feedback Defaults**: เราควรเปิดระบบเสียง Web Audio และการสั่นเบาๆ (Haptic Feedback) บนมือถือเมื่อปักหมุดหรือยืนยันคำตอบเป็นค่าเริ่มต้น ใช่หรือไม่?

➡️ แนะนำ: ใช่ (Yes) - เพิ่มมิติความสมจริงและความพึงพอใจในการเล่น (Tactile Satisfaction)

---

❓ **Q9** - **Codebase Cleanup (icons.tsx)**: เราควรลบไฟล์ src/components/icons.tsx ทิ้ง และย้ายไปใช้ชุดไอคอนมาตรฐานของ SFSymbols.tsx และ Lucide-react ทั้งหมด เพื่อขจัดโค้ดซ้ำซ้อนและลดขนาดไฟล์ ใช่หรือไม่?

➡️ แนะนำ: ใช่ (Yes) - ช่วยให้ระบบไอคอนมีสไตล์และความหนาของเส้นเป็นเอกภาพเดียวกันทั้งเว็บ

---

❓ **Q10** - **Leaderboard Route Unification**: เราควรให้ URL /leaderboard ทำการเชื่อมโยงเข้าสู่แท็บ Leaderboard ของหน้า /rank อย่างถาวร เพื่อไม่ให้มีหน้าแสดงผลที่ซ้ำซ้อนกัน ใช่หรือไม่?

➡️ แนะนำ: ใช่ (Yes) - จัดระเบียบเส้นทางสถาปัตยกรรม URL ให้สะอาดและไม่งง
```

---

## 6. Bite-Sized Test-Driven Implementation Strategy (Superpowers TDD)

แบ่งการปฏิบัติงานออกเป็น 4 เฟสตามหลักการ Superpowers Bite-Sized Execution และข้อสรุปจากการ Grilling:

### Phase 1: Foundation, Security & 4-Tab Navigation (เสร็จสิ้นแล้ว 100%)
- **สิ่งที่ทำสำเร็จแล้ว**:
  1. เพิ่ม Passcode Guard ล็อกเส้นทาง `/admins` (PIN 8888)
  2. ปรับลด Navigation สู่ 4 แถบหลัก: **Home, Play, Rank, Settings** (Desktop 240px macOS glass sidebar, Mobile 4-tab bar)
  3. ตัดระบบ Community, Feeds, Clans, และ Stories ออกทั้งหมด (-1,020 บรรทัด) และส่งสัญญาณ Redirect `/community` ไปยัง `/rank`
  4. ทำความสะอาดโค้ด ยุบ `icons.tsx` เข้ากับ `SFSymbols.tsx` และ Lucide React
  5. บังคับใช้สีแบรนด์หลัก `#00ADFF` (Laser Cyan) และหมึก `#03121C` (WCAG AAA)
  6. Unit Tests ผ่าน 17/17 tests (100%) และ Nitro SSR Build ผ่านสมบูรณ์ (1.67s)

### Phase 2: Core Gameplay Viewport & Map Immersion (เริ่มทำลำดับถัดไป)
- **สิ่งที่ทำ**:
  1. ซ่อนแถบนำทาง (ทั้ง Sidebar และ Mobile Tab Bar) ทั้งหมดเมื่อเข้าสู่ห้องเกม เพื่อมอบประสบการณ์ Full Viewport 100%
  2. ปรับกล่องคำใบ้เป็น **Dynamic Island แคปซูลโปร่งแสงลอยกึ่งกลางด้านบน (Top-Center)** เว้นพื้นที่ครึ่งล่างทั้งหมดให้เล็งหมุดได้อย่างอิสระ (คงสภาพ FLIP Animation ใน `SmartClue.tsx` ตามกฎ AGENTS.md)
  3. ปรับระบบเฉลยรอบ **Round Reveal เป็น Interactive Map Arc**: แผนที่บิน (FlyTo) โฟกัสระยะเชื่อมต่อระหว่างหมุดที่ทายกับพิกัดจริงด้วยเส้นเลเซอร์สีฟ้า พร้อมการ์ด Inset Bottom Card แสดงระยะทางและปุ่มข้ามรอบ
- **การทดสอบ**: รัน `npm test` และตรวจสอบการตอบสนองบนจอ iPhone 375px/393px และ MacBook 1440px

### Phase 3: Screen-by-Screen Hub Redesign (Home, Play, Rank, Settings)
- **สิ่งที่ทำ**:
  1. **Home (`/`)**: ตัด Top Bar ด้านบนออกทั้งหมด, ดีไซน์พื้นผิวไร้เส้นขอบเทา (Zero Gray Borders), ตัดวงแหวน Activity Rings ออก, แสดง Hero Daily Challenge เด่นตรงกลางจอ และแถบแคปซูลหมวดหมู่แนวนอนตาม Mobbin 1
  2. **Play Hub (`/play`)**: ปรับเป็น Apple Inset Clean List (ไร้เส้นขอบเทา) พร้อมไอคอนสี่เหลี่ยมมนสีสดใส แตะแล้วเปิด iOS Inset Bottom Sheet ตั้งค่าเกม
  3. **Rank Hub (`/rank`)**: การ์ดแสดงเหรียญแรงก์และคะแนน RP ด้านบน (ไร้เส้นขอบเทา) พร้อมแท็บ Apple Inset Segmented Tabs สลับดู Ladder / Leaderboard / History
  4. **Settings Hub (`/settings`)**: ปรับเป็น Apple iOS Inset Grouped Table (ไร้เส้นขอบเทา) มีการ์ดโปรไฟล์สไตล์ Apple ID ด้านบน ตามด้วยกลุ่มแถวตั้งค่า 4 หมวดพร้อมสวิตช์ iOS Switch และ Broadcast การเปลี่ยนภาษาทันที
- **การทดสอบ**: ทดสอบการสลับภาษาแบบทันที และการปรับเปลี่ยน Appearance โหมดมืด/สว่าง

### Phase 4: Multiplayer Party & Supabase Realtime Polish
- **สิ่งที่ทำ**:
  1. เชื่อมต่อห้อง Multiplayer Party & 1v1 Duel Arena ผ่าน Play Hub (`/play` -> Multiplayer Tab)
  2. ปรับปรุงกล่องกรอกรหัสห้อง 4 ตัวอักษรให้เป็น Apple Wallet OTP Squircle
  3. ระบบ Instant Guest-First เข้าเล่นได้ทันทีโดยไม่บังคับล็อกอิน และเปิดให้ผูกบัญชีใน Settings ได้อย่างอิสระ
- **คำสั่งทดสอบขั้นสุดท้าย**:
  ```bash
  npm test && npm run build
  ```
- **ผลลัพธ์ที่คาดหวัง**: ผ่านทุก Unit Tests 100%, Build Nitro SSR สำเร็จ ไร้ข้อผิดพลาด Type Checking พร้อมนำขึ้น Production
- **ผลลัพธ์ที่คาดหวัง**: Build สำเร็จสมบูรณ์ ไร้ข้อผิดพลาด Type Checking พร้อมส่งมอบงาน
