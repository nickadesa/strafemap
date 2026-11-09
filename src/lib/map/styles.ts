import type { MapStyleOption, OpenFreeMapStyleId } from "./types";

export const OPENFREEMAP_STYLES: Record<OpenFreeMapStyleId, MapStyleOption> = {
  "apple-light": {
    id: "apple-light",
    name: "Apple Light",
    nameTh: "แอปเปิ้ล ไลท์ (Apple Light)",
    url: "https://tiles.openfreemap.org/styles/positron",
    accent: "#0071E3",
    waterColor: "#e8eef4",
    landColor: "#cdd6df",
    description: "Official Apple Maps light palette with sky-blue waters, sandy land, and crisp typography.",
    descriptionTh: "สไตล์ Apple Maps โทนสว่าง สีน้ำทะเลฟ้าสดใส แผ่นดินสีเบจนวลตา และเส้นถนนคมชัด",
  },
  "apple-dark": {
    id: "apple-dark",
    name: "Apple Dark",
    nameTh: "แอปเปิ้ล ดาร์ก (Apple Dark)",
    url: "https://tiles.openfreemap.org/styles/dark",
    accent: "#0A84FF",
    waterColor: "#07090c",
    landColor: "#2a313a",
    description: "Official Apple Maps dark mode with midnight deep-blue oceans and charcoal land.",
    descriptionTh: "สไตล์ Apple Maps โหมดมืด น้ำทะเลสีกรมท่าลึก แผ่นดินสีถ่านชาร์โคล เรียบหรู",
  },
  liberty: {
    id: "liberty",
    name: "Liberty",
    nameTh: "ลิเบอร์ตี้ (Liberty)",
    url: "https://tiles.openfreemap.org/styles/liberty",
    accent: "#0284c7",
    waterColor: "#a9d3df",
    landColor: "#eeeadb",
    description: "Classic comprehensive vector map with distinct roads, water, and parks.",
    descriptionTh: "แผนที่เวกเตอร์สไตล์คลาสสิก เห็นแม่น้ำ สวนสาธารณะ และโครงข่ายถนนชัดเจน",
  },
  positron: {
    id: "positron",
    name: "Positron",
    nameTh: "โพซิตรอน (Positron)",
    url: "https://tiles.openfreemap.org/styles/positron",
    accent: "#64748b",
    waterColor: "#dfe5ea",
    landColor: "#f4f5f6",
    description: "Minimalist grayscale light map emphasizing geometry and pins.",
    descriptionTh: "แผนที่โทนขาวเทาสะอาดตา ไร้สิ่งรบกวน เน้นเห็นหมุดปักอย่างเด่นชัด",
  },
  dark: {
    id: "dark",
    name: "Dark Minimal",
    nameTh: "ดาร์ก มินิมอล (Dark)",
    url: "https://tiles.openfreemap.org/styles/dark",
    accent: "#00ADFF",
    waterColor: "#000000",
    landColor: "#15181c",
    description: "Sleek dark basemap designed for neon pins and night navigation.",
    descriptionTh: "แผนที่โทนมืดสนิท สบายตา เหมาะสำหรับหมุดสีนีออนและแสงสลัว",
  },
  bright: {
    id: "bright",
    name: "Bright",
    nameTh: "สดใส (Bright)",
    url: "https://tiles.openfreemap.org/styles/bright",
    accent: "#0284c7",
    waterColor: "#bfe3f7",
    landColor: "#f1ecd9",
    description: "Vibrant topographic colors with crisp terrain and vivid borders.",
    descriptionTh: "แผนที่สีสันสดใส แยกแยะภูมิประเทศ แผ่นดิน และเส้นแบ่งเขตชัดเจน",
  },
  fiord: {
    id: "fiord",
    name: "Fiord",
    nameTh: "ฟยอร์ด (Fiord)",
    url: "https://tiles.openfreemap.org/styles/fiord",
    accent: "#38bdf8",
    waterColor: "#343f4b",
    landColor: "#4b5866",
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
