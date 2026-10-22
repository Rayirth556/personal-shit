# DESIGN.md — "Plan" Student Daily Planner Design System

Extracted from Google Stitch Project: **"Student Daily Planner Dashboard"**  
Project ID: `16355145647850000309`  
Design System: **"Academic Clarity"** (Asset ID: `assets/9f54e1865cd146a0b4b9f0381bc99a24`)

---

## 1. Brand & Design Philosophy
"Plan" pairs the cognitive ease and restraint of Apple's Human Interface Guidelines (HIG) with an editorial cadence tailored for higher education. The aesthetic marries frosted translucent glass, pristine white card surfaces, subtle micro-shadows, and an electric indigo accent (`#5E5CE6`). It avoids dense calendar clutter in favor of breathable whitespace and clear visual hierarchy.

---

## 2. Colour Palette & Semantic Roles

### 2.1 Base Neutrals & Surfaces
| Token | Variable | Light Mode | Dark Mode | Usage / Role |
|---|---|---|---|---|
| **Canvas** | `--bg-canvas` | `#F5F5F7` (Apple Light Gray) | `#0E0E11` | Background canvas |
| **Surface (Cards)** | `--bg-surface` | `#FFFFFF` | `#18181B` | Content cards, solid containers |
| **Surface Subdued** | `--bg-subdued` | `#F3F3F5` | `#222226` | Secondary container, nested list backgrounds |
| **Surface High** | `--bg-high` | `#E8E8EA` | `#2A2A2E` | Pill background, hover states |
| **Surface Highest** | `--bg-highest` | `#E2E2E4` | `#323238` | Subtle boundaries & inactive pills |
| **Frosted Glass** | `--bg-glass` | `rgba(255, 255, 255, 0.78)` | `rgba(24, 24, 27, 0.75)` | Sidebar & header `backdrop-blur-xl` |
| **Text Primary** | `--text-primary` | `#1D1D1F` | `#F5F5F7` | Primary headings, titles, high-contrast labels |
| **Text Secondary** | `--text-secondary`| `#6E6E73` | `#A1A1A6` | Subtitles, metadata, timestamps, placeholders |
| **Hairline Dividers** | `--border-subtle` | `#E5E5EA` | `#2E2E34` | Hairline dividers, subtle card borders |
| **Outline Variant** | `--outline-variant`| `#C7C4D7` | `#454554` | Secondary outlines |

### 2.2 Core Interactive Accents
| Token | Variable | HEX / Value | Purpose |
|---|---|---|---|
| **Primary Accent** | `--primary` | `#5E5CE6` (Electric Indigo) | Primary action buttons, active navigation, key focal points |
| **Primary Container**| `--primary-container`| `#5E5CE6` | Active tab background, selected state |
| **On Primary** | `--on-primary` | `#FFFFFF` | Text/icons on primary buttons |
| **Primary Fixed** | `--primary-fixed` | `#E2DFFF` | Subtle pill tag background for primary items |
| **Secondary Blue** | `--secondary` | `#007AFF` (System Blue) | Secondary focus, links, time-block indicators |
| **Focus Ring** | `--ring-focus` | `rgba(94, 92, 230, 0.25)` | Accessible focus glow on inputs and controls |

### 2.3 Academic Taxonomy (Category Tokens)
| Category | Solid Color | 12% Tint Background | Semantic Role |
|---|---|---|---|
| **Exam** | `#FF3B30` (Apple Red) | `rgba(255, 59, 48, 0.12)` | Exams, quizzes, critical deadlines, urgent alerts |
| **Assignment** | `#FF9500` (Apple Orange) | `rgba(255, 149, 0, 0.12)` | Course homework, problem sets, lab reports |
| **Project** | `#AF52DE` (Apple Purple) | `rgba(175, 82, 222, 0.12)` | Capstone tasks, repository milestones, code reviews |
| **Personal / Study**| `#34C759` (Apple Green) | `rgba(52, 199, 89, 0.12)` | Gym, focus blocks, lectures, personal reflection |

---

## 3. Typography Scale
Font stack: `-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, sans-serif`

