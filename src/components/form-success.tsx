import { CircleCheck } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface FormSuccessProps {
  className?: string;
  message?: string;
}

export function FormSuccess({ className, message }: FormSuccessProps) {
  if (!message) return null;

  return (
    <Alert variant="success" className={cn(className)}>
      <CircleCheck className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-2">Success</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
