import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Trash2, Beaker, Tag, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Paper, PicoElement, Entity } from "@shared/schema";

export default function LibraryPage() {
  const [selectedPaper, setSelectedPaper] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: papers, isLoading: papersLoading } = useQuery<Paper[]>({
    queryKey: ["/api/papers"],
  });

  const { data: picoElements } = useQuery<PicoElement[]>({
    queryKey: ["/api/pico-elements"],
  });

  const { data: entities } = useQuery<Entity[]>({
    queryKey: ["/api/entities"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/papers/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/papers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/pico-elements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/entities"] });
      setSelectedPaper(null);
      toast({
        title: "Paper deleted",
        description: "The paper has been removed from your library.",
      });
    },
  });

  const extractPicoMutation = useMutation({
    mutationFn: async (paperId: string) => {
      return await apiRequest("POST", `/api/papers/${paperId}/extract-pico`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pico-elements"] });
      toast({
        title: "PICO extraction started",
        description: "Analyzing paper for PICO elements...",
      });
    },
  });

  const extractEntitiesMutation = useMutation({
    mutationFn: async (paperId: string) => {
      return await apiRequest("POST", `/api/papers/${paperId}/extract-entities`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/entities"] });
      toast({
        title: "Entity extraction started",
        description: "Extracting biomedical entities...",
      });
    },
  });

  const selectedPaperData = papers?.find((p) => p.id === selectedPaper);
  const selectedPico = picoElements?.find((p) => p.paperId === selectedPaper);
  const selectedEntities = entities?.filter((e) => e.paperId === selectedPaper) || [];

  const groupedEntities = selectedEntities.reduce((acc, entity) => {
    if (!acc[entity.type]) acc[entity.type] = [];
    acc[entity.type].push(entity);
    return acc;
  }, {} as Record<string, Entity[]>);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-library-title">
          Paper Library
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage and analyze your research papers
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Papers</CardTitle>
              <CardDescription>
                {papers?.length || 0} papers in library
              </CardDescription>
            </CardHeader>
            <CardContent>
              {papersLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20" />
                  ))}
                </div>
              ) : papers && papers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground" data-testid="text-no-papers">
                    No papers yet
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {papers?.map((paper) => (
                    <div
                      key={paper.id}
                      className={`p-3 rounded-md border cursor-pointer transition-colors hover-elevate ${
                        selectedPaper === paper.id ? "bg-accent border-accent-border" : ""
                      }`}
                      onClick={() => setSelectedPaper(paper.id)}
                      data-testid={`paper-card-${paper.id}`}
                    >
                      <h3 className="text-sm font-medium line-clamp-2">{paper.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{paper.authors}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {paper.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {!selectedPaperData ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground" data-testid="text-select-paper">
                  Select a paper to view details
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-2">{selectedPaperData.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {selectedPaperData.authors}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(selectedPaperData.id)}
                    disabled={deleteMutation.isPending}
                    data-testid="button-delete-paper"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => extractPicoMutation.mutate(selectedPaperData.id)}
                    disabled={extractPicoMutation.isPending}
                    data-testid="button-extract-pico"
                  >
                    {extractPicoMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Beaker className="mr-2 h-4 w-4" />
                    )}
                    Extract PICO
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => extractEntitiesMutation.mutate(selectedPaperData.id)}
                    disabled={extractEntitiesMutation.isPending}
                    data-testid="button-extract-entities"
                  >
                    {extractEntitiesMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Tag className="mr-2 h-4 w-4" />
                    )}
                    Extract Entities
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="abstract">
                  <TabsList className="w-full">
                    <TabsTrigger value="abstract" className="flex-1" data-testid="tab-abstract">
                      Abstract
                    </TabsTrigger>
                    <TabsTrigger value="pico" className="flex-1" data-testid="tab-pico">
                      PICO
                    </TabsTrigger>
                    <TabsTrigger value="entities" className="flex-1" data-testid="tab-entities">
                      Entities
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="abstract" className="mt-4">
                    <p className="text-sm leading-relaxed">{selectedPaperData.abstract}</p>
                  </TabsContent>

                  <TabsContent value="pico" className="mt-4 space-y-4">
                    {!selectedPico ? (
                      <div className="text-center py-8">
                        <p className="text-sm text-muted-foreground" data-testid="text-no-pico">
                          No PICO analysis yet. Click "Extract PICO" to analyze.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {[
                          { label: "Population", value: selectedPico.population, color: "border-l-chart-1" },
                          { label: "Intervention", value: selectedPico.intervention, color: "border-l-chart-2" },
                          { label: "Comparison", value: selectedPico.comparison, color: "border-l-chart-3" },
                          { label: "Outcome", value: selectedPico.outcome, color: "border-l-chart-4" },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className={`border-l-4 ${item.color} pl-4`}
                            data-testid={`pico-${item.label.toLowerCase()}`}
                          >
                            <h4 className="text-sm font-semibold mb-1">{item.label}</h4>
                            <p className="text-sm text-muted-foreground">
                              {item.value || "Not found"}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="entities" className="mt-4">
                    {selectedEntities.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-sm text-muted-foreground" data-testid="text-no-entities">
                          No entities extracted yet. Click "Extract Entities" to analyze.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {Object.entries(groupedEntities).map(([type, items]) => (
                          <div key={type} data-testid={`entity-group-${type}`}>
                            <h4 className="text-sm font-semibold mb-2 capitalize">{type}s</h4>
                            <div className="flex flex-wrap gap-2">
                              {items.map((entity) => (
                                <Badge
                                  key={entity.id}
                                  variant="secondary"
                                  data-testid={`entity-${entity.id}`}
                                >
                                  {entity.text}
                                  {entity.frequency > 1 && (
                                    <span className="ml-1 text-xs">({entity.frequency})</span>
                                  )}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
