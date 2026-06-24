import { connection } from "next/server";

import { Separator } from "@/components/ui/separator";

export async function Footer() {
  await connection();
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        height: "calc(4rem + max(env(safe-area-inset-bottom), 0px))",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
      className="flex h-16 shrink-0 flex-col justify-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 md:items-start"
    >
      <div className="flex flex-col items-center justify-center gap-2 px-4 text-center">
        <p className="text-xs leading-tight sm:text-sm">
          Air quality data:{" "}
          <a
            href="https://aqicn.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            WAQI
          </a>{" "}
          /{" "}
          <a
            href="https://apims.doe.gov.my"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Malaysia DOE APIMS
          </a>
          · SDG 11 — Sustainable Cities
        </p>
        <p className="text-muted-foreground text-xs">
          AI outputs are for awareness only. Not medical advice.
        </p>
      </div>
      <div className="flex items-center justify-center gap-2 px-4">
        <p className="text-xs leading-tight text-nowrap sm:text-sm">
          &copy; {year}{" "}
        </p>
        <Separator orientation="vertical" className="mx-1 !h-4" />
        <p className="text-xs leading-tight sm:text-sm">
          AirSense — Group H (CSC577)
        </p>
      </div>
    </footer>
  );
}
