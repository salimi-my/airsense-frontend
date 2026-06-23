import { ShieldX } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export const metadata: Metadata = {
  title: "Unauthorized — AirSense",
  description: "You don't have permission to access this page.",
};

export default function UnauthorizedPage() {
  return (
    <Card>
      <CardContent>
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ShieldX />
            </EmptyMedia>
            <EmptyTitle>Access Denied</EmptyTitle>
            <EmptyDescription>
              You don&apos;t have permission to access this page. Please contact
              your administrator if you believe this is an error.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/settings">Account Settings</Link>
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  );
}
