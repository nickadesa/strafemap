import { useState } from "react";
import { Layers, Check, X, Box } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { OPENFREEMAP_STYLES, STYLE_ORDER } from "@/lib/map/styles";
import type { OpenFreeMapStyleId } from "@/lib/map/types";
import { t, type Lang } from "@/lib/i18n";
import { blip } from "@/lib/game/sound";

interface Props {
  lang?: Lang;
  currentStyle: OpenFreeMapStyleId;
  onSelectStyle: (styleId: OpenFreeMapStyleId) => void;
  className?: string;
}

export function MapStyleSelector({
  lang = "en",
  currentStyle,
  onSelectStyle,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);

  const handleSelect = (id: OpenFreeMapStyleId) => {
    blip(true);
    onSelectStyle(id);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Map Style & Layers"
        title="OpenFreeMap Styles"
        className={`glass-plate grid h-9 w-9 place-items-center rounded-full shadow-sm transition-all active:scale-95 hover:bg-muted/80 ${className}`}
      >
        <Layers className="h-4 w-4 text-foreground" />
      </button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="mx-auto max-w-lg p-5 sm:p-6">
          <DrawerHeader className="p-0 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="grid h-7 w-7 place-items-center rounded-full bg-foreground text-background">
                  <Layers className="h-4 w-4" />
                </div>
                <div>
                  <DrawerTitle className="text-base font-bold text-foreground">
                    {t(lang, "mapStyle") || "Map Styles"}
                  </DrawerTitle>
                  <p className="text-[11px] text-muted-foreground">
                    OpenFreeMap &bull; 100% Free Vector Maps
                  </p>
                </div>
              </div>
              <DrawerClose className="rounded-full p-1.5 hover:bg-muted transition-colors">
                <X className="h-4 w-4 text-muted-foreground" />
              </DrawerClose>
            </div>
          </DrawerHeader>

          {/* 6 Official Styles Card Grid */}
          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {STYLE_ORDER.map((id) => {
              const opt = OPENFREEMAP_STYLES[id];
              const isActive = currentStyle === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleSelect(id)}
                  className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border p-3 text-left transition-all active:scale-[0.98] ${
                    isActive
                      ? "border-foreground ring-2 ring-foreground/20 shadow-md"
                      : "border-border/70 hover:border-border hover:bg-muted/30"
                  }`}
                  style={{
                    background: isActive
                      ? "color-mix(in oklab, var(--color-card) 94%, var(--color-foreground))"
                      : "var(--color-card)",
                  }}
                >
                  {/* Visual Style Preview Gradient Header */}
                  <div
                    className="relative mb-2 h-16 w-full rounded-xl overflow-hidden border border-black/10 dark:border-white/10 shadow-inner flex items-center justify-center"
                    style={{ background: opt.gradient }}
                  >
                    {isActive && (
                      <div className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-foreground text-background shadow-sm">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">
                        {lang === "th" ? opt.nameTh : opt.name}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[10px] line-clamp-2 text-muted-foreground leading-snug">
                      {lang === "th" ? opt.descriptionTh : opt.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[11px] text-muted-foreground">
            <span>Powered by MapLibre GL JS</span>
            <span
              dangerouslySetInnerHTML={{
                __html:
                  '<a href="https://openfreemap.org" target="_blank" rel="noopener" class="underline hover:text-foreground">OpenFreeMap</a> &bull; &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener" class="underline hover:text-foreground">OSM</a>',
              }}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