| Style | Font Size | Line Height | Weight | Letter Spacing | Case |
|---|---|---|---|---|---|
| **display-hero** | `40px` | `48px` | 700 (Bold) | `-0.02em` | Normal |
| **headline-lg** | `28px` | `34px` | 600 (Semibold) | `-0.015em` | Normal |
| **headline-md** | `22px` | `28px` | 600 (Semibold) | `-0.01em` | Normal |
| **headline-sm** | `18px` | `24px` | 600 (Semibold) | `-0.005em` | Normal |
| **body-lg** | `17px` | `24px` | 400 (Regular) | `-0.01em` | Normal |
| **body-md** | `15px` | `21px` | 400 (Regular) | `0em` | Normal |
| **body-sm** | `13px` | `18px` | 400 (Regular) | `+0.005em` | Normal |
| **label-md** | `14px` | `18px` | 500 (Medium) | `0em` | Normal |
| **label-sm** | `12px` | `16px` | 500 (Medium) | `+0.01em` | Normal |
| **label-caps** | `11px` | `14px` | 600 (Semibold) | `+0.06em` | Uppercase |

---

## 4. Spacing Scale (8pt grid with 4pt sub-steps)
- `space-xxs`: `4px` (`0.25rem`)
- `space-xs`: `8px` (`0.5rem`)
- `space-sm`: `12px` (`0.75rem`)
- `space-md`: `16px` (`1rem`)
- `space-lg`: `20px` (`1.25rem`)
- `space-xl`: `24px` (`1.5rem`)
- `space-2xl`: `32px` (`2rem`)
- `space-3xl`: `48px` (`3rem`)

---

## 5. Corner Radii & Shadows
- **Card Containers**: `20px` (`rounded-[20px]`)
- **Pills / Badges / Buttons**: `9999px` (`rounded-full`)
- **Checkboxes**: `22px` circular ring (`rounded-full`)
- **Inputs**: `9999px` pill (`rounded-full`)
- **Shadow Baseline (Level 1)**: `0 4px 20px rgba(0, 0, 0, 0.04)`
- **Shadow Floating / Modals (Level 2)**: `0 12px 32px rgba(0, 0, 0, 0.08)`
- **Shadow Button Accent**: `0 4px 16px rgba(94, 92, 230, 0.25)`

---

## 6. Frosted Glass Treatment
- **Sidebar & Top Header**:
  - Light mode: `background-color: rgba(255, 255, 255, 0.78); backdrop-filter: blur(20px) saturate(180%);`
  - Dark mode: `background-color: rgba(24, 24, 27, 0.75); backdrop-filter: blur(20px) saturate(180%);`
  - Border: `inset 0 0 0 0.5px rgba(255, 255, 255, 0.6)` (Light) or `1px solid rgba(255, 255, 255, 0.08)` (Dark)

---

## 7. Recurring Component Patterns

### 7.1 Cards
- Pure solid white (`#FFFFFF`) in light mode, `#18181B` in dark mode.
- `20px` radius, padding `space-lg` (`20px`), ambient shadow `0 4px 20px rgba(0, 0, 0, 0.04)`.
- Completely borderless under normal contrast conditions.

### 7.2 Task Rows & Checkboxes
- **Circular Checkbox**: `22px` circle with `1.5px` stroke (`#6E6E73`) in incomplete state.
- **Completed State**: Animated spring fill `#5E5CE6` with white SVG checkmark; text strikes through with `#6E6E73` color transition.
- **Row Hover**: Subtle background tint `hover:bg-zinc-100/60 dark:hover:bg-zinc-800/40`, rounded `12px`.

### 7.3 Category Badges & Chips
- Fixed `24px` - `26px` height, horizontal padding `8px` - `12px`, full pill radius.
- Category-specific 12% tint background with 100% solid category text.

### 7.4 Timeline Blocks
- Left semantic border bar: `4px` wide rounded vertical indicator matching category tint (Exam, Assignment, Project, Personal).
- Time label aligned to left gutter; real-time "Now" indicator line with pulsing dot.

### 7.5 Circular Progress Ring
- SVG circular ring with stroke width `8px`, track `#F3F3F5`, active stroke gradient or `#5E5CE6`. Center text displaying completed/total and status.

### 7.6 Consistency Heatmap
- 7-day rows × 12/14-week columns matrix.
- Intensity cells ranging from empty (`#F3F3F5`) to deep indigo (`#5E5CE6`), rounded `3px`.

### 7.7 Kanban Board
- 3 columns ("To do", "Doing", "Done") with count badges.
- Cards feature priority chips (High red, Medium blue, Low gray), due date, subtask progress bar (`4px` height), tag pills, and assignee avatar.
