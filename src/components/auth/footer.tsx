import { connection } from "next/server";

import { Separator } from "@/components/ui/separator";

export async function Footer() {
  await connection();
  const year = new Date().getFullYear();

  return (
    <footer className="flex shrink-0 flex-col items-center justify-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="text-muted-foreground flex items-center gap-1 px-4">
        <p className="text-xs leading-tight text-nowrap">&copy; {year} </p>
        <Separator orientation="vertical" className="mx-1 !h-4" />
        <p className="text-xs leading-tight">
          Designed and Developed by{" "}
          <a
            href="https://airsense.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary relative hidden after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-left after:scale-x-100 after:bg-current after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-right hover:after:scale-x-0 md:inline-block"
          >
            AirSense
          </a>
        </p>
      </div>
      <div className="text-muted-foreground flex items-center gap-1 px-4">
        <a
          href="https://airsense.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary relative inline-block text-xs leading-tight after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-left after:scale-x-100 after:bg-current after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-right hover:after:scale-x-0 md:hidden"
        >
          AirSense
        </a>
      </div>
    </footer>
  );
}
