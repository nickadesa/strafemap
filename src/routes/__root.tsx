import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { appearanceInitScript, applyAppearance, themeInitScript } from "@/lib/theme";
import { applyLocaleTypography, localeInitScript, useLocaleTypography } from "@/lib/locale-font";
import { LiquidGlassDefs } from "@/components/LiquidGlassDefs";
import { t, type Lang } from "@/lib/i18n";
import { useSettings } from "@/lib/game/storage";
import appCss from "../styles.css?url";
import maplibreCss from "maplibre-gl/dist/maplibre-gl.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "STRAFE — Drop one pin. Know the world." },
      { name: "description", content: "A fast map-guessing game. Five rounds, one pin each, daily global challenge." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: maplibreCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  component: RootComponent,
  shellComponent: RootShell,
  notFoundComponent: NotFound,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript + appearanceInitScript + localeInitScript }} />
        <HeadContent />
      </head>
      <body>
        <LiquidGlassDefs />
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [settings] = useSettings();
  const lang = (settings.language ?? "en") as Lang;

  useLocaleTypography();

  useEffect(() => {
    applyAppearance();
  }, []);

  useEffect(() => {
    applyLocaleTypography(lang);
  }, [lang]);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}

function NotFound() {
  const [s] = useSettings();
  const lang = (s.language ?? "en") as Lang;
  return (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <p className="font-display text-8xl">404</p>
        <p className="mt-2 text-muted-foreground">{t(lang, "notFound")}</p>
        <a href="/" className="btn btn-primary mt-6">
          {t(lang, "backHome")}
        </a>
      </div>
    </div>
  );
}
