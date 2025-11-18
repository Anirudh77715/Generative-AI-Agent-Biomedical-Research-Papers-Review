export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Use dynamic import for pdf-parse to handle CJS/ESM compatibility
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to extract text from PDF");
  }
}
