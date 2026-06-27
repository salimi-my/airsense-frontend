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
      className="flex min-h-16 shrink-0 flex-col justify-center gap-2 py-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 md:items-start"
    >
      <div className="flex items-center gap-2 px-4 max-sm:invisible">
        <p className="text-xs leading-tight text-nowrap sm:text-sm">
          &copy; {year}{" "}
        </p>
        <Separator orientation="vertical" className="mx-1 !h-4" />
        <p className="text-xs leading-tight sm:text-sm">
          Designed and Developed by{" "}
          <a
            href="https://airsense.salimi.my"
            target="_blank"
            rel="noopener noreferrer"
            className="link-hover hidden font-semibold md:inline-block"
          >
            AirSense
          </a>
        </p>
      </div>
      <div className="flex items-center gap-2 px-4 max-sm:invisible">
        <a
          href="https://airsense.salimi.my"
          target="_blank"
          rel="noopener noreferrer"
          className="link-hover text-xs leading-tight font-semibold md:hidden"
        >
          AirSense
        </a>
      </div>
      <div className="-mt-3 px-4 max-sm:invisible">
        <p className="text-muted-foreground text-xs leading-tight sm:text-sm">
          AirSense provides informational guidance only and is not a substitute
          for medical advice.
        </p>
      </div>
    </footer>
  );
}
