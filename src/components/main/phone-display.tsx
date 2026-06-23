import { cn } from "@/lib/utils";
import { parsePhoneNumber } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

interface PhoneDisplayProps {
  phone: string | null;
  showFlag?: boolean;
  format?: "international" | "national";
  className?: string;
}

export function PhoneDisplay({
  phone,
  showFlag = true,
  format = "international",
  className,
}: PhoneDisplayProps) {
  if (!phone) return <span className={className}>N/A</span>;

  let phoneNumber: ReturnType<typeof parsePhoneNumber> | undefined;
  try {
    phoneNumber = parsePhoneNumber(phone);
  } catch (error) {
    // If parsing fails, just return the original phone number
    console.warn("Failed to parse phone number:", phone, error);
  }

  if (phoneNumber && phoneNumber.country) {
    const country = phoneNumber.country;
    const Flag = flags[country as keyof typeof flags];

    // Format the phone number based on the format prop
    const formattedNumber =
      format === "national"
        ? phoneNumber.formatNational()
        : phoneNumber.formatInternational();

    if (showFlag && Flag) {
      return (
        <div className={cn("flex items-center gap-2", className)}>
          <span className="bg-foreground/20 flex h-3.5 w-5.5 overflow-hidden rounded-none border md:h-4.5 md:w-6.5 [&_svg:not([class*='size-'])]:size-full">
            <Flag title={country} />
          </span>
          <span>{formattedNumber}</span>
        </div>
      );
    }

    return <span className={className}>{formattedNumber}</span>;
  }

  return <span className={className}>{phone}</span>;
}
