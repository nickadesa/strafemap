import { useState } from "react";
import { t, type Lang } from "@/lib/i18n";
import { buzz } from "@/lib/game/sound";
import { STYLE_ORDER } from "@/lib/map/styles";
import type { OpenFreeMapStyleId } from "@/lib/map/types";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Layers,
  Globe,
  LogOut,
  X,
  AlertTriangle,
} from "lucide-react";

interface GameSettingsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sound: boolean;
  onToggleSound: () => void;
  blind: boolean;
  onToggleBlind: () => void;
  hideBlindOption: boolean;
  hideZoomButtons: boolean;
  onToggleZoomButtons: () => void;
  activeMapStyle: OpenFreeMapStyleId;
  onSelectMapStyle: (s: OpenFreeMapStyleId) => void;
  lang: Lang;
  onSelectLang: (l: Lang) => void;
  onConfirmQuit: () => void;
  daily: boolean;
  ranked: boolean;
  quitAlertOpen?: boolean;
  onQuitAlertOpenChange?: (open: boolean) => void;
}

export function GameSettingsPanel({
  open,
  onOpenChange,
  sound,
  onToggleSound,
  blind,
  onToggleBlind,
  hideBlindOption,
  hideZoomButtons,
  onToggleZoomButtons,
  activeMapStyle,
  onSelectMapStyle,
  lang,
  onSelectLang,
  onConfirmQuit,
  daily,
  ranked,
  quitAlertOpen: controlledQuitAlertOpen,
  onQuitAlertOpenChange,
}: GameSettingsPanelProps) {
  const [internalQuitAlertOpen, setInternalQuitAlertOpen] = useState(false);
  const quitAlertOpen = controlledQuitAlertOpen ?? internalQuitAlertOpen;
  const setQuitAlertOpen = (v: boolean) => {
    setInternalQuitAlertOpen(v);
    onQuitAlertOpenChange?.(v);
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="mx-auto max-w-md p-5 sm:p-6">
          <DrawerHeader className="p-0 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <DrawerTitle className="text-base font-bold text-foreground">
                {t(lang, "settings")}
              </DrawerTitle>
              <DrawerClose asChild>
                <button
                  type="button"
                  aria-label="Close"
                  className="rounded-full p-1.5 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="mt-4 space-y-4">
            {/* Apple Inset Grouped Settings List */}
            <div className="apple-group">
              {/* Sound Toggle */}
              <button
                type="button"
                onClick={() => {
                  buzz(4);
                  onToggleSound();
                }}
                className="apple-row w-full text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-7 w-7 place-items-center rounded-lg bg-muted text-foreground">
                    {sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <span className="text-sm font-medium">{t(lang, "sound")}</span>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">
                  {sound ? t(lang, "on") : t(lang, "off")}
                </span>
              </button>

              {/* Map Labels Toggle (Hidden in Hardcore Blind mode) */}
              {!hideBlindOption && (
                <button
                  type="button"
                  onClick={() => {
                    buzz(4);
                    onToggleBlind();
                  }}
                  className="apple-row w-full text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-7 w-7 place-items-center rounded-lg bg-muted text-foreground">
                      {blind ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </div>
                    <span className="text-sm font-medium">{t(lang, "labelsHidden")}</span>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {blind ? t(lang, "on") : t(lang, "off")}
                  </span>
                </button>
              )}

              {/* Zoom Buttons Toggle */}
              <button
                type="button"
                onClick={() => {
                  buzz(4);
                  onToggleZoomButtons();
                }}
                className="apple-row w-full text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-7 w-7 place-items-center rounded-lg bg-muted text-xs font-bold text-foreground">
                    +/−
                  </div>
                  <span className="text-sm font-medium">Zoom Buttons</span>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">
                  {!hideZoomButtons ? t(lang, "on") : t(lang, "off")}
                </span>
              </button>

              {/* Map Style Selector Row */}
              <div className="apple-row">
                <div className="flex items-center gap-3">
                  <div className="grid h-7 w-7 place-items-center rounded-lg bg-muted text-foreground">
                    <Layers className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">{t(lang, "mapStyle") || "Style"}</span>
                </div>
                <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] no-scrollbar">
                  {STYLE_ORDER.map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        buzz(4);
                        onSelectMapStyle(id);
                      }}
                      className={`rounded-lg px-2 py-1 text-[11px] font-semibold transition-colors shrink-0 ${
                        activeMapStyle === id
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {id === "apple-light" ? "Apple L" : id === "apple-dark" ? "Apple D" : id.slice(0, 4)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Switch Row (Reactively changes language in-place!) */}
              <div className="apple-row">
                <div className="flex items-center gap-3">
                  <div className="grid h-7 w-7 place-items-center rounded-lg bg-muted text-foreground">
                    <Globe className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">{t(lang, "language")}</span>
                </div>
                <div className="flex items-center gap-1 overflow-x-auto max-w-[210px] no-scrollbar">
                  {(["en", "th", "ko", "zh", "ja", "es", "fr"] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => {
                        buzz(4);
                        onSelectLang(l);
                      }}
                      className={`rounded-lg px-2 py-1 text-[11px] font-semibold transition-colors shrink-0 ${
                        lang === l
                          ? "bg-accent-fill text-[#03121C]"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Exit / Forfeit Game Button */}
            <button
              type="button"
              onClick={() => {
                buzz(8);
                onOpenChange(false);
                setQuitAlertOpen(true);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 py-3 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/20"
            >
              <LogOut className="h-4 w-4" />
              <span>{daily || ranked ? "Forfeit Match" : t(lang, "leave")}</span>
            </button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* System Apple Alert: Leave this game? */}
      {quitAlertOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="plate max-w-sm w-full p-6 text-center shadow-2xl space-y-3">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-destructive/15 text-destructive">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <h3 className="font-display text-xl text-foreground">
              {t(lang, "leaveGameTitle")}
            </h3>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {daily
                ? "Leaving now records an immediate 0-point forfeit. You will not be able to replay today's Daily Challenge."
                : ranked
                ? "Leaving an active Ranked match counts as an immediate forfeit loss and RP penalty."
                : t(lang, "leaveGameBody")}
            </p>

            <div className="pt-2 flex gap-2.5">
              <button
                type="button"
                onClick={() => setQuitAlertOpen(false)}
                className="btn btn-outline flex-1 py-2.5 text-xs font-semibold rounded-full"
              >
                {t(lang, "keepPlaying")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setQuitAlertOpen(false);
                  onConfirmQuit();
                }}
                className="btn flex-1 py-2.5 text-xs font-semibold rounded-full bg-destructive text-white hover:bg-destructive/90"
              >
                {t(lang, "leave")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
