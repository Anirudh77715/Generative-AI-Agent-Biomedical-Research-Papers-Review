import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search as SearchIcon, FileText } from "lucide-react";
import type { Paper } from "@shared/schema";

interface SearchResult {
  paperId: string;
  paperTitle: string;
  authors: string;
  excerpt: string;
  relevanceScore: number;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: papers } = useQuery<Paper[]>({
    queryKey: ["/api/papers"],
  });

  const { data: results, isLoading } = useQuery<SearchResult[]>({
    queryKey: ["/api/search", searchTerm],
    queryFn: async () => {
      const res = await fetch(`/api/search?query=${encodeURIComponent(searchTerm)}`);
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    },
    enabled: !!searchTerm,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchTerm(query.trim());
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-search-title">
          Semantic Search
        </h1>
        <p className="text-sm text-muted-foreground">
          Search across your research papers using AI-powered semantic understanding
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Query</CardTitle>
          <CardDescription>
            Enter your research question or topic to find relevant passages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., What are the effects of metformin on diabetes?"
              className="flex-1"
              data-testid="input-search-query"
            />
            <Button type="submit" data-testid="button-search">
              <SearchIcon className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {!searchTerm ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <SearchIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground" data-testid="text-no-search">
              Enter a search query to find relevant passages
            </p>
            {papers && papers.length > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                Searching across {papers.length} papers
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Search Results</h2>
            {!isLoading && results && (
              <span className="text-sm text-muted-foreground" data-testid="text-result-count">
                {results.length} results found
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="pt-6 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : results && results.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <SearchIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground" data-testid="text-no-results">
                  No results found for your query
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Try different keywords or upload more papers
                </p>
              </CardContent>
            </Card>
          ) : (
            results?.map((result, index) => (
              <Card key={`${result.paperId}-${index}`} data-testid={`result-${index}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-base line-clamp-2">
                        {result.paperTitle}
                      </CardTitle>
                      <CardDescription className="mt-1">{result.authors}</CardDescription>
                    </div>
                    <Badge variant="secondary">
                      {Math.round(result.relevanceScore * 100)}% match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md bg-muted p-4">
                    <p className="text-sm leading-relaxed">{result.excerpt}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
