# Test Infrastructure Specification: Portfolio Visual Builder

## 1. Overview & Test Architecture

The End-to-End (E2E) test infrastructure for the Next.js Portfolio Visual Builder is built as an opaque-box, behavioral test suite enforcing the interface contracts specified in `PROJECT.md` and user requirements in `ORIGINAL_REQUEST.md`.

### Core Architectural Principles
1. **Opaque-Box Contract Testing**: Tests validate external contracts (HTTP `/api/content`, DOM behavior, canvas compression bounds, cookie authentication, state changes) without relying on internal private implementation details.
2. **Zero-Facade Guarantee**: All tests execute real validation, JSON parsing, HTTP response simulation, aspect ratio mathematical downscaling, and draft-to-database lifecycle assertions.
3. **Progressive Testability**: The test suite can run independently with immediate exit code validation (Exit 0 on success, Exit 1 on failure) and seamlessly bind against production implementations as milestones complete.
4. **4-Tier Structured Verification**:
   - **Tier 1**: Feature Coverage (happy path baseline across all 4 requirements R1–R4).
   - **Tier 2**: Boundary & Corner Cases (edge cases, invalid combinations, security/XSS, payload sizes).
   - **Tier 3**: Cross-Feature Interactions (pairwise and multi-feature workflows).
   - **Tier 4**: Real-World Scenarios (complete admin authoring end-to-end user journeys).

---

## 2. Feature Inventory & Requirement Mapping

| Feature ID | Scope | Requirement Source | Description | Test Tier Coverage |
|---|---|---|---|---|
| **R1** | Admin Visual Editor Interface | `ORIGINAL_REQUEST §R1`, `PROJECT.md #5, 6, 7, 8` | Editor route `/admin/dashboard/builder`, admin sidebar link, 7 canonical section navigation, responsive viewport switcher | Tier 1 (5 tests), Tier 2 (5 tests) |
| **R2** | Inline Text & Style Editing | `ORIGINAL_REQUEST §R2`, `PROJECT.md #9, 10, 11, 12` | Click-to-edit text, floating Canva-style toolbar, live content typing, font family selector, color picker | Tier 1 (5 tests), Tier 2 (6 tests) |
| **R3** | Inline Image Replacement | `ORIGINAL_REQUEST §R3`, `PROJECT.md #13, 14` | Click-to-replace image, file picker upload, automatic HTML5 Canvas compression (<=1200px, quality 0.7, <200KB) | Tier 1 (5 tests), Tier 2 (5 tests) |
| **R4** | Database Persistence & Dynamic Rendering | `ORIGINAL_REQUEST §R4`, `PROJECT.md #1, 2, 3, 4, 16` | Mongoose PageContent schema, `/api/content` GET/POST with `admin_auth` cookie check, dynamic public site rendering & fallback | Tier 1 (5 tests), Tier 2 (6 tests) |
| **Cross-Feature** | Pairwise Interactivity | System Integration | Multi-attribute text+font+color saving, interleaved text+image sessions, cross-section draft retention, viewport resizing during editing | Tier 3 (5 tests) |
| **Admin Journeys** | Real-World Authoring | End-to-End User Scenarios | Hero rebranding, multi-section overhaul, session loss recovery, high-res storage budget, revert to default | Tier 4 (5 tests) |

---

## 3. Test Suite Directory Structure

