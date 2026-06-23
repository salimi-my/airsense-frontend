"use client";

import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <Card className="border-destructive w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="text-destructive h-5 w-5 shrink-0" />
            <CardTitle>Something went wrong</CardTitle>
          </div>
          <CardDescription>
            An unexpected error occurred while loading this page.
            {error.digest && (
              <span className="mt-1 block font-mono text-xs">
                Error ID: {error.digest}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={reset} variant="outline" size="sm">
            Try again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
