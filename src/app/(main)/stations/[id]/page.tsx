import { Metadata } from "next";

import { StationDetailContent } from "@/components/airsense/station-detail-content";

export const metadata: Metadata = {
  title: "Station Detail — AirSense",
};

export default async function StationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <StationDetailContent id={Number(id)} />;
}
