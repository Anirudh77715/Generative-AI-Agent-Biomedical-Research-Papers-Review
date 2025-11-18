import { useState, useCallback } from "react";
import { Upload as UploadIcon, FileText, X, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [abstract, setAbstract] = useState("");
  const [fullText, setFullText] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (data: { title: string; authors: string; abstract: string; fullText: string }) => {
      return await apiRequest("POST", "/api/papers", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/papers"] });
      toast({
        title: "Paper uploaded successfully",
        description: "Your paper is now being processed for analysis.",
      });
      setTitle("");
      setAuthors("");
      setAbstract("");
      setFullText("");
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your paper. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      if (file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          setFullText(content);
        };
        reader.readAsText(file);
        toast({
          title: "File loaded",
          description: `${file.name} has been loaded successfully.`,
        });
      } else if (file.type === "application/pdf") {
        if (!title || !authors || !abstract) {
          toast({
            title: "Missing information",
            description: "Please fill in title, authors, and abstract before uploading a PDF.",
            variant: "destructive",
          });
          return;
        }

        const formData = new FormData();
        formData.append("pdf", file);
        formData.append("title", title);
        formData.append("authors", authors);
        formData.append("abstract", abstract);

        try {
          const response = await fetch("/api/papers/upload-pdf", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) throw new Error("Upload failed");
          
          await response.json();
          queryClient.invalidateQueries({ queryKey: ["/api/papers"] });
          
          toast({
            title: "PDF uploaded successfully",
            description: "Your paper has been processed and is ready for analysis.",
          });
          
          setTitle("");
          setAuthors("");
          setAbstract("");
        } catch (error) {
          toast({
            title: "Upload failed",
            description: "There was an error processing your PDF. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF (.pdf) or text file (.txt)",
          variant: "destructive",
        });
      }
    }
  }, [toast, title, authors, abstract, queryClient]);

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          setFullText(content);
        };
        reader.readAsText(file);
        toast({
          title: "File loaded",
          description: `${file.name} has been loaded successfully.`,
        });
      } else if (file.type === "application/pdf") {
        const formData = new FormData();
        formData.append("pdf", file);
        formData.append("title", title || "Untitled");
        formData.append("authors", authors || "Unknown");
        formData.append("abstract", abstract || "No abstract provided");

        try {
          const response = await fetch("/api/papers/upload-pdf", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) throw new Error("Upload failed");
          
          const paper = await response.json();
          queryClient.invalidateQueries({ queryKey: ["/api/papers"] });
          
          toast({
            title: "PDF uploaded successfully",
            description: "Your paper has been processed and is ready for analysis.",
          });
          
          setTitle("");
          setAuthors("");
          setAbstract("");
          setFullText("");
        } catch (error) {
          toast({
            title: "Upload failed",
            description: "There was an error processing your PDF. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF (.pdf) or text file (.txt)",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !authors || !abstract || !fullText) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    uploadMutation.mutate({ title, authors, abstract, fullText });
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-upload-title">
          Upload Research Paper
        </h1>
        <p className="text-sm text-muted-foreground">
          Upload biomedical research papers for AI-powered analysis
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Paper Information</CardTitle>
          <CardDescription>Enter the details of your research paper</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter paper title"
                required
                data-testid="input-paper-title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="authors">Authors *</Label>
              <Input
                id="authors"
                value={authors}
                onChange={(e) => setAuthors(e.target.value)}
                placeholder="e.g., Smith J, Doe A, Johnson B"
                required
                data-testid="input-paper-authors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="abstract">Abstract *</Label>
              <Textarea
                id="abstract"
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                placeholder="Enter paper abstract"
                className="min-h-24"
                required
                data-testid="input-paper-abstract"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fulltext">Full Text *</Label>
              <div
                className={`relative border-2 border-dashed rounded-md p-6 transition-colors ${
                  dragActive ? "border-primary bg-primary/5" : "border-border"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {!fullText ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-4">
                    <UploadIcon className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop a PDF or text file here, or click to select
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supported formats: PDF, TXT
                    </p>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".txt,.pdf,application/pdf"
                      onChange={handleFileInput}
                      className="hidden"
                      data-testid="input-file-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("file-upload")?.click()}
                      data-testid="button-select-file"
                    >
                      Select File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Text loaded</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setFullText("")}
                        data-testid="button-clear-file"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      id="fulltext"
                      value={fullText}
                      onChange={(e) => setFullText(e.target.value)}
                      placeholder="Or paste full text here"
                      className="min-h-48 font-mono text-xs"
                      data-testid="input-paper-fulltext"
                    />
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={uploadMutation.isPending}
              data-testid="button-upload-paper"
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadIcon className="mr-2 h-4 w-4" />
                  Upload Paper
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
