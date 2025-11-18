# Generative AI Agent for Biomedical Research Papers Review 🔬

An advanced AI-powered platform for analyzing biomedical research papers with automated PICO extraction, entity recognition, semantic search, and intelligent Q&A with verified citations.

This repository hosts the full-stack implementation published at [`Generative-AI-Agent-Biomedical-Research-Papers-Review`](https://github.com/Anirudh77715/Generative-AI-Agent-Biomedical-Research-Papers-Review).

![Platform Status](https://img.shields.io/badge/status-active-success.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [How It Works](#how-it-works)
- [Usage Guide](#usage-guide)
- [Development](#development)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)

## ✨ Features

### Core Capabilities

#### 1. **Paper Upload & Management**
- 📄 **PDF Support**: Upload biomedical research papers in PDF format
- 📝 **Text Support**: Also accepts plain text files
- 🚀 **Automatic Processing**: Papers are automatically chunked and embedded for semantic search
- 📚 **Library Management**: Organize and browse all uploaded papers

#### 2. **PICO Element Extraction**
Automatically extracts the four key components of clinical research:
- **P**opulation: Patient groups or subjects being studied
- **I**ntervention: Treatments or exposures being investigated
- **C**omparison: Alternative treatments or control groups
- **O**utcome: Measured results or endpoints

Each element includes confidence scores (0.0-1.0) and is displayed with color-coded visual sections.

#### 3. **Biomedical Entity Recognition**
Identifies and extracts key biomedical entities:
- 🦠 **Diseases/Conditions**: Medical conditions and diagnoses
- 💊 **Drugs/Medications**: Pharmaceutical compounds and treatments
- 🧬 **Proteins**: Protein names and identifiers
- 🔬 **Genes**: Genetic markers and gene names

Entities are grouped by type with frequency counts for easy analysis.

#### 4. **Semantic Search**
- 🔍 **AI-Powered Search**: Natural language queries across all papers
- 📊 **Relevance Scoring**: Cosine similarity matching with relevance percentages
- 📌 **Contextual Excerpts**: Shows matching passages with highlighting
- ⚡ **Fast Results**: Optimized vector search with embedding indices

#### 5. **Intelligent Q&A System**
- 💬 **Conversational Interface**: Chat-style Q&A about your research papers
- 🎯 **Context-Aware Answers**: AI analyzes relevant passages before answering
- 📚 **Automatic Citations**: All answers include citations with source papers
- 🔗 **Citation Tracking**: Click citations to view full excerpts and paper details
- 💾 **Conversation History**: All Q&A sessions are saved for reference

#### 6. **Analytics Dashboard**
- 📈 **Real-time Statistics**: Track papers, analyses, entities, and Q&A sessions
- 📋 **Recent Activity**: View recently uploaded papers
- 🎨 **Visual Overview**: Clean interface showing your research corpus at a glance

#### 7. **Professional UI/UX**
- 🌓 **Dark Mode**: Full dark/light theme support with toggle
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- ♿ **Accessibility**: WCAG AA compliant with keyboard navigation
- 🎨 **Modern Design**: Clean, professional interface optimized for research workflows

## 🛠 Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Wouter** - Lightweight routing
- **TanStack Query v5** - Server state management
- **Tailwind CSS** - Utility-first styling
- **Shadcn UI** - High-quality component library
- **Lucide Icons** - Beautiful icon set
- **Vite** - Lightning-fast build tool

### Backend
- **Node.js 20** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server code
- **Multer** - File upload handling
- **pdf-parse** - PDF text extraction

### AI & ML
- **OpenAI GPT-5** - Advanced language model (released August 2025)
- **text-embedding-3-small** - Text embedding for semantic search
- **Vector Embeddings** - 1536-dimensional vectors for similarity matching
- **Cosine Similarity** - Mathematical measure for relevance scoring

### Data Management
- **Drizzle ORM** - Type-safe database toolkit
- **Zod** - Schema validation
- **In-Memory Storage** - Fast development with MemStorage

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone or fork this Repl**

2. **Set up environment variables**
   
   Add your OpenAI API key to Replit Secrets:
   - Open the "Secrets" tab (🔒 icon in left sidebar)
   - Add secret: `OPENAI_API_KEY` = `your-api-key-here`

3. **Start the application**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - The app runs on port 5000
   - Click the web preview or open your Repl URL

## 📁 Project Structure

```
biomedical-research-ai-agent/
├── client/                    # Frontend React application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   │   ├── ui/          # Shadcn UI components
│   │   │   ├── app-sidebar.tsx
│   │   │   ├── theme-provider.tsx
│   │   │   └── theme-toggle.tsx
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities and helpers
│   │   ├── pages/           # Page components
│   │   │   ├── dashboard.tsx
│   │   │   ├── upload.tsx
│   │   │   ├── library.tsx
│   │   │   ├── search.tsx
│   │   │   ├── qa.tsx
│   │   │   └── not-found.tsx
│   │   ├── App.tsx          # Main app component
│   │   ├── index.css        # Global styles
│   │   └── main.tsx         # Entry point
│   └── index.html           # HTML template
├── server/                   # Backend Express application
│   ├── index.ts             # Server entry point
│   ├── routes.ts            # API route handlers
│   ├── storage.ts           # Data storage layer
│   ├── openai.ts            # OpenAI integration
│   ├── pdf-parser.ts        # PDF text extraction
│   └── vite.ts              # Vite dev server integration
├── shared/                   # Shared code between frontend/backend
│   └── schema.ts            # TypeScript types & Zod schemas
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── vite.config.ts           # Vite build configuration
├── replit.md                # Project documentation
└── README.md                # This file
```

## 📡 API Documentation

### Papers

#### Upload Paper (Manual Entry)
```http
POST /api/papers
Content-Type: application/json

{
  "title": "Paper title",
  "authors": "Author names",
  "abstract": "Abstract text",
  "fullText": "Full paper text"
}
```

#### Upload PDF
```http
POST /api/papers/upload-pdf
Content-Type: multipart/form-data

Fields:
- pdf: PDF file
- title: Paper title
- authors: Author names  
- abstract: Abstract text
```

#### List All Papers
```http
GET /api/papers
```

#### Get Single Paper
```http
GET /api/papers/:id
```

#### Delete Paper
```http
DELETE /api/papers/:id
```

### Analysis

#### Extract PICO Elements
```http
POST /api/papers/:id/extract-pico
```

Returns PICO analysis with confidence scores.

#### Extract Biomedical Entities
```http
POST /api/papers/:id/extract-entities
```

Returns diseases, drugs, proteins, and genes.

#### Get All PICO Analyses
```http
GET /api/pico-elements
```

#### Get All Entities
```http
GET /api/entities
```

### Search & Q&A

#### Semantic Search
```http
GET /api/search?query=your+search+query
```

Returns relevant paper excerpts ranked by similarity.

#### Ask Question
```http
POST /api/qa
Content-Type: application/json

{
  "question": "What are the effects of metformin?"
}
```

Returns answer with citations.

#### Get Conversation History
```http
GET /api/conversations
```

## 🔍 How It Works

### 1. **Paper Upload Pipeline**

```
PDF/Text Upload
    ↓
Extract Text (pdf-parse)
    ↓
Save Paper Metadata
    ↓
Chunk Text (~500 chars/chunk)
    ↓
Generate Embeddings (OpenAI)
    ↓
Store Chunks + Vectors
```

### 2. **PICO Extraction**

```
Paper Abstract + First 2000 chars
    ↓
Send to GPT-5 with specialized prompt
    ↓
Extract Population, Intervention, Comparison, Outcome
    ↓
Calculate confidence scores (0.0-1.0)
    ↓
Store structured PICO data
```

### 3. **Entity Recognition**

```
Paper Abstract + Full Text
    ↓
Send to GPT-5 for NER
    ↓
Extract entities by type:
  - Diseases
  - Drugs
  - Proteins
  - Genes
    ↓
Store with frequency counts
```

### 4. **Semantic Search**

```
User Query
    ↓
Generate Query Embedding
    ↓
Calculate Cosine Similarity with all chunks
    ↓
Filter by threshold (>0.7)
    ↓
Rank by relevance
    ↓
Return top 10 results with excerpts
```

### 5. **Q&A System**

```
User Question
    ↓
Generate Question Embedding
    ↓
Find top 5 relevant chunks (>0.6 similarity)
    ↓
Build context from relevant passages
    ↓
Send to GPT-5 with citation instructions
    ↓
Generate answer with [1], [2] style citations
    ↓
Map citations to source papers
    ↓
Return answer + citation metadata
```

## 📖 Usage Guide

### Uploading Your First Paper

1. **Navigate to "Upload Papers"** in the sidebar
2. **Fill in paper details**:
   - Title (required)
   - Authors (required)
   - Abstract (required)
3. **Add the full text**:
   - **Option A**: Drag & drop a PDF file
   - **Option B**: Drag & drop a .txt file
   - **Option C**: Paste text directly
4. **Click "Upload Paper"**

The system will automatically:
- Extract text from PDFs
- Generate embeddings for semantic search
- Make the paper available for analysis

### Extracting PICO Elements

1. **Go to "Paper Library"**
2. **Click on a paper** to select it
3. **Click "Extract PICO"** button
4. **Wait for analysis** (typically 5-10 seconds)
5. **View results** in the PICO tab

### Extracting Entities

1. **Select a paper** in the library
2. **Click "Extract Entities"**
3. **View results** in the Entities tab
4. Entities are **grouped by type** and show **frequency counts**

### Searching Papers

1. **Navigate to "Search"**
2. **Enter your research question** in natural language
   - Example: "What are the side effects of metformin?"
3. **Click "Search"**
4. **Review results** ranked by relevance
5. **Click on results** to see full context

### Asking Questions

1. **Go to "Q&A Assistant"**
2. **Type your question** about your research papers
   - Example: "Summarize the findings about diabetes treatments"
3. **Click send** or press Enter
4. **Review the answer** with citations
5. **Click citations** to see source excerpts

## 🔧 Development

### Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Adding New Features

1. **Define data model** in `shared/schema.ts`
2. **Update storage interface** in `server/storage.ts`
3. **Create API routes** in `server/routes.ts`
4. **Build React components** in `client/src/pages/`
5. **Add to navigation** in `client/src/components/app-sidebar.tsx`

### Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Automatic via Vite
- **Components**: Functional components with hooks
- **State**: TanStack Query for server state
- **Styling**: Tailwind utility classes

### Testing

The application includes comprehensive data validation:
- **Zod schemas** for all API inputs
- **TypeScript** for compile-time type safety
- **Error boundaries** for runtime errors
- **Toast notifications** for user feedback

## 🚀 Deployment

### Publishing on Replit

1. Click the **"Publish"** button in the top right
2. Configure your deployment settings
3. Your app will be live at `your-repl-name.replit.app`

### Custom Domain

1. Go to **deployment settings**
2. Add your **custom domain**
3. Configure **DNS records** as instructed

### Environment Variables

Ensure these secrets are set:
- `OPENAI_API_KEY` - Your OpenAI API key
- `SESSION_SECRET` - Random secret for sessions (auto-generated)

## 🔮 Future Enhancements

### Planned Features

1. **SciSpacy Integration**
   - Advanced biomedical NER with medical vocabularies
   - Relationship extraction between entities
   - Medical ontology linking

2. **Batch Processing Pipeline**
   - Upload multiple papers at once
   - Process 1000+ papers in parallel
   - Background job queue

3. **Database Persistence**
   - PostgreSQL with Drizzle migrations
   - Data persistence across restarts
   - Better scalability

4. **PubMed Integration**
   - Import papers directly from PubMed
   - Automatic metadata fetching
   - Citation network analysis

5. **Advanced Analytics**
   - Comparative analysis across papers
   - Meta-analysis capabilities
   - Trend detection and visualization

6. **n8n Workflow Automation**
   - Automated paper processing pipelines
   - Integration with external APIs
   - Scheduled analysis jobs

### n8n workflow snapshot (super simple)
To keep BioPaperGenie automation beginner-friendly, the project ships with a tiny n8n scene:
1. **HTTP Trigger** – waits for a basic POST payload containing a paper URL/title.
2. **HTTP Request node** – forwards that payload directly to the server’s `/api/papers` endpoint (acting like a headless upload form).
3. **Email node** – sends a “paper ingested” confirmation so you know the job finished.

It’s intentionally small, but perfect to explain in an interview how n8n can orchestrate BioPaperGenie without touching backend code.

7. **Collaboration Features**
   - Share papers and analyses
   - Team workspaces
   - Comments and annotations

8. **Export & Reports**
   - PDF reports of analyses
   - Export to CSV/JSON
   - Integration with reference managers

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Report bugs** - Open an issue describing the problem
2. **Suggest features** - Share your ideas for improvements
3. **Submit PRs** - Fork, make changes, and submit pull requests
4. **Improve docs** - Help make documentation clearer

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **OpenAI** for GPT-5 and embeddings API
- **Shadcn** for the beautiful UI component library
- **Replit** for the development platform
- **pdf-parse** for PDF text extraction
- **Biomedical research community** for inspiration

## 📧 Support

Need help? Have questions?
- 📝 Check existing documentation
- 🐛 Report bugs via issues
- 💬 Ask questions in discussions
- 📧 Contact support

---

**Built with ❤️ for biomedical researchers**

*Last updated: November 2025*
