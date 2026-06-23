import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ContentCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function ContentCard({
  title,
  description,
  children,
}: ContentCardProps) {
  return (
    <Card className="border-sidebar-border border ring-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
