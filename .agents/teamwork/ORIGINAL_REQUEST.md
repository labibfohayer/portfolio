# Original User Request

## 2026-10-09T13:17:05Z

# Teamwork Project Prompt — Draft

> Status: Launched
> Requested team: [none — teamwork routes from the description]

Turn the Next.js portfolio website into an inline Visual Builder (like Canva/Wix), allowing the admin to click on any text or image on the live site to edit its content, font, color, or replace the image directly without going to a separate dashboard.

Working directory: C:\Users\assdi\.gemini\antigravity\scratch\portfolio

Integrity mode: benchmark

## Requirements

### R1. Admin Visual Editor Interface
Build a "Visual Editor" page inside the Admin Panel that renders the live website exactly as it appears to visitors. The admin should be able to navigate through the 7 pages (Home, About, Projects, Skills, Experience, Blog, Contact) within this editor.

### R2. Inline Text & Style Editing
When the admin clicks on a text element in the visual editor, a contextual toolbar (similar to Canva) must appear. It should allow the admin to edit the text content, change the font family, and change the text color.

### R3. Inline Image Replacement
When the admin clicks on an image in the visual editor, a contextual toolbar must appear allowing them to upload a new image file from their computer to replace the existing image. Images should be compressed automatically before saving.

### R4. Database Persistence & Dynamic Rendering
All text, style, and image overrides made in the Visual Editor must be saved to the MongoDB backend (e.g., expanding the `Settings` schema or creating a new `PageContent` schema). The public-facing website must dynamically fetch and apply these overrides.

## Acceptance Criteria

### Backend & State
- [ ] A MongoDB schema exists to store dynamic page content, text, fonts, colors, and image overrides.
- [ ] API routes are created/updated to securely fetch and update this visual content.

### Visual Editor Functionality
- [ ] The Admin Panel contains a functional Visual Editor mode.
- [ ] Clicking an editable text element opens a toolbar with inputs for text, font, and color.
- [ ] Clicking an image opens a file picker to upload a replacement.
- [ ] Changes are instantly reflected in the editor preview.
- [ ] Saving changes successfully updates the database.

### Public Website
- [ ] The public website fetches the dynamic content from the database.
- [ ] Text, fonts, colors, and images applied in the Visual Editor are correctly rendered on the live site.