```
tests/e2e/
├── runner.mjs                          # Master Test Runner CLI (exit code 0/1, tier filters)
├── run-all.mjs                         # Execution entrypoint alias
├── helpers/
│   ├── assertions.mjs                  # Assertion helpers with explicit diagnostic messages
│   ├── contracts.mjs                   # Canonical contracts, supported fonts/sections, reference API oracle
│   ├── dom-simulator.mjs               # Opaque DOM simulator for visual editor and visitor site
│   ├── image-fixture.mjs               # Fixture generator, downscaling math, and canvas compression oracle
│   └── test-context.mjs                # Test suite registration, timing, and result reporting
├── tier1-features/
│   ├── test-r1-editor-interface.mjs    # Tier 1: R1 Feature Coverage (5 tests)
│   ├── test-r2-text-editing.mjs        # Tier 1: R2 Feature Coverage (5 tests)
│   ├── test-r3-image-replacement.mjs   # Tier 1: R3 Feature Coverage (5 tests)
│   └── test-r4-db-persistence.mjs      # Tier 1: R4 Feature Coverage (5 tests)
├── tier2-boundaries/
│   ├── test-r1-boundaries.mjs          # Tier 2: R1 Boundary & Corner Cases (5 tests)
│   ├── test-r2-boundaries.mjs          # Tier 2: R2 Boundary & Corner Cases (6 tests)
│   ├── test-r3-boundaries.mjs          # Tier 2: R3 Boundary & Corner Cases (5 tests)
│   └── test-r4-boundaries.mjs          # Tier 2: R4 Boundary & Corner Cases (6 tests)
├── tier3-interactions/
│   └── test-cross-features.mjs         # Tier 3: Pairwise & Cross-Feature Interactions (5 tests)
└── tier4-scenarios/
    └── test-admin-workflows.mjs        # Tier 4: Real-World Admin Authoring Scenarios (5 tests)
```

---

## 4. Comprehensive Test Case Catalog

### Tier 1: Feature Coverage (20 Tests)
#### R1: Admin Visual Editor Interface & Navigation (5 tests)
- **T1.1**: Visual Editor mounts with default view and active `#home` section.
- **T1.2**: Visual Editor navigation supports all 7 canonical sections (`#home`, `#about`, `#projects`, `#skills`, `#experience`, `#blog`, `#contact`).
- **T1.3**: Admin dashboard sidebar layout specifies Visual Builder navigation link contract (`/admin/dashboard/builder`).
- **T1.4**: Responsive viewport toggle switches dimensions for Desktop (1440px), Tablet (768px), and Mobile (390px).
- **T1.5**: Visual Builder preserves navigation history and active highlight across jumps.

#### R2: Inline Text & Style Editing (5 tests)
- **T1.6**: Clicking editable text opens Canva-style contextual text toolbar.
- **T1.7**: Text content input updates draft content with zero latency in preview.
- **T1.8**: Font family selector updates element `fontFamily` style in real-time.
- **T1.9**: Text color picker updates element `color` style in real-time.
- **T1.10**: Toolbar dismisses/closes on deselect while preserving unsaved draft changes.

#### R3: Inline Image Replacement & Automatic Compression (5 tests)
- **T1.11**: Clicking editable image opens contextual image toolbar.
- **T1.12**: Image toolbar exposes file replacement action and preserves image element type.
- **T1.13**: Image compression routine automatically downscales large image to <=1200px max dimension.
- **T1.14**: Image compression routine produces base64 payload under 200KB with JPEG quality 0.7.
- **T1.15**: Compressed image immediately updates preview image src and marks editor dirty.

#### R4: Database Persistence & Dynamic Rendering (5 tests)
- **T1.16**: `GET /api/content` returns HTTP 200 with element overrides map.
- **T1.17**: `POST /api/content` with `admin_auth` persists text overrides batch.
- **T1.18**: `POST /api/content` with `admin_auth` persists compressed image overrides.
- **T1.19**: Public website dynamically renders persisted database overrides.
- **T1.20**: Public website gracefully renders default content when no database override exists.

---

### Tier 2: Boundary & Corner Cases (22 Tests)
#### R1 Boundaries (5 tests)
- **T2.1**: Viewport toggle rejects unsupported viewport presets and reports valid options.
- **T2.2**: Section navigation rejects non-existent or malformed section hashes.
- **T2.3**: Rapid navigation jumping across multiple sections remains synchronized.
- **T2.4**: Admin editor page enforces authentication state for authoring actions.
- **T2.5**: Resizing viewport while editing an element retains active selection and draft state.

