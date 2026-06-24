"use client";

import { formatDistanceToNow } from "date-fns";
import { Activity, Clock } from "lucide-react";
import Link from "next/link";

import { RISK_COLORS } from "@/constants/airsense";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import type { MyAssessmentLog } from "@/types/airsense";

interface RecentAssessmentsProps {
  assessments: MyAssessmentLog[];
  isLoading: boolean;
  stationId?: number | null;
}

export function RecentAssessments({
  assessments,
  isLoading,
  stationId,
}: RecentAssessmentsProps) {
  if (isLoading) {
    return <RecentAssessmentsSkeleton />;
  }

  const assessHref = stationId ? `/assess?station=${stationId}` : "/assess";

  return (
    <Card className="border-sidebar-border flex h-full max-h-[420px] min-h-[420px] flex-col overflow-hidden max-md:py-4">
      <CardHeader className="shrink-0 max-md:px-4">
        <CardTitle className="flex items-center gap-2 max-md:text-sm">
          Recent Assessments
        </CardTitle>
        <CardDescription className="max-md:text-[11px]">
          Your latest AI-powered health risk results
        </CardDescription>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col overflow-hidden max-md:px-4">
        {assessments.length === 0 ? (
          <div className="flex flex-1 flex-col justify-center overflow-hidden">
            <Empty className="border-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Activity />
              </EmptyMedia>
              <EmptyTitle>No assessments yet</EmptyTitle>
              <EmptyDescription>
                Run a personalized risk assessment based on your health profile
                and local air quality.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button size="sm" asChild>
                <Link href={assessHref}>Assess My Risk</Link>
              </Button>
            </EmptyContent>
          </Empty>
          </div>
        ) : (
          <ScrollArea className="min-h-0 flex-1 overflow-hidden">
            <div className="space-y-3 pr-3 max-md:space-y-2">
              {assessments.map((item) => (
                <div
                  key={item.id}
                  className="hover:bg-accent/50 rounded-lg border p-3 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {item.station?.name ?? `Station #${item.station_id}`}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {item.age_group} · {item.activity.replace(/_/g, " ")}
                      </p>
                    </div>
                    <Badge
                      className="shrink-0 border-0 text-white"
                      style={{
                        backgroundColor: RISK_COLORS[item.risk_level],
                      }}
                    >
                      {item.risk_level}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    <Clock className="size-3" />
                    <span className="text-muted-foreground">
                      {formatDistanceToNow(new Date(item.assessed_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

export function RecentAssessmentsSkeleton() {
  return (
    <Card className="border-sidebar-border flex h-full max-h-[420px] min-h-[420px] flex-col overflow-hidden max-md:py-4">
      <CardHeader className="shrink-0 max-md:px-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-2 h-4 w-56" />
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col overflow-hidden max-md:px-4">
        <ScrollArea className="min-h-0 flex-1 overflow-hidden">
          <div className="flex flex-col gap-3 pr-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
