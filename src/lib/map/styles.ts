import type { MapStyleOption, OpenFreeMapStyleId } from "./types";

export const OPENFREEMAP_STYLES: Record<OpenFreeMapStyleId, MapStyleOption> = {
  "apple-light": {
    id: "apple-light",
    name: "Apple Light",
    nameTh: "แอปเปิ้ล ไลท์ (Apple Light)",
    url: "https://tiles.openfreemap.org/styles/positron",
    accent: "#0071E3",
    gradient: "linear-gradient(135deg, #aadaff 0%, #d8ecf8 40%, #f4f3f0 100%)",
    description: "Official Apple Maps light palette with sky-blue waters, sandy land, and crisp typography.",
    descriptionTh: "สไตล์ Apple Maps โทนสว่าง สีน้ำทะเลฟ้าสดใส แผ่นดินสีเบจนวลตา และเส้นถนนคมชัด",
  },
  "apple-dark": {
    id: "apple-dark",
    name: "Apple Dark",
    nameTh: "แอปเปิ้ล ดาร์ก (Apple Dark)",
    url: "https://tiles.openfreemap.org/styles/dark",
    accent: "#0A84FF",
    gradient: "linear-gradient(135deg, #192634 0%, #20222a 50%, #292a32 100%)",
    description: "Official Apple Maps dark mode with midnight deep-blue oceans and charcoal land.",
    descriptionTh: "สไตล์ Apple Maps โหมดมืด น้ำทะเลสีกรมท่าลึก แผ่นดินสีถ่านชาร์โคล เรียบหรู",
  },
  liberty: {
    id: "liberty",
    name: "Liberty",
    nameTh: "ลิเบอร์ตี้ (Liberty)",
    url: "https://tiles.openfreemap.org/styles/liberty",
    accent: "#0284c7",
    gradient: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%)",
    description: "Classic comprehensive vector map with distinct roads, water, and parks.",
    descriptionTh: "แผนที่เวกเตอร์สไตล์คลาสสิก เห็นแม่น้ำ สวนสาธารณะ และโครงข่ายถนนชัดเจน",
  },
  positron: {
    id: "positron",
    name: "Positron",
    nameTh: "โพซิตรอน (Positron)",
    url: "https://tiles.openfreemap.org/styles/positron",
    accent: "#64748b",
    gradient: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
    description: "Minimalist grayscale light map emphasizing geometry and pins.",
    descriptionTh: "แผนที่โทนขาวเทาสะอาดตา ไร้สิ่งรบกวน เน้นเห็นหมุดปักอย่างเด่นชัด",
  },
  dark: {
    id: "dark",
    name: "Dark Minimal",
    nameTh: "ดาร์ก มินิมอล (Dark)",
    url: "https://tiles.openfreemap.org/styles/dark",
    accent: "#D2F801",
    gradient: "linear-gradient(135deg, #111113 0%, #1c1c20 50%, #282830 100%)",
    description: "Sleek dark basemap designed for neon pins and night navigation.",
    descriptionTh: "แผนที่โทนมืดสนิท สบายตา เหมาะสำหรับหมุดสีนีออนและแสงสลัว",
  },
  bright: {
    id: "bright",
    name: "Bright",
    nameTh: "สดใส (Bright)",
    url: "https://tiles.openfreemap.org/styles/bright",
    accent: "#10b981",
    gradient: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)",
    description: "Vibrant topographic colors with lush greens and vivid borders.",
    descriptionTh: "แผนที่สีสันสดใส แยกแยะธรรมชาติ แผ่นดิน ป่าไม้ และเส้นแบ่งเขตชัดเจน",
  },
  fiord: {
    id: "fiord",
    name: "Fiord",
    nameTh: "ฟยอร์ด (Fiord)",
    url: "https://tiles.openfreemap.org/styles/fiord",
    accent: "#38bdf8",
    gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
    description: "Cool Nordic deep slate tones with crisp contrast.",
    descriptionTh: "แผนที่โทนสีน้ำเงินคราม-หินชนวนสไตล์นอร์ดิก คมชัดและทันสมัย",
  },
};

export const STYLE_ORDER: OpenFreeMapStyleId[] = [
  "apple-light",
  "apple-dark",
  "liberty",
  "positron",
  "dark",
  "bright",
  "fiord",
];

export const MAP_ATTRIBUTION =
  '<a href="https://openfreemap.org" target="_blank" rel="noopener noreferrer">OpenFreeMap</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>';

export function resolveDefaultMapStyle(isDark: boolean): OpenFreeMapStyleId {
  return isDark ? "apple-dark" : "apple-light";
}
