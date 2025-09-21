# Tasks: Add Google Analytics Tracking

**Input**: Design documents from `/specs/005-add-google-analytics/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Web app**: `frontend/src/`
- Paths assume frontend structure per plan.md

## Phase 3.1: Setup
- [x] T001 Configure Google Analytics measurement ID in frontend environment variables
- [x] T002 Set up GA initialization in main App component

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [x] T003 [P] Integration test for page view tracking in frontend/tests/integration/test-ga-page-views.js
- [x] T004 [P] Integration test for search event tracking in frontend/tests/integration/test-ga-search-events.js
- [x] T005 [P] Integration test for model selection event tracking in frontend/tests/integration/test-ga-model-events.js
- [x] T006 [P] Integration test for theme toggle event tracking in frontend/tests/integration/test-ga-theme-events.js
- [x] T007 [P] Integration test for ad blocker handling in frontend/tests/integration/test-ga-adblocker.js

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [x] T008 Initialize GA4 in frontend/src/App.tsx
- [x] T009 [P] Add search event tracking to frontend/src/components/SearchBar.tsx
- [x] T010 [P] Add model selection event tracking to frontend/src/components/ModelCard.tsx
- [x] T011 [P] Add theme toggle event tracking to frontend/src/components/ThemeToggle.tsx
- [x] T012 Implement custom event tracking utility in frontend/src/utils/analytics.ts

## Phase 3.4: Integration
- [x] T013 Implement ad blocker detection and error handling in frontend/src/utils/analytics.ts
- [x] T014 Add GA script loading with lazy initialization

## Phase 3.5: Polish
- [x] T015 [P] Unit tests for analytics utility functions in frontend/tests/unit/test-analytics.js
- [x] T016 Performance verification (<50ms impact)
- [x] T017 [P] Update README.md with GA tracking information
- [x] T018 Run quickstart.md validation scenarios

## Dependencies
- Tests (T003-T007) before implementation (T008-T014)
- T012 blocks T009-T011 (utility needed first)
- T013 blocks T014
- Implementation before polish (T015-T018)

## Parallel Example
```
# Launch T003-T007 together:
Task: "Integration test for page view tracking in frontend/tests/integration/test-ga-page-views.js"
Task: "Integration test for search event tracking in frontend/tests/integration/test-ga-search-events.js"
Task: "Integration test for model selection event tracking in frontend/tests/integration/test-ga-model-events.js"
Task: "Integration test for theme toggle event tracking in frontend/tests/integration/test-ga-theme-events.js"
Task: "Integration test for ad blocker handling in frontend/tests/integration/test-ga-adblocker.js"

# Launch T009-T011 together:
Task: "Add search event tracking to frontend/src/components/SearchBar.tsx"
Task: "Add model selection event tracking to frontend/src/components/ModelCard.tsx"
Task: "Add theme toggle event tracking to frontend/src/components/ThemeToggle.tsx"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - No contracts - no contract tests

2. **From Data Model**:
   - Event types → tracking implementation tasks

3. **From User Stories**:
   - Each interaction → event tracking task
   - Quickstart scenarios → integration tests

4. **Ordering**:
   - Setup → Tests → Core → Integration → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All contracts have corresponding tests (N/A)
- [x] All entities have model tasks (event types handled in utils)
- [x] All tests come before implementation
- [x] Parallel tasks truly independent
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task