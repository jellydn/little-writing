# Tasks: Kids Handwriting Tracing App

**Input**: Design documents from `/specs/001-handwriting-tracing/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are optional for this project and not explicitly requested in the specification. Test tasks can be added later if desired.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single project: `src/`, `tests/` at repository root
- Paths shown below assume single project structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project directory structure per implementation plan (src/components, src/lib, src/hooks, src/state, src/styles, src/assets, tests)
- [x] T002 Initialize React + TypeScript project with Vite in package.json
- [x] T003 [P] Install and configure dependencies: react, react-konva, zustand, @capacitor/core, @capacitor/ios, @capacitor/cli
- [x] T004 [P] Install dev dependencies: vitest, @testing-library/react, @testing-library/jest-dom, playwright, typescript, @types/react
- [x] T005 [P] Configure TypeScript strict mode in tsconfig.json
- [x] T006 [P] Configure Vite build settings in vite.config.ts
- [x] T007 [P] Configure ESLint and Prettier for code quality
- [x] T008 Create Capacitor configuration in capacitor.config.ts with app ID and iOS settings

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T009 Define TypeScript interfaces in src/types/index.ts for CharacterTemplate, StrokePath, Point, Stroke, DrawingSession, Category
- [x] T010 [P] Create theme constants in src/styles/theme.ts (COLORS, UI_CONFIG, VALIDATION_CONFIG)
- [x] T011 [P] Create animation constants in src/styles/animations.ts (CSS animations for shake, pulse, bounce)
- [x] T012 Create Zustand store in src/state/sessionStore.ts with AppStore interface (navigation state, session state, all actions)
- [x] T013 Create character template loader utility in src/lib/templates/templateLoader.ts (load JSON, parse, validate schema)
- [x] T014 Create character data index in src/lib/templates/characterData.ts (export all 62 character templates by category)
- [x] T015 Create stroke validation utility in src/lib/canvas/strokeValidator.ts (point-to-segment distance, accuracy calculation)
- [x] T016 Create SVG path renderer in src/lib/canvas/pathRenderer.ts (render guide paths to canvas)
- [x] T017 Create touch handler utility in src/lib/canvas/touchHandler.ts (pointer events, palm rejection)
- [x] T018 [P] Create sound player utility in src/lib/feedback/soundPlayer.ts (HTML5 Audio API, playSuccessSound)
- [x] T019 [P] Create visual feedback utility in src/lib/feedback/visualFeedback.ts (color management, state transitions)
- [x] T020 Create useTracing hook in src/hooks/useTracing.ts (session state management, stroke lifecycle)
- [x] T021 Create useCanvas hook in src/hooks/useCanvas.ts (canvas setup, device pixel ratio, render loop)
- [x] T022 Create useValidation hook in src/hooks/useValidation.ts (real-time stroke validation)
- [x] T023 Create sample character template JSONs in src/assets/characters/numbers/0.json, 1.json, A.json (at least 3 templates for testing)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

✅ **Phase 2 Complete** - All foundational tasks (T009-T023) completed

---

## Phase 3: User Story 1 - Character Selection & Tracing (Priority: P1) 🎯 MVP

**Goal**: Core tracing experience - select character, see guides, trace with feedback, get success animation

**Independent Test**: Open app → tap Letters → tap "A" → see guide → trace with finger/stylus → see green/red feedback → complete all strokes → see star animation and hear sound

### Implementation for User Story 1

- [x] T024 [P] [US1] Create CategorySelector component in src/components/navigation/CategorySelector.tsx (two cards for Numbers/Letters, onSelectCategory callback)
- [x] T025 [P] [US1] Create CharacterGrid component in src/components/navigation/CharacterGrid.tsx (grid of character cards, onSelectCharacter callback, onBack callback)
- [x] T026 [P] [US1] Create Button UI component in src/components/ui/Button.tsx (44x44 minimum, bright colors, child-friendly)
- [x] T027 [P] [US1] Create Card UI component in src/components/ui/Card.tsx (tappable, visual feedback)
- [x] T028 [US1] Create AppLayout component in src/components/layout/AppLayout.tsx (main shell, screen routing based on store state)
- [x] T029 [US1] Create Canvas component in src/components/tracing/Canvas.tsx (renders guide and user strokes, pointer events, onStrokeStart/Move/End callbacks)
- [x] T030 [US1] Create CharacterGuide component in src/components/tracing/CharacterGuide.tsx (renders stroke paths, highlights current stroke, pulsing start point)
- [x] T031 [US1] Create StrokeFeedback component in src/components/tracing/StrokeFeedback.tsx (green/red overlay, shake animation for incorrect)
- [x] T032 [US1] Create SuccessAnimation component in src/components/tracing/SuccessAnimation.tsx (star scale/bounce, plays sound, onComplete callback)
- [x] T033 [US1] Create TracingScreen component in src/components/navigation/TracingScreen.tsx (canvas + guides + feedback + success animation, handles stroke callbacks)
- [x] T034 [US1] Create main App component in src/App.tsx (integrate all screens, connect to Zustand store, initialize on mount)
- [x] T035 [US1] Create main entry point in src/main.tsx (render App, mount to DOM)
- [x] T036 [US1] Add global styles in src/styles/globals.css (reset, font setup, bright colors)
- [x] T037 [US1] Wire up category selection flow in AppStore (navigateToCategorySelection, selectCategory actions)
- [x] T038 [US1] Wire up character selection flow in AppStore (selectCharacter action, creates DrawingSession)
- [x] T039 [US1] Wire up tracing flow in AppStore (startStroke, addStrokePoint, endStroke actions, validates via strokeValidator)
- [x] T040 [US1] Add success sound asset in src/assets/sounds/success.mp3 (README added, MP3 file to be added by user)
- [x] T041 [US1] Configure 60fps render loop in useCanvas hook (requestAnimationFrame, clear, render in order: background, guide, completed strokes, current stroke)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. A child can open the app, select a character, trace it, and receive feedback.

---

## Phase 4: User Story 2 - Navigation Between Characters (Priority: P2)

**Goal**: Move between characters with Next/Previous buttons, return to category selection

**Independent Test**: Complete a character → tap Next → next character loads; tap Previous → previous loads; tap Back → return to character selection

### Implementation for User Story 2

- [x] T042 [P] [US2] Create NavButtons component in src/components/navigation/NavButtons.tsx (Next, Previous, Back buttons, enabled states based on props)
- [x] T043 [US2] Integrate NavButtons into TracingScreen in src/components/navigation/TracingScreen.tsx (pass hasNext, hasPrevious, isSessionComplete, callback props)
- [x] T044 [US2] Implement nextCharacter action in AppStore in src/state/sessionStore.ts (loads next character in sequence, loops if at end)
- [x] T045 [US2] Implement previousCharacter action in AppStore in src/state/sessionStore.ts (loads previous character, stops at first)
- [x] T046 [US2] Add screen routing state in AppStore in src/state/sessionStore.ts (currentScreen: category-selection | character-selection | tracing)
- [x] T047 [US2] Update AppLayout to handle screen routing in src/components/layout/AppLayout.tsx (conditional render based on currentScreen state)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Navigation between characters and back to category selection is functional.

---

## Phase 5: User Story 3 - Reset & Retry (Priority: P3)

**Goal**: Clear current drawing and retry the same character

**Independent Test**: Partially trace a character → tap Clear → canvas clears, guides remain

### Implementation for User Story 3

- [x] T048 [US3] Add Clear button to NavButtons component in src/components/navigation/NavButtons.tsx (large, tappable, onClear callback)
- [x] T049 [US3] Implement clearSession action in AppStore in src/state/sessionStore.ts (clears strokes from session, preserves template and currentStrokeIndex)
- [x] T050 [US3] Integrate Clear button in TracingScreen in src/components/navigation/TracingScreen.tsx (wire onClear prop to store action)

**Checkpoint**: All user stories should now be independently functional. Complete tracing experience with navigation and retry capability.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

^- [x] T051 [P] Create all 62 character template JSON files in src/assets/characters/numbers/ (0-9.json), uppercase/ (A-Z.json), lowercase/ (a-z.json) based on template schema
^- [x] T052 [P] Add accessibility attributes to all interactive components in src/components/ (aria-labels, keyboard navigation, screen reader support)
^- [x] T053 [P] Optimize canvas rendering performance (stroke simplification, dirty rectangle optimization if needed)
^- [x] T054 [P] Add error boundaries in src/components/layout/ErrorBoundary.tsx (graceful error handling)
^- [x] T055 Configure Capacitor iOS deployment in capacitor.config.ts (app name, bundle ID, version)
^- [x] T056 Run `npx cap sync ios` and verify iOS project structure

- [x] T057 Test on iPad Simulator or device (touch input, stylus support, 60fps performance)
      ^- [x] T058 [P] Add app icons in public/icons/ for Capacitor (multiple sizes required)
      ^- [x] T059 Run typecheck and lint: `bun run typecheck && bun run lint`
      ^- [x] T060 Verify constitution compliance: touch targets ≥44x44, 60fps canvas, ±25px tolerance, bright colors, minimal UI

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Extends TracingScreen with navigation, integrates with US1 but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Adds Clear button to existing NavButtons, minimal integration needed

### Within Each User Story

- UI components in parallel (marked [P]) → integration components → store actions → final wiring

### Parallel Opportunities

- **Setup (Phase 1)**: T003, T004, T005, T006, T007 can run in parallel
- **Foundational (Phase 2)**: T010, T011, T018, T019 can run in parallel
- **User Story 1 (Phase 3)**: T024, T025, T026, T027 can run in parallel
- **User Story 2 (Phase 4)**: T042 can run in parallel with US3 work
- **User Story 3 (Phase 5)**: T048 can start as soon as NavButtons exists (from US2)
- **Polish (Phase 6)**: T051, T052, T053, T054, T058 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all UI components together:
Task: "Create CategorySelector component in src/components/navigation/CategorySelector.tsx"
Task: "Create CharacterGrid component in src/components/navigation/CharacterGrid.tsx"
Task: "Create Button UI component in src/components/ui/Button.tsx"
Task: "Create Card UI component in src/components/ui/Card.tsx"

# Then launch core components:
Task: "Create Canvas component in src/components/tracing/Canvas.tsx"
Task: "Create CharacterGuide component in src/components/tracing/CharacterGuide.tsx"
Task: "Create StrokeFeedback component in src/components/tracing/StrokeFeedback.tsx"
Task: "Create SuccessAnimation component in src/components/tracing/SuccessAnimation.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T008)
2. Complete Phase 2: Foundational (T009-T023) - **CRITICAL**
3. Complete Phase 3: User Story 1 (T024-T041)
4. **STOP and VALIDATE**: Test User Story 1 independently on browser and iPad
5. Demo to stakeholders: Core tracing experience is functional

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → **MVP complete!**
3. Add User Story 2 → Test independently → Navigation working
4. Add User Story 3 → Test independently → Retry working
5. Polish phase → All 62 characters, accessibility, performance, iPad deployment

Each phase adds value without breaking previous functionality.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (T024-T041)
   - Developer B: User Story 2 (T042-T047) - can start once T029 (TracingScreen) exists
   - Developer C: User Story 3 (T048-T050) - can start once T042 (NavButtons) exists
3. Stories complete and integrate independently

---

## Notes

- Total tasks: 60
- User Story 1 (MVP): 18 tasks (T024-T041)
- User Story 2: 6 tasks (T042-T047)
- User Story 3: 3 tasks (T048-T050)
- Foundation: 15 tasks (T009-T023) - MUST complete first
- Setup: 8 tasks (T001-T008)
- Polish: 10 tasks (T051-T060)

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- File paths are exact and should be created as specified
