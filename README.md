# DevTrack — Developer Productivity Dashboard

![DevTrack Architecture](https://img.shields.io/badge/TypeScript-Strict_v6-blue?logo=typescript)
![React](https://img.shields.io/badge/React-v19-61dafb?logo=react)
![Vite](https://img.shields.io/badge/Vite-v8-646cff?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3.4-38bdf8?logo=tailwindcss)
![Tests](https://img.shields.io/badge/Vitest-37_Passing-emerald?logo=vitest)
![License](https://img.shields.io/badge/License-MIT-purple)

**DevTrack** is a high-performance, developer-first productivity dashboard and workflow telemetry platform built with **TypeScript**, **React 19**, **Vite**, **Tailwind CSS**, and **Recharts**. It is engineered to give software engineers, technical leads, and engineering managers real-time visibility into project roadmaps, daily task execution, deliverable health, and sprint velocity.

DevTrack was architected from the ground up to showcase professional enterprise TypeScript standards, clean domain-driven architecture, resilient local-first persistence, runtime schema validation via Zod, and full automated test coverage.

---

## 📑 Table of Contents

1. [Key Features](#-key-features)
2. [Technology Stack](#-technology-stack)
3. [Architecture & Folder Structure](#-architecture--folder-structure)
4. [TypeScript Design Decisions](#-typescript-design-decisions)
5. [Data Management & Storage Layer](#-data-management--storage-layer)
6. [Prerequisites & System Requirements](#-prerequisites--system-requirements)
7. [Installation & Getting Started](#-installation--getting-started)
8. [Available Scripts](#-available-scripts)
9. [Testing & Quality Assurance](#-testing--quality-assurance)
10. [Build & Deployment Guide](#-build--deployment-guide)
11. [Known Limitations & Future Roadmap](#-known-limitations--future-roadmap)

---

## 🚀 Key Features

### 1. Interactive Dashboard Overview
- **Real-Time Telemetry Cards**: Instant calculations of Total Projects, Active Projects, Total Tasks, Completed Tasks, Pending Pipeline Items, and Overdue Tasks.
- **Delivery Velocity Rate**: Automatic computation of sprint completion percentages based on live task state.
- **Weekly Throughput Chart**: Recharts area visualization tracking created vs. completed task velocity across a rolling 7-day window.
- **Workflow Status Distribution**: Donut chart detailing task volume across To Do, In Progress, In Review, and Done.
- **Recent Projects Pipeline**: At-a-glance project milestone cards displaying completion progress bars and deadlines.
- **Imminent Deadlines Feed**: Chronological list of tasks requiring urgent focus with dynamic badge alerts ("Due today", "Due tomorrow", "Overdue").
- **Zero-State Resilience**: Useful empty state for new workspaces with a single-click demo seed button.

### 2. Comprehensive Project Management
- **Full CRUD Support**: Create, update, inspect, and delete engineering projects.
- **Metadata Attributes**: Name, description, priority (`low`, `medium`, `high`, `urgent`), status (`planning`, `active`, `on_hold`, `completed`, `cancelled`), timeline dates, color coding, and tags.
- **Dynamic Progress Calculation**: Project completion percentage dynamically computes from all child tasks without stored counter drift.
- **Multi-Criteria Search & Filtering**: Filter by keyword, status, priority, or sort by creation date, deadline, priority level, or completion percentage.
- **Cascade Deletion Safeguards**: Deleting a project automatically cleans up child tasks and triggers a two-step confirmation dialog to eliminate orphaned data records.

### 3. Granular Task Management
- **Full Lifecycle Tracking**: Create, edit, inspect, and delete tasks associated with projects.
- **Execution States**: Support for `todo`, `in_progress`, `in_review`, and `done`.
- **Automatic Completion Tracking**: Marking a task as `done` records a precise ISO timestamp (`completedAt`). Moving it back to an active state safely resets the timestamp.
- **Overdue Detection**: System compares midnight due dates against current calendar day to flag delinquent items across all views.
- **Dual Display Modes**: Toggle seamlessly between responsive Card Grid view and compact tabular Workflow Table view.

### 4. Interactive Kanban Board
- **4 Stage Columns**: Dedicated columns for To Do, In Progress, In Review, and Done.
- **Drag-and-Drop Workflow**: Native HTML5 Drag and Drop with drop-zone target indicators and immediate state synchronization.
- **Accessible Movement**: Keyboard- and mobile-friendly quick movement buttons on each card allowing one-click advancement or backward transitions.
- **Scoped Filtering**: Filter the Kanban board to inspect a single project or observe all team tasks across the organization.

### 5. Velocity & Productivity Analytics
- **Historical Velocity Curves**: Rolling area visualization of developer output.
- **Priority Density Breakdown**: Bar charts quantifying deliverable criticality distribution.
- **Cross-Project Delivery Comparison**: Multi-project progress comparison with project theme accents.
- **Sprint Health Score**: Algorithmic scoring of sprint health factoring in overdue ratios and high-priority workloads.

### 6. Workspace Settings & Resilience
- **Persistent Theme Switching**: Dark, Light, and System themes with zero flash-of-unstyled-content (`<script>` in `<head>` and `document.documentElement` class management).
- **Developer Profile Customization**: Configure name, job title, contact email, and weekly target hours.
- **JSON Workspace Export**: Generate portable, timestamped JSON backups (`devtrack-backup-[date].json`).
- **Zod-Validated JSON Import**: Runtime schema validation of imported files with structured error reporting for malformed payloads.
- **State Reset Options**: Safe reset options with two-step confirmation to either restore default developer demo data or wipe to a clean slate.

### 7. Audit Logging & Notification Feedback
- **Toast Notifications**: Non-intrusive animated feedback for create, update, delete, status toggle, import, and reset operations.
- **Audit Feed Drawer**: Slide-out event log capturing recent changes with relative timestamps ("2 mins ago").

---

## 🛠 Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Language** | **TypeScript 6.x** | Static type safety, discriminated unions, generic utilities, strict null checking |
| **UI Library** | **React 19** | Component-driven UI, modern hooks, portals, functional architecture |
| **Build & Dev Tool** | **Vite 8** | Instant Hot Module Replacement (HMR), ES module bundling, production optimization |
| **Styling** | **Tailwind CSS 3.4** | Utility-first CSS, dark mode class variant, custom design tokens |
| **Icons** | **Lucide React** | Consistent, modern developer tool icon set |
| **Routing** | **React Router 7** | Client-side SPA navigation, nested layouts, outlet rendering |
| **Data Visualization** | **Recharts 3.x** | Responsive SVG charts (AreaChart, BarChart, PieChart) |
| **Runtime Validation** | **Zod 4.x** | Schema boundary parsing, input verification, JSON backup validation |
| **Test Runner** | **Vitest 5.x** | Lightning-fast test runner with Vite module resolution |
| **Testing Utilities** | **React Testing Library** | User-centric DOM assertions, accessibility queries, event simulations |
| **DOM Environment** | **JSDOM 30.x** | Headless browser DOM simulation for automated test execution |
| **Code Quality** | **ESLint 10 & Prettier** | Flat configuration code linting and uniform formatting |

---

## 🏛 Architecture & Folder Structure

DevTrack adheres to a clean, decoupled architecture separating UI, domain logic, storage persistence, and validation boundaries:

```
devtrack/
├── public/
│   ├── favicon.svg              # DevTrack brand icon
│   └── _redirects               # Netlify SPA routing rewrite rule
├── src/
│   ├── components/
│   │   ├── analytics/           # Analytics charts and health metric displays
│   │   │   ├── PriorityBarChart.tsx
│   │   │   └── ProjectProgressChart.tsx
│   │   ├── dashboard/           # Dashboard overview cards and summary widgets
│   │   │   ├── MetricCard.tsx
│   │   │   ├── ProductivityChart.tsx
│   │   │   ├── QuickActions.tsx
│   │   │   ├── RecentProjectsList.tsx
│   │   │   ├── StatusDistributionChart.tsx
│   │   │   └── UpcomingDeadlinesList.tsx
│   │   ├── kanban/              # Kanban board, columns, and draggable cards
│   │   │   ├── KanbanBoard.tsx
│   │   │   ├── KanbanCard.tsx
│   │   │   └── KanbanColumn.tsx
│   │   ├── layout/              # Structural app layout, sidebar, topbar, drawers
│   │   │   ├── ActivityDrawer.tsx
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Topbar.tsx
│   │   ├── projects/            # Project cards, filters, and modals
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectDetailModal.tsx
│   │   │   ├── ProjectFilterBar.tsx
│   │   │   └── ProjectFormModal.tsx
│   │   ├── tasks/               # Task cards, tables, filters, and modals
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskFilterBar.tsx
│   │   │   ├── TaskFormModal.tsx
│   │   │   └── TaskTable.tsx
│   │   └── ui/                  # Reusable, design-system UI primitives
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── ConfirmDialog.tsx
│   │       ├── EmptyState.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── ProgressBar.tsx
│   │       ├── SearchInput.tsx
│   │       ├── Select.tsx
│   │       └── Textarea.tsx
│   ├── context/                 # React Context state management
│   │   ├── DevTrackContext.tsx  # Central domain state & operations
│   │   ├── ThemeContext.tsx     # Theme mode and dark class manager
│   │   └── ToastContext.tsx     # Notification dispatcher and toast renderer
│   ├── hooks/                   # Custom React hooks
│   │   ├── useDevTrack.ts
│   │   ├── useTheme.ts
│   │   └── useToast.ts
│   ├── pages/                   # Top-level route pages
│   │   ├── AnalyticsPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── KanbanPage.tsx
│   │   ├── NotFoundPage.tsx
│   │   ├── ProjectsPage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── TasksPage.tsx
│   ├── schemas/                 # Zod validation schemas
│   │   ├── backupSchema.ts      # Backup import/export validation
│   │   ├── projectSchema.ts     # Project creation & update schemas
│   │   ├── settingsSchema.ts    # User settings schema
│   │   └── taskSchema.ts        # Task creation & update schemas
│   ├── services/                # Repository & persistence layer
│   │   ├── activityService.ts   # Audit logging repository
│   │   ├── demoData.ts          # Realistic software engineering seed dataset
│   │   ├── projectService.ts    # Project CRUD and cascade logic
│   │   ├── settingsService.ts   # Settings and import/export coordinator
│   │   ├── storageService.ts    # Safe LocalStorage wrapper with error handling
│   │   └── taskService.ts       # Task CRUD and status transition logic
│   ├── test/                    # Automated unit & integration tests
│   │   ├── calculations.test.ts # Metric and calculation test suite
│   │   ├── components.test.tsx  # React Testing Library component tests
│   │   ├── dateUtils.test.ts    # Date utility tests
│   │   ├── sanity.test.ts       # Test environment sanity check
│   │   ├── services.test.ts     # Service layer and storage tests
│   │   ├── setup.ts             # Vitest test setup (jsdom, mocks)
│   │   └── validationSchemas.test.ts # Zod schema validation tests
│   ├── types/                   # TypeScript interfaces and union types
│   │   ├── activity.ts
│   │   ├── dashboard.ts
│   │   ├── filter.ts
│   │   ├── index.ts
│   │   ├── project.ts
│   │   ├── settings.ts
│   │   └── task.ts
│   ├── utils/                   # Pure utility functions
│   │   ├── calculations.ts
│   │   ├── cn.ts
│   │   ├── dateUtils.ts
│   │   └── idGenerator.ts
│   ├── App.tsx                  # Main router setup
│   ├── index.css                # Tailwind directives & design tokens
│   └── main.tsx                 # React DOM entrypoint
├── .env.example                 # Environment configuration template
├── .gitignore                   # Git ignore patterns
├── .prettierrc                  # Prettier formatting configuration
├── eslint.config.js             # ESLint flat configuration
├── index.html                   # HTML entrypoint with font imports
├── package.json                 # Scripts and package manifests
├── tsconfig.app.json            # Strict TypeScript application compiler settings
├── tsconfig.json                # Project references configuration
├── vercel.json                  # Vercel SPA rewrite deployment configuration
└── vite.config.ts               # Vite & Vitest configuration
```

---

## 🎯 TypeScript Design Decisions

1. **Strict Compiler Settings**:
   - Compiles with `"strict": true`, `"noImplicitAny": true`, `"strictNullChecks": true`, `"strictFunctionTypes": true`, `"noUnusedLocals": true`, and `"noFallthroughCasesInSwitch": true`.
   - Zero instances of `any`. Type assertions (`as`) are avoided in favor of type narrowing and Zod schema inference.
2. **Union Types for Domain States**:
   - `TaskStatus`: `'todo' | 'in_progress' | 'in_review' | 'done'`
   - `TaskPriority`: `'low' | 'medium' | 'high' | 'urgent'`
   - `ProjectStatus`: `'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled'`
   - Using string unions prevents invalid enum values from polluting state while maintaining readability in JSON storage.
3. **Derived Metrics over Stored Redundancy**:
   - Project completion percentage and task counts are computed via pure functions (`calculateProjectProgress`, `calculateDashboardMetrics`). This ensures that statistics can never fall out of sync with actual database records.
4. **Boundary Validation via Zod**:
   - TypeScript types guarantee internal correctness, but external boundaries (user form input and imported JSON files) are validated at runtime via Zod schemas (`projectSchema`, `taskSchema`, `devTrackBackupSchema`).
5. **Decoupled Service Layer**:
   - Business operations (such as cascading task deletions and timestamp updates) live in typed service classes (`ProjectService`, `TaskService`), leaving React components focused strictly on presentation.

---

## 💾 Data Management & Storage Layer

DevTrack uses a reliable **Local-First Architecture** based on browser `localStorage`:

- **Namespace Isolation**: All storage keys are prefixed with `devtrack_` (e.g., `devtrack_projects`, `devtrack_tasks`, `devtrack_settings`) to prevent collisions with other browser applications.
- **Quota & Parse Resilience**: The centralized `SafeStorageService` catches quota errors (`QuotaExceededError`) and corrupt JSON payloads gracefully, falling back to sensible defaults.
- **Orphan Prevention Policy**: When a project is deleted, `taskService.deleteTasksByProjectId(id)` cascades and purges linked tasks, preventing dangling foreign key references.
- **Demo Seed Data**: On first launch, DevTrack detects an empty store and seeds 4 realistic engineering projects and 12 tasks across various statuses, demonstrating immediate value.
- **Single-Browser Boundary Note**: Standard `localStorage` is scoped to the user's specific browser client and origin. For team synchronization or cloud persistence, the service layer can be swapped with REST, GraphQL, or Supabase endpoints without modifying UI components.

---

## 📋 Prerequisites & System Requirements

- **Node.js**: v18.0.0 or later (v20+ or v22+ recommended).
- **NPM**: v9.0.0 or later.
- Modern Web Browser: Chrome, Firefox, Safari, or Edge.

---

## ⚡ Installation & Getting Started

### 1. Clone or Open the Workspace
Navigate to the project root directory:
```bash
cd devtrack
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:5173/`. Open this URL in your web browser.

---

## 📜 Available Scripts

The project defines standardized, reliable NPM scripts:

| Command | Action | Explanation |
| :--- | :--- | :--- |
| `npm run dev` | Starts Vite Dev Server | Boots local dev server with lightning-fast Hot Module Replacement (HMR). |
| `npm run build` | Compiles for Production | Runs TypeScript type-checking (`tsc -b`) followed by optimized Vite bundling into `dist/`. |
| `npm run preview` | Previews Production Build | Serves the production bundle locally to test production behavior. |
| `npm run test` | Executes Automated Tests | Runs Vitest across all unit, service, calculation, and component test suites. |
| `npm run test:watch` | Watch Mode Tests | Runs Vitest in interactive watch mode for rapid test-driven development. |
| `npm run typecheck` | Type-Checks Project | Runs TypeScript compiler in `--noEmit` mode to catch type errors without emitting JavaScript. |
| `npm run lint` | Runs ESLint | Executes ESLint flat config checking across all TypeScript and React files. |
| `npm run format` | Prettier Formatting | Automatically formats all source code according to `.prettierrc` rules. |

---

## 🧪 Testing & Quality Assurance

DevTrack includes automated tests across 6 dedicated test suites covering calculations, utility logic, schema boundaries, service operations, and React UI components.

### Running the Test Suite:
```bash
npm run test
```

### Verified Test Suites:
1. `src/test/calculations.test.ts`
   - Project progress percentage (handles 0%, 33%, 100%, and 0-task edge cases).
   - Dashboard telemetry metrics calculation.
   - Status and priority distribution point generators.
   - Rolling 7-day velocity point generation.
2. `src/test/dateUtils.test.ts`
   - Date formatting and relative time conversions ("just now", "10 mins ago", "2 hours ago").
   - Overdue calculation logic (ensures completed tasks are never flagged as overdue).
   - Days remaining calculations.
3. `src/test/validationSchemas.test.ts`
   - Zod validation for projects: rejects names under 2 characters, rejects deadlines preceding start dates.
   - Zod validation for tasks: requires project assignment, rejects negative hours.
   - Zod validation for backups: accepts valid exports, rejects corrupted or tampered payloads.
4. `src/test/services.test.ts`
   - `SafeStorageService`: serialization, deserialization, corrupted JSON resilience, prefix isolation.
   - `ProjectService`: CRUD, field updates, deletion.
   - `TaskService`: CRUD, automatic `completedAt` timestamp assignment and clearing, cascade deletion of child tasks.
   - `SettingsService`: preference updates, JSON export, validated JSON import.
5. `src/test/components.test.tsx`
   - `MetricCard`: verifies rendering of titles, values, subtexts, and click handlers.
   - `Badge` & `PriorityBadge`: verifies priority text and visual indicator dot.
   - `ConfirmDialog`: verifies modal appearance and confirmation callback triggering.
   - `Button`: verifies disabled state and loading spinner appearance when `isLoading` is active.

---

## 🚢 Build & Deployment Guide

DevTrack is configured as a Single-Page Application (SPA) ready for static deployment on platforms such as **Vercel** or **Netlify**.

### Production Build
Run the production build script:
```bash
npm run build
```
The optimized bundle will be compiled into the `dist/` directory.

### Deploying to Vercel
1. Ensure `vercel.json` is in the project root:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
2. Run the Vercel CLI or link your Git repository in the Vercel dashboard:
   ```bash
   npx vercel
   ```
3. Set the build command to `npm run build` and output directory to `dist`.

### Deploying to Netlify
1. DevTrack includes `public/_redirects` which redirects all incoming routes to `index.html`:
   ```
   /*    /index.html   200
   ```
2. Connect your Git repository in Netlify or run:
   ```bash
   npx netlify deploy --prod --dir=dist
   ```

---

## 🔍 Known Limitations & Future Roadmap

### Current Limitations
- **Local Browser Storage**: Application data is stored in the user's browser `localStorage`. Data does not automatically synchronize across different browsers or devices without exporting and importing a JSON backup.
- **Image Uploads**: Projects use semantic color coding and badges rather than uploaded binary asset files.

### Suggested Future Enhancements
- [ ] **Multi-User Backend**: Add a lightweight backend API (e.g. Node/Express, NestJS, or Supabase) with JWT authentication and PostgreSQL for collaborative team workflows.
- [ ] **Time Tracking Timer**: Real-time Pomodoro / active stopwatch for logging hours directly into tasks.
- [ ] **GitHub / GitLab Integration**: Webhook integration to sync Git pull requests and commits to task completion statuses.
- [ ] **CSV / PDF Report Export**: Export project completion reports for sprint retrospectives.

---

## 📄 License

This project is licensed under the MIT License — feel free to use it for personal or commercial projects.