#### R2 Boundaries (6 tests)
- **T2.6**: Empty string text override updates state cleanly without throwing.
- **T2.7**: Giant text payload (50,000 characters) processed without buffer overflow.
- **T2.8**: Text containing XSS attack vectors is preserved as raw text without code execution.
- **T2.9**: Multi-byte Unicode, emoji, and complex multilingual characters preserved accurately.
- **T2.10**: Malformed hex color code rejected with validation error.
- **T2.11**: Unsupported font family rejected with validation error.

#### R3 Boundaries (5 tests)
- **T2.12**: Ultra-heavy image (15MB 8K resolution 7680x4320) is downscaled and compressed to <200KB.
- **T2.13**: Non-image file MIME type rejected with descriptive validation error.
- **T2.14**: Corrupted or truncated image data URL throws descriptive decode error.
- **T2.15**: Small image (50x50px, <10KB) is not upscaled or distorted during compression.
- **T2.16**: Extreme aspect ratios (ultra-wide 4000x800 and ultra-tall 800x3200) strictly maintain proportions.

#### R4 Boundaries (6 tests)
- **T2.17**: `POST /api/content` without `admin_auth` cookie returns HTTP 401 Unauthorized.
- **T2.18**: `POST /api/content` with invalid or forged cookie returns HTTP 401 Unauthorized.
- **T2.19**: `POST /api/content` with malformed non-JSON body returns HTTP 400 Bad Request.
- **T2.20**: `POST /api/content` with empty items array returns HTTP 200 with count 0.
- **T2.21**: `POST /api/content` with invalid schema fields returns HTTP 400 with descriptive error.
- **T2.22**: Concurrent batch upserts to `/api/content` resolve atomically without corruption.

---

### Tier 3: Cross-Feature Interactions (5 Tests)
- **T3.1**: Multi-Property Styling + Persistence (Content + Font + Color bundled save).
- **T3.2**: Interleaved Text and Image Edits in unified authoring session.
- **T3.3**: Cross-Section Navigation maintains dirty draft state across sections before batch save.
- **T3.4**: Viewport switching during live editing preserves toolbar positioning and modifications.
- **T3.5**: Discard / Reset workflow interaction restores original state without persisting.

---

### Tier 4: Real-World Scenarios (5 Tests)
- **T4.1**: Scenario 1 — Complete Hero Rebranding End-to-End Journey (greeting, font, cyan color, avatar upload, save, live render).
- **T4.2**: Scenario 2 — Multi-Section Portfolio Overhaul Across 4 Sections (Home, About, Skills, Experience in one batch save).
- **T4.3**: Scenario 3 — Session Expiry, 401 Rejection, Re-Authentication & Zero Data Loss.
- **T4.4**: Scenario 4 — High-Resolution Asset Optimization & Storage Budget Verification (4000x3000 photo <= 200KB payload).
- **T4.5**: Scenario 5 — Override Reversion and Graceful Default Content Fallback.

---

## 5. Execution Guide

### Run Full Test Suite
```powershell
node tests/e2e/runner.mjs
# OR
node tests/e2e/run-all.mjs
```

### Run by Specific Tier
```powershell
# Tier 1 only (Feature Coverage)
node tests/e2e/runner.mjs --tier 1

# Tier 2 only (Boundaries & Edge Cases)
node tests/e2e/runner.mjs --tier 2

# Tier 3 only (Cross-Feature Interactions)
node tests/e2e/runner.mjs --tier 3

# Tier 4 only (Real-World Admin Scenarios)
node tests/e2e/runner.mjs --tier 4
```

### Exit Codes
- `0`: All test cases passed successfully.
- `1`: One or more test cases failed. Diagnostic stack traces and error messages printed to stderr/stdout.
