# Tasks: Add Sorting Feature

**Input**: Design documents from `/specs/003-add-sorting-feature/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/, quickstart.md

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
- **Web app**: `frontend/src/`, `backend/src/`
- Paths shown below assume web app structure from plan.md

## Phase 3.1: Setup
- [ ] T001 Verify project dependencies (React 18+, Material-UI 5+, TypeScript 4.9+)
- [ ] T002 [P] Configure TypeScript interfaces for sorting in frontend/src/types/sorting.ts

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T003 [P] Integration test sort by created date in frontend/tests/integration/test-sort-created-date.js
- [ ] T004 [P] Integration test sort by context length in frontend/tests/integration/test-sort-context-length.js
- [ ] T005 [P] Integration test sort with search active in frontend/tests/integration/test-sort-with-search.js
- [ ] T006 [P] Integration test handle missing data in frontend/tests/integration/test-sort-missing-data.js

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T007 [P] Create useSorting hook in frontend/src/hooks/useSorting.ts
- [ ] T008 [P] Add SortState interface to frontend/src/types/sorting.ts
- [ ] T009 Modify ModelList component to integrate sorting in frontend/src/components/ModelList.tsx
- [ ] T010 Modify SearchBar component to add sort buttons in frontend/src/components/SearchBar.tsx
- [ ] T011 Update ModelCard to display sort indicators in frontend/src/components/ModelCard.tsx

## Phase 3.4: Integration
- [ ] T012 Test sorting integration with existing search functionality
- [ ] T013 Verify responsive design of sort buttons on mobile

## Phase 3.5: Polish
- [ ] T014 [P] Unit tests for sorting logic in frontend/tests/unit/test-sorting-logic.js
- [ ] T015 [P] Unit tests for useSorting hook in frontend/tests/unit/test-useSorting.js
- [ ] T016 Performance tests for sorting large model lists
- [ ] T017 [P] Update component documentation in frontend/README.md
- [ ] T018 Accessibility testing for sort buttons (ARIA labels, keyboard navigation)
- [ ] T019 Execute quickstart.md validation scenarios

## Dependencies
- Tests (T003-T006) before implementation (T007-T011)
- T008 blocks T007 (interface needed for hook)
- T007 blocks T009, T010 (hook needed for components)
- T009 blocks T012 (ModelList integration needed)
- T010 blocks T012 (SearchBar buttons needed)
- Implementation before polish (T014-T019)

## Parallel Example
```
# Launch T003-T006 together:
Task: "Integration test sort by created date in frontend/tests/integration/test-sort-created-date.js"
Task: "Integration test sort by context length in frontend/tests/integration/test-sort-context-length.js"
Task: "Integration test sort with search active in frontend/tests/integration/test-sort-with-search.js"
Task: "Integration test handle missing data in frontend/tests/integration/test-sort-missing-data.js"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts
- Sorting is client-side, no backend changes needed

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - No new contracts → no contract test tasks

2. **From Data Model**:
   - SortState entity → interface creation task [P]
   - Model entity → integration tasks (existing)

3. **From User Stories**:
   - Each story → integration test [P]
   - Quickstart scenarios → validation tasks

4. **Ordering**:
   - Setup → Tests → Interfaces → Hooks → Components → Integration → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All contracts have corresponding tests (none needed)
- [x] All entities have model tasks (SortState interface)
- [x] All tests come before implementation
- [x] Parallel tasks truly independent
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task