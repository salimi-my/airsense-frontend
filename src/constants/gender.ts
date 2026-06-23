import { Mars, Transgender, Venus, type LucideIcon } from "lucide-react";

export const GENDER_CONFIG: Record<
  string,
  { icon: LucideIcon; label: string }
> = {
  male: { icon: Mars, label: "Male" },
  female: { icon: Venus, label: "Female" },
  other: { icon: Transgender, label: "Other" },
};
