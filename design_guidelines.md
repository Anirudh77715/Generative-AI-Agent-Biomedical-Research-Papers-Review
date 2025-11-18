# Design Guidelines: Biomedical Research AI Agent Platform

## Design Approach

**Selected Framework:** Design System Approach - Carbon Design System + Linear-inspired aesthetics

**Rationale:** This is a data-intensive, professional research tool requiring clarity, information hierarchy, and efficient workflows. The design prioritizes functionality, readability, and cognitive efficiency for researchers analyzing complex biomedical data.

**Key Principles:**
- Information clarity over decoration
- Scannable data presentation
- Hierarchical content organization
- Professional, scientific credibility

## Typography

**Primary Font:** Inter (Google Fonts)
- Headings: 600 weight, 24-32px for section headers
- Body text: 400 weight, 14-16px for readable content
- Data labels: 500 weight, 12-14px for metadata
- Code/Citations: 'JetBrains Mono' at 13px for precise technical data

**Hierarchy:**
- Page titles: text-2xl font-semibold
- Section headers: text-xl font-semibold
- Card titles: text-lg font-medium
- Body content: text-base
- Metadata/labels: text-sm text-gray-600

## Layout System

**Spacing Units:** Use Tailwind spacing of 2, 4, 6, 8, 12, 16, 20 for consistent rhythm

**Container Strategy:**
- Main dashboard: max-w-7xl with px-6 py-8
- Content cards: p-6 spacing
- Dense data sections: p-4 spacing
- List items: py-3 px-4

**Grid Layouts:**
- Paper library: 2-column grid (md:grid-cols-2) with gap-6
- PICO elements: 4-column grid for element categories
- Search results: Single column with clear separation

## Core Component Library

### Navigation
**Top Navigation Bar:**
- Fixed header with shadow-sm, h-16
- Logo left, primary actions right (Upload Papers, Search)
- Tab-style secondary navigation for Dashboard/Library/Search/Q&A views

### Dashboard Layout
**Three-Panel Design:**
- Left sidebar (w-64): Paper library navigation, filters, collections
- Main content area (flex-1): Active paper analysis, results display
- Right sidebar (w-80, collapsible): AI insights, entity extraction, related papers

### Upload Interface
**Drag-and-Drop Zone:**
- Large, prominent dropzone with dashed border
- Upload icon (Heroicons: ArrowUpTrayIcon) centered
- Progress bars for batch uploads with file names
- Accepted formats badge: "PDF, DOC, TXT"

### Paper Display Cards
**Structure:**
- Paper title (text-lg font-semibold)
- Authors and publication metadata (text-sm, truncated)
- Abstract preview (3 lines, text-gray-700)
- Status badges (Processed/Processing/Failed)
- Action buttons: View, Extract PICO, Delete

### PICO Extraction Display
**Four-Section Layout:**
- Color-coded sections (use borders, not backgrounds)
- **P**opulation: border-l-4 with icon
- **I**ntervention: border-l-4 with icon
- **C**omparison: border-l-4 with icon
- **O**utcome: border-l-4 with icon
- Each section: extracted text, confidence score, source paragraph citation

### Entity Visualization
**Tag-Based Display:**
- Grouped by type: Diseases, Drugs, Proteins, Genes
- Pill-shaped tags with rounded-full, px-3 py-1
- Click to highlight in source text
- Count badges showing frequency

### Search Interface
**Semantic Search Bar:**
- Large, prominent search input (h-12)
- Search icon left, filter icon right
- Real-time suggestions dropdown
- Advanced filters panel (collapsible)

**Results Display:**
- Ranked list with relevance scores
- Highlighted matching passages in context
- Citation links to source papers
- "View in context" action per result

### Q&A Interface
**Conversational Layout:**
- Chat-style question/answer flow
- User questions: right-aligned, distinct styling
- AI responses: left-aligned, with citation footnotes
- Citation links as superscript numbers [1], [2]
- References list at bottom with full paper details

### Citation System
**Inline Citations:**
- Superscript numbers in square brackets
- Hover tooltip showing paper title + authors
- Click to view full reference or jump to source

**References Section:**
- Numbered list format
- Full bibliographic information
- "View Paper" link for each citation

### Data Tables
**Paper Comparison Table:**
- Sticky header row
- Alternating row styling with hover state
- Sortable columns (Title, Date, Status, Entities)
- Compact row height (h-12) for density
- Action column with icon buttons

### Status Indicators
**Processing States:**
- Loading spinners for active processing
- Success checkmarks for completed
- Warning icons for errors
- Progress percentages for batch operations

## Icons

**Library:** Heroicons (CDN)

**Key Icons:**
- Upload: ArrowUpTrayIcon
- Search: MagnifyingGlassIcon
- Papers: DocumentTextIcon
- Extract: BeakerIcon
- Citations: BookmarkIcon
- Entities: TagIcon
- Q&A: ChatBubbleLeftRightIcon
- Settings: Cog6ToothIcon

## Interaction Patterns

**Minimal Animations:**
- Smooth transitions for panel expansions (transition-all duration-200)
- Fade-in for loading content
- NO scroll-triggered effects
- Subtle hover elevations on cards (hover:shadow-md)

## Images

**No Hero Image:** This is a professional tool, not a marketing site

**Functional Images:**
- Empty state illustrations for "No papers uploaded yet"
- Icon graphics for PICO element types
- Small avatars/logos for source publications if available

## Accessibility

- All interactive elements have clear focus states (ring-2 ring-offset-2)
- Semantic HTML for screen readers
- ARIA labels for icon-only buttons
- Keyboard navigation through all workflows
- Sufficient contrast ratios (WCAG AA minimum)
- Form inputs with associated labels

## Key Layout Screens

1. **Dashboard:** 3-column layout with paper library, main workspace, AI insights
2. **Upload Flow:** Centered modal or dedicated page with dropzone
3. **Paper Detail:** Full-width view with tabs (Summary/PICO/Entities/Full Text)
4. **Search Results:** List view with filters sidebar
5. **Q&A Interface:** Chat-style centered column (max-w-4xl)

This design creates a professional, efficient research platform optimized for information density and workflow efficiency.