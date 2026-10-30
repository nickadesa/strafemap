import { Settings } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function GameSettingsButton() {
  return (
    <Link
      to="/settings"
      className="absolute bottom-4 left-16 z-[600] grid h-11 w-11 place-items-center rounded-full border border-border/40 bg-card/80 shadow-md backdrop-blur-md hover:bg-card"
      title="Settings"
    >
      <Settings className="h-5 w-5" />
    </Link>
  );
}
