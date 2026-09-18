# Project Knowledge & Developer Guidelines

This repository is a full-stack web application featuring personal portfolio showcases, project galleries, and a comprehensive resource/tools/games portal ("Secret Area") integrated with Google Apps Script (Google Sheets) and Firebase.

---

## 1. Core Architecture & Tech Stack

- **Frontend**: React 18+ with Vite, TypeScript, Tailwind CSS, and Framer Motion.
- **Backend / Dev Server**: Express server with Vite middleware in `server.ts`.
- **Database & Auth**: Firebase Firestore and Firebase Authentication (`src/firebase.ts`).
  - *Note*: Mock files (`firestoreMock.ts`, `authMock.ts`) have been replaced. Always import Firestore methods directly from `firebase/firestore` and Auth methods from `firebase/auth`.
- **Icons**: Centralized in `components/Icon.tsx` (using `react-icons/tb`, `react-icons/si`, etc.). When adding a new icon, register it in `components/Icon.tsx`.

---

## 2. Google Sheets Integration & Catalog Data Flow

### How Data is Fetched
The application does **NOT** use the official Google Sheets API client library or Google OAuth to read the public catalog.
Instead, it interacts with a **Google Apps Script Web App** deployed as an API:
- Defined as `API_ENDPOINT` in `pages/SecretArea.tsx`:
  `https://script.google.com/macros/s/AKfycbx7nzBZc_tIhbAUK5OvOzgifGVzaVorzjn5OXNe8ENC0p7Pjia7O-u4WggxjRZipt4v/exec`
- The endpoint returns a JSON payload containing rows for each sheet/tab (e.g., `game`, `hypervisor`, `steamtools`, `architect`, `extra`, `topgames`, etc.).

### Critical Category & Name Mappings
The UI displays user-friendly labels that differ from internal code category keys:
| UI Display Label | Internal Category Key | ID Prefix | Notes |
| :--- | :--- | :--- | :--- |
| **Tools** | `architect` | `A` | Architecture, creative tools & software |
| **Games** | `game` | `G` | PC Games & repacks |
| **Hypervisor** | `hypervisor` | `H` | Emulation, system tools & virtualization |
| **SteamTools** | `steamtools` | `S` | Steam utility items |
| **Extra** | `extra` | `E` | Additional software & links |

*Rule*: Whenever a request mentions the **"Tools"** section, it corresponds to `item.category === 'architect'` in `pages/SecretArea.tsx`.

---

## 3. Secret Area (`pages/SecretArea.tsx`) Details

`pages/SecretArea.tsx` contains the catalog browser, search filters, detail modals, and download channels.

### A. Data Processing (`processRawData`)
- Located around line ~5600+ in `pages/SecretArea.tsx`.
- Normalizes Google Sheet headers and extracts links:
  - `item.links.full`: Direct download / master link
  - `item.links.mirrors`: Mirror download links
  - `item.links.parts`: Multi-part archives (DataNodes, FuckingFast, etc.)
  - `item.links.preInstalled`: Pre-installed options
  - `item.links.utorrent`: Torrent / Magnet links (from `µTorrent`, `utorrent`, or `magnet` columns/tabs)

### B. Item Details View ("Details Page")
- The item details view is rendered as a modal inside `pages/SecretArea.tsx` controlled by `selectedItem` (`{selectedItem && ...}`).
- The **Download Channels** section is located inside this modal (search for `{/* Download Channels */}`).
- Download channels are rendered using the `DownloadButton` component.

### C. Magnet / Torrent Handling
- Torrent warning modal is triggered via `setTorrentWarningLink(url)`.
- Magnet buttons use icon `Magnet` (`TbMagnet` from `components/Icon.tsx`).

---

## 4. Coding Conventions & Best Practices

1. **Avoid Mock Restorations**: Do not reintroduce `firestoreMock` or `authMock`. All Firebase actions must use `src/firebase.ts` or `firebase/*`.
2. **Icon Additions**: Always check `components/Icon.tsx` before referencing icon names. Add new icons to the lookup map in `components/Icon.tsx` if not already present.
3. **Responsive UI**: Keep mobile viewport layouts intact.
4. **Environment Variables**: Use `import.meta.env.VITE_*` for client-side keys and `process.env.*` in `server.ts`.
