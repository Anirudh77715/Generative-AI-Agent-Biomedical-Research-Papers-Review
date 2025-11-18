import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Conversation } from "@shared/schema";

export default function QAPage() {
  const [question, setQuestion] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: conversations, isLoading } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
  });

  const askMutation = useMutation({
    mutationFn: async (q: string) => {
      return await apiRequest("POST", "/api/qa", { question: q });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      setQuestion("");
    },
    onError: () => {
      toast({
        title: "Question failed",
        description: "Could not process your question. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      askMutation.mutate(question.trim());
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto h-[calc(100vh-3rem)]">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-qa-title">
          Q&A Assistant
        </h1>
        <p className="text-sm text-muted-foreground">
          Ask questions about your research papers and get AI-powered answers with citations
        </p>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>Conversation</CardTitle>
          <CardDescription>
            All answers include citations to source papers
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4">
          <ScrollArea className="flex-1 pr-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-16 w-full" />
                  </div>
                ))}
              </div>
            ) : !conversations || conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground" data-testid="text-no-conversations">
                  No questions asked yet
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Start by asking a question about your research papers
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {conversations.map((conv) => (
                  <div key={conv.id} className="space-y-3" data-testid={`conversation-${conv.id}`}>
                    <div className="flex justify-end">
                      <div className="max-w-[85%] rounded-md bg-primary text-primary-foreground p-3">
                        <p className="text-sm">{conv.question}</p>
                      </div>
                    </div>

                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-md bg-muted p-4 space-y-3">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {conv.answer}
                        </p>

                        {conv.citations && conv.citations.length > 0 && (
                          <div className="space-y-2 border-t border-border pt-3 mt-3">
                            <p className="text-xs font-semibold text-muted-foreground">
                              Citations:
                            </p>
                            {conv.citations.map((citation, idx) => (
                              <div
                                key={idx}
                                className="text-xs space-y-1"
                                data-testid={`citation-${idx}`}
                              >
                                <p className="font-medium">
                                  [{idx + 1}] {citation.paperTitle}
                                </p>
                                <p className="text-muted-foreground italic">
                                  "{citation.excerpt}"
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <form onSubmit={handleSubmit} className="flex gap-2 mt-auto">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about your research papers..."
              disabled={askMutation.isPending}
              data-testid="input-question"
            />
            <Button
              type="submit"
              disabled={askMutation.isPending || !question.trim()}
              data-testid="button-ask"
            >
              {askMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
