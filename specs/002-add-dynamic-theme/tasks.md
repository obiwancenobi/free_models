# Tasks: Add Dynamic Theme

**Input**: Design documents from `/specs/002-add-dynamic-theme/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: React/TypeScript, frontend structure
2. Load optional design documents:
   → data-model.md: Extract Theme/UserPreference entities → context/hook tasks
   → contracts/: No contracts (frontend-only feature)
   → research.md: Extract CSS variables, localStorage decisions → utility tasks
   → quickstart.md: Extract test scenarios → integration test tasks
3. Generate tasks by category:
   → Setup: verify structure, dependencies
   → Tests: integration tests for theme scenarios
   → Core: types, utilities, context, components
   → Integration: system detection, persistence, positioning
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All test scenarios have tests?
   → All entities have implementation?
   → All components created?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Web app**: `frontend/src/` for components, `frontend/tests/` for tests
- All paths relative to repository root

## Phase 3.1: Setup
- [ ] T001 Verify project structure matches plan.md (frontend/src/, frontend/tests/)
- [ ] T002 [P] Ensure React 18+ and TypeScript dependencies are installed

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T003 [P] Integration test for system theme detection in frontend/tests/integration/test-theme-detection.js
- [ ] T004 [P] Integration test for manual theme switching in frontend/tests/integration/test-theme-switching.js
- [ ] T005 [P] Integration test for theme persistence in frontend/tests/integration/test-theme-persistence.js
- [ ] T006 [P] Integration test for responsive icon button in frontend/tests/integration/test-theme-icon.js

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T007 Create theme types in frontend/src/types/theme.ts
- [ ] T008 [P] Create theme utilities in frontend/src/utils/themeUtils.ts
- [ ] T009 [P] Create localStorage utilities in frontend/src/utils/storageUtils.ts
- [ ] T010 Create theme context in frontend/src/contexts/ThemeContext.tsx
- [ ] T011 Create useTheme hook in frontend/src/hooks/useTheme.ts
- [ ] T012 [P] Create theme CSS variables in frontend/src/styles/theme.css
- [ ] T013 Create ThemeProvider component in frontend/src/components/ThemeProvider.tsx
- [ ] T014 Create ThemeToggle icon button in frontend/src/components/ThemeToggle.tsx
- [ ] T015 Integrate ThemeProvider in frontend/src/App.tsx
- [ ] T016 Add theme CSS imports in frontend/src/index.css

## Phase 3.4: Integration
- [ ] T017 Connect system theme detection in ThemeContext.tsx
- [ ] T018 Implement localStorage persistence in ThemeContext.tsx
- [ ] T019 Add responsive positioning for ThemeToggle.tsx

## Phase 3.5: Polish
- [ ] T020 [P] Unit tests for theme utilities in frontend/tests/unit/test-themeUtils.js
- [ ] T021 [P] Unit tests for storage utilities in frontend/tests/unit/test-storageUtils.js
- [ ] T022 Performance tests for theme switching (<50ms)
- [ ] T023 Update component documentation
- [ ] T024 Run quickstart.md validation

## Dependencies
- Tests (T003-T006) before implementation (T007-T016)
- T007 before T010, T011 (types needed for context/hook)
- T008, T009, T012 can run in parallel (different files)
- T010 before T013, T015 (context needed for provider integration)
- T013 before T017-T019 (provider needed for integration features)
- Implementation before polish (T020-T024)

## Parallel Example
```
# Launch T003-T006 together (all different test files):
Task: "Integration test for system theme detection in frontend/tests/integration/test-theme-detection.js"
Task: "Integration test for manual theme switching in frontend/tests/integration/test-theme-switching.js"
Task: "Integration test for theme persistence in frontend/tests/integration/test-theme-persistence.js"
Task: "Integration test for responsive icon button in frontend/tests/integration/test-theme-icon.js"

# Launch T008, T009, T012 together (different utility files):
Task: "Create theme utilities in frontend/src/utils/themeUtils.ts"
Task: "Create localStorage utilities in frontend/src/utils/storageUtils.ts"
Task: "Create theme CSS variables in frontend/src/styles/theme.css"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing (run tests after T003-T006)
- Commit after each task completion
- Avoid: vague tasks, same file conflicts
- Theme switching should be instant (<50ms) per performance requirements

## Task Generation Rules
*Applied during main() execution*

1. **From Data Model**:
   - Theme entity → theme types, context, CSS variables
   - UserPreference entity → localStorage utilities, persistence logic

2. **From Research**:
   - CSS custom properties → theme.css task
   - localStorage patterns → storageUtils.ts task
   - System theme detection → themeUtils.ts task

3. **From User Stories**:
   - System theme detection story → test-theme-detection.js
   - Manual switching story → test-theme-switching.js
   - Persistence story → test-theme-persistence.js
   - Icon button story → test-theme-icon.js

4. **Ordering**:
   - Setup → Tests → Types → Utilities → Context → Components → Integration → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [ ] All test scenarios from quickstart.md have corresponding tests
- [ ] All entities from data-model.md have implementation tasks
- [ ] All tests come before implementation (TDD compliance)
- [ ] Parallel tasks truly independent (different files)
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task
- [ ] Theme switching performance requirement addressed
- [ ] Icon button positioning requirement included