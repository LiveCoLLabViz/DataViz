# Integration notes

This covers everything you didn't already build: Redux slices + store, hooks,
layouts, routing, and all components/pages for the 5 wireframe sections
(Header, Toolbar, Workspace Sidebar tree, Data Panel, Dashboard Canvas, Footer,
Chat, Members, Version History, Share/Upload modals).

Drop the `src/` folder into your project, keeping your existing files (they
were skipped entirely — nothing here overwrites them).

## 1. Extra packages needed

Your original stack list didn't include a drag/resize library for the chart
cards on the canvas (drag, resize, grid-snap were required by the spec).
`react-dnd` alone doesn't do free-form drag + resize inside the canvas, so
`ChartCard` uses two small, widely-used libs on top of your existing stack:

```
npm install react-dnd react-dnd-html5-backend react-draggable re-resizable
```

(`react-dnd` is for dragging *fields* from the sidebar/tree into the wells and
canvas — this was already in your stack. `react-draggable` + `re-resizable`
are only for moving/resizing chart cards already on the canvas.)

## 2. Import names you should double check

I didn't have the source of your already-built files, so I had to assume
export names. Please confirm/adjust these imports:

- `services/socketService.js` → assumed to export `getSocket()`, `connectSocket(token)`, `disconnectSocket()` (used in `hooks/useSocket.js` and `context/SocketContext.jsx`).
- `services/chatService.js` → assumed to export `sendMessage(workspaceId, text)` (used in `components/Chat/ChatDrawer.jsx`).
- `services/uploadService.js` → assumed to export `uploadFile(file, onProgress)` returning parsed preview data (used in `components/Common/UploadModal.jsx`).
- `services/workspaceService.js` → assumed to export `getWorkspaces()` (used in `pages/WorkspacePage/WorkspacePage.jsx`).
- `services/authService.js` → assumed to export `login({ email, password })` (used in `pages/LoginPage/LoginPage.jsx`).
- `components/Common/Avatar`, `ProgressBar`, `Skeleton`, `ErrorBoundary`, `Button` → assumed to live at `src/components/Common/<Name>.jsx` with a default export. I referenced `Avatar` and `ProgressBar` and `ErrorBoundary` directly by that path; rename the import if your actual filenames differ (you mentioned lowercase names like `avatar.jsx`, `postgressbar.jsx`, `skelton.jsx`).
- Your `modelservice.js` / `dropdownservice.js` weren't used directly since I didn't know their API — the Header dropdown and all modals currently use local `useState` instead. Swap in your services if you want centralized modal/dropdown state.

## 3. Data shape assumptions (adjust to match your real API)

- A workspace: `{ id, name, files: [{ id, name, datasets: [{ id, name, columns: [{ id, name, dataType }] }] }] }`
- A chart on the canvas: `{ id, title, chartType, color, showLegend, showTooltip, data: [{name, value}], position: {x,y}, size: {width,height} }`
  `chart.data` should be populated by your `chartService` based on the fields
  dropped into Rows/Columns/Filters — the reducer currently just creates an
  empty chart shell (`dashboardSlice.addChartToActiveDashboard`) when a field is
  dropped on the canvas; wire your chart service call there.

## 4. What still needs your glue

- Undo/redo in `Toolbar.jsx` are no-ops — connect them to whatever
  history/versioning mechanism you use.
- `chartService` integration to turn dropped fields into actual `data` arrays
  for `ChartRenderer`.
- Socket event names (`chat:message` is the only one wired up as an example) —
  add listeners for presence/members, typing indicators, and version updates
  the same way in `useSocket`.

Everything else (tree view, drag-and-drop wells, dashboard tabs with
rename/close, chat drawer, share modal, upload modal with progress + preview,
version history timeline, active members with online dots) is fully wired to
Redux and ready to run once the services above are confirmed.
