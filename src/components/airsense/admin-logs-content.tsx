"use client";

import useSWR from "swr";

import { AQI_COLORS } from "@/constants/airsense";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_ENDPOINTS } from "@/constants/routes";
import { fetcher } from "@/lib/fetcher";
import type { ApiResponse } from "@/types/api";
import type { AdminAssessmentLog, AdminReadingLog } from "@/types/airsense";
import type { PaginatedResponse } from "@/types/pagination";

export function AdminLogsContent() {
  const { data: readingsData, isLoading: readingsLoading } = useSWR<
    ApiResponse<PaginatedResponse<AdminReadingLog>>
  >(API_ENDPOINTS.ADMIN_READINGS, fetcher);

  const { data: assessmentsData, isLoading: assessmentsLoading } = useSWR<
    ApiResponse<PaginatedResponse<AdminAssessmentLog>>
  >(API_ENDPOINTS.ADMIN_ASSESSMENTS, fetcher);

  return (
    <Tabs defaultValue="readings">
      <TabsList className="h-10">
        <TabsTrigger value="readings">Station Readings</TabsTrigger>
        <TabsTrigger value="assessments">AI Assessments</TabsTrigger>
      </TabsList>

      <TabsContent value="readings" className="mt-4">
        <div className="airsense-surface overflow-hidden rounded-2xl">
          <div className="border-b px-6 py-4">
            <h3 className="font-semibold">Latest Readings Log</h3>
          </div>
          <div className="p-2">
            {readingsLoading ? (
              <Skeleton className="m-4 h-40 w-full" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Station</TableHead>
                    <TableHead>AQI</TableHead>
                    <TableHead>Fetched At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(readingsData?.data.data ?? []).map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">
                        {row.station?.name ?? row.station_id}
                      </TableCell>
                      <TableCell>
                        <span
                          className="inline-flex min-w-10 justify-center rounded-md px-2 py-0.5 text-xs font-bold text-white"
                          style={{
                            backgroundColor:
                              row.aqi <= 50
                                ? AQI_COLORS.good
                                : row.aqi <= 100
                                  ? AQI_COLORS.moderate
                                  : row.aqi <= 200
                                    ? AQI_COLORS.unhealthy
                                    : row.aqi <= 300
                                      ? AQI_COLORS["very-unhealthy"]
                                      : AQI_COLORS.hazardous,
                          }}
                        >
                          {row.aqi}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(row.fetched_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="assessments" className="mt-4">
        <div className="airsense-surface overflow-hidden rounded-2xl">
          <div className="border-b px-6 py-4">
            <h3 className="font-semibold">Assessment Audit Log</h3>
          </div>
          <div className="p-2">
            {assessmentsLoading ? (
              <Skeleton className="m-4 h-40 w-full" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Station</TableHead>
                    <TableHead>Profile</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(assessmentsData?.data.data ?? []).map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">
                        {row.station?.name ?? row.station_id}
                      </TableCell>
                      <TableCell className="text-xs">
                        {row.age_group} · {row.activity}
                        {row.used_fallback && (
                          <Badge variant="outline" className="ml-2">
                            fallback
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{row.risk_level}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(row.assessed_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
