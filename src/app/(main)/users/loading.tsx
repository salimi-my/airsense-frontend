import { ContentCard } from "@/components/layout/content-card";
import { TableSkeleton } from "@/components/main/table-skeleton";

export default function UsersLoading() {
  return (
    <ContentCard
      title="Users List"
      description="Here's the listing of all the users."
    >
      <TableSkeleton
        columnCount={9}
        searchableColumnCount={1}
        filterableColumnCount={2}
        rightButtonCount={1}
        cellWidths={[
          "2.5rem",
          "12rem",
          "12rem",
          "8rem",
          "8rem",
          "8rem",
          "8rem",
          "8rem",
          "8rem",
        ]}
        shrinkZero
        mobileCard // Uncomment this when we have a mobile layout
      />
    </ContentCard>
  );
}
