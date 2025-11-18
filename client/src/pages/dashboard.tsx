import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Search, MessageSquare, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Paper, PicoElement, Entity, Conversation } from "@shared/schema";

export default function Dashboard() {
  const { data: papers, isLoading: papersLoading } = useQuery<Paper[]>({
    queryKey: ["/api/papers"],
  });

  const { data: picoElements, isLoading: picoLoading } = useQuery<PicoElement[]>({
    queryKey: ["/api/pico-elements"],
  });

  const { data: entities, isLoading: entitiesLoading } = useQuery<Entity[]>({
    queryKey: ["/api/entities"],
  });

  const { data: conversations, isLoading: conversationsLoading } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
  });

  const stats = [
    {
      title: "Total Papers",
      value: papers?.length || 0,
      icon: FileText,
      description: "Uploaded research papers",
      testId: "stat-papers",
    },
    {
      title: "PICO Analyses",
      value: picoElements?.length || 0,
      icon: Activity,
      description: "Completed extractions",
      testId: "stat-pico",
    },
    {
      title: "Entities Extracted",
      value: entities?.length || 0,
      icon: Search,
      description: "Biomedical entities found",
      testId: "stat-entities",
    },
    {
      title: "Q&A Sessions",
      value: conversations?.length || 0,
      icon: MessageSquare,
      description: "Questions answered",
      testId: "stat-qa",
    },
  ];

  const recentPapers = papers?.slice(0, 5) || [];
  const isLoading = papersLoading || picoLoading || entitiesLoading || conversationsLoading;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-dashboard-title">
          Research Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Overview of your biomedical research analysis
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-semibold" data-testid={stat.testId}>
                  {stat.value}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Papers</CardTitle>
          <CardDescription>Your most recently uploaded research papers</CardDescription>
        </CardHeader>
        <CardContent>
          {papersLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : recentPapers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground" data-testid="text-no-papers">
                No papers uploaded yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Upload your first research paper to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentPapers.map((paper) => (
                <div
                  key={paper.id}
                  className="flex flex-col gap-1 border-l-4 border-l-primary pl-4"
                  data-testid={`paper-${paper.id}`}
                >
                  <h3 className="text-sm font-medium line-clamp-1">{paper.title}</h3>
                  <p className="text-xs text-muted-foreground">{paper.authors}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(paper.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
