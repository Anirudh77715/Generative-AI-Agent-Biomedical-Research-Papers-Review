# BioMed AI Research Agent

## Overview
An AI-powered biomedical research paper analysis platform that extracts PICO elements, identifies biomedical entities, enables semantic search, and provides intelligent Q&A with verified citations.

## Recent Changes (November 18, 2025)
- Built complete full-stack application from scratch
- Implemented all MVP features: paper upload, PICO extraction, entity recognition, semantic search, and Q&A assistant
- Integrated OpenAI GPT-5 for advanced text analysis
- Created professional UI with dark mode support
- Used Inter font for primary text and JetBrains Mono for code/citations

## Project Architecture

### Frontend
- **Framework**: React with TypeScript
- **Routing**: Wouter
- **Data Fetching**: TanStack Query v5
- **UI Components**: Shadcn UI with Tailwind CSS
- **Theme**: Light/Dark mode with localStorage persistence

### Backend
- **Server**: Express.js with TypeScript
- **AI Integration**: OpenAI GPT-5 and text-embedding-3-small
- **Storage**: In-memory (MemStorage) for rapid development
- **Processing**: Text chunking, embedding generation, cosine similarity search

### Key Features

1. **Dashboard**
   - Overview statistics (papers, PICO analyses, entities, Q&A sessions)
   - Recent papers list
   - Quick navigation to all features

2. **Paper Upload**
   - Drag-and-drop file support
   - Manual text input
   - Automatic embedding generation for semantic search
   - Real-time processing feedback

3. **Paper Library**
   - Browse all uploaded papers
   - View paper details (title, authors, abstract)
   - Extract PICO elements on demand
   - Extract biomedical entities on demand
   - Tabbed interface for different analysis views

4. **PICO Extraction**
   - Population: Patient groups or subjects
   - Intervention: Treatments or exposures
   - Comparison: Alternative treatments or controls
   - Outcome: Measured results or endpoints
   - Confidence scores for each element
   - Color-coded visual display

5. **Entity Recognition**
   - Diseases/Conditions
   - Drugs/Medications
   - Proteins
   - Genes
   - Grouped display with frequency counts

6. **Semantic Search**
   - AI-powered search across all papers
   - Vector embeddings with cosine similarity
   - Relevance scoring
   - Context-aware passage extraction
   - Highlights matching excerpts

7. **Q&A Assistant**
   - Chat-style interface
   - Context-aware answers using relevant paper passages
   - Automatic citation generation
   - Citation links to source papers
   - Conversation history

## API Endpoints

### Papers
- `GET /api/papers` - List all papers
- `GET /api/papers/:id` - Get single paper
- `POST /api/papers` - Upload new paper (auto-generates embeddings)
- `DELETE /api/papers/:id` - Delete paper

### Analysis
- `POST /api/papers/:id/extract-pico` - Extract PICO elements
- `POST /api/papers/:id/extract-entities` - Extract biomedical entities
- `GET /api/pico-elements` - Get all PICO analyses
- `GET /api/entities` - Get all extracted entities

### Search & Q&A
- `GET /api/search?query=...` - Semantic search across papers
- `POST /api/qa` - Ask questions (body: `{ question: "..." }`)
- `GET /api/conversations` - Get Q&A history

## Data Models

### Paper
- id, title, authors, abstract, fullText
- uploadedAt, status

### PicoElement
- paperId, population, intervention, comparison, outcome
- Confidence scores for each element
- extractedAt timestamp

### Entity
- paperId, type (disease/drug/protein/gene), text
- frequency, context

### TextChunk
- paperId, chunkText, chunkIndex
- embedding (vector for semantic search)

### Conversation
- question, answer, citations
- createdAt timestamp

## Technology Stack

### Dependencies
- **Frontend**: React, Wouter, TanStack Query, Shadcn UI, Tailwind CSS, Lucide Icons
- **Backend**: Express, OpenAI SDK, Drizzle ORM, Zod
- **Development**: TypeScript, Vite, TSX

### OpenAI Integration
- **Model**: GPT-5 (released August 7, 2025)
- **Embeddings**: text-embedding-3-small
- **Features**: JSON mode responses, structured extraction, citation tracking

## Development Notes

### Text Processing
- Papers are chunked into ~500 character segments
- Each chunk gets its own embedding for granular search
- Semantic search uses cosine similarity
- Top 5 most relevant chunks used for Q&A context

### AI Analysis
- PICO extraction analyzes abstract + first 2000 chars of full text
- Entity extraction processes abstract + full text
- Q&A retrieves top 5 relevant chunks (>0.6 similarity)
- Search returns top 10 results (>0.7 similarity)

### Performance Considerations
- Embeddings generated once during upload
- In-memory storage for fast access
- Chunking enables efficient search across long documents
- Batch processing for multiple entities

## Future Enhancements (Next Phase)
- SciSpacy integration for advanced biomedical NER
- Batch processing pipeline for 1000+ papers
- Advanced relation extraction between entities
- n8n workflow automation
- PubMed database integration
- Comparative analysis and meta-analysis features
- PostgreSQL persistence with Drizzle migrations

## Running the Project
```bash
npm run dev
```
Server runs on port 5000 with hot-reloading for both frontend and backend.
