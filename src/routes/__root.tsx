import { Outlet, createRootRoute, HeadContent, Scripts, Link } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl font-extrabold text-gradient-brand">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Off the setlist</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This page doesn't exist. Let's get you back to the booth.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TMANT — DJ South Africa | Amapiano, Private School & Sgidongo Bookings" },
      {
        name: "description",
        content:
          "Book TMANT, a South African DJ available nationwide for clubs, private parties, festivals, lounges and corporate events. Amapiano, Private School and Sgidongo. Professional. Reliable. Unforgettable.",
      },
      { name: "keywords", content: "DJ South Africa, Amapiano DJ, Private School DJ, Sgidongo DJ, DJ bookings, event DJ, TMANT" },
      { property: "og:title", content: "TMANT — DJ South Africa | Amapiano, Private School & Sgidongo Bookings" },
      { property: "og:description", content: "Book TMANT, a DJ specializing in House, Private Piano, and Amapiano, for your next event." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "TMANT — DJ South Africa | Amapiano, Private School & Sgidongo Bookings" },
      { name: "description", content: "Book TMANT, a DJ specializing in House, Private Piano, and Amapiano, for your next event." },
      { name: "twitter:description", content: "Book TMANT, a DJ specializing in House, Private Piano, and Amapiano, for your next event." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b6be71bb-edd3-40fd-b45f-22da4a79b9a9/id-preview-6a462d26--8c13b174-e883-4025-8cd4-71bdb656126b.lovable.app-1778012203158.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b6be71bb-edd3-40fd-b45f-22da4a79b9a9/id-preview-6a462d26--8c13b174-e883-4025-8cd4-71bdb656126b.lovable.app-1778012203158.png" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Toaster theme="dark" richColors position="top-center" />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
