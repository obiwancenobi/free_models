# Tasks: Create a Web App for Free AI Models

**Input**: Design documents from `/specs/001-create-a-web/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/
**Available Docs**: research.md, data-model.md, contracts/, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
   → quickstart.md: Extract test scenarios → integration test tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: backend API, frontend components
   → Integration: API connections, search logic
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
- **Backend**: `backend/src/`, `backend/tests/`
- **Frontend**: `frontend/src/`, `frontend/tests/`
- Paths shown below assume project structure from plan.md

## Phase 3.1: Setup
- [x] T001 Create project structure per implementation plan
- [x] T002 Initialize backend Node.js project with Express dependencies
- [x] T003 Initialize frontend React project with Material-UI dependencies
- [x] T004 [P] Configure linting and formatting tools for both projects

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [x] T005 [P] Contract test GET /api/models in backend/tests/contract/test-models.js
- [x] T006 [P] Integration test model list loading in frontend/tests/integration/test-model-list.js
- [x] T007 [P] Integration test search functionality in frontend/tests/integration/test-search.js
- [x] T008 [P] Integration test bottom sheet details in frontend/tests/integration/test-model-details.js

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [x] T009 Create backend API endpoint GET /api/models in backend/src/routes/models.js
- [x] T010 Create AI Model service in backend/src/services/modelService.js
- [x] T011 [P] Create ModelCard component in frontend/src/components/ModelCard.tsx
- [x] T012 [P] Create ModelList component in frontend/src/components/ModelList.tsx
- [x] T013 [P] Create SearchBar component in frontend/src/components/SearchBar.tsx
- [x] T014 [P] Create ModelDetails bottom sheet in frontend/src/components/ModelDetails.tsx
- [x] T015 Create main App component in frontend/src/App.tsx

## Phase 3.4: Integration
- [x] T016 Create API service in frontend/src/services/apiService.ts
- [x] T017 Implement client-side search logic in frontend/src/components/ModelList.tsx
- [x] T018 Add error handling and loading states in frontend/src/components/
- [x] T019 Connect backend to OpenRouter API in backend/src/services/modelService.js

## Phase 3.5: Polish
- [x] T020 [P] Unit tests for ModelCard in frontend/tests/unit/test-ModelCard.js
- [x] T021 [P] Unit tests for SearchBar in frontend/tests/unit/test-SearchBar.js
- [x] T022 Performance optimization and bundle analysis
- [x] T023 Update API documentation
- [x] T024 Create deployment configuration

## Dependencies
- Setup tasks (T001-T004) before all other tasks
- Test tasks (T005-T008) before implementation tasks (T009-T015)
- Backend tasks (T009-T010) before frontend integration (T016-T019)
- Core implementation (T009-T015) before integration (T016-T019)
- All tasks before polish (T020-T024)

## Parallel Example
```
# Launch T005-T008 together (contract and integration tests):
Task: "Contract test GET /api/models in backend/tests/contract/test-models.js"
Task: "Integration test model list loading in frontend/tests/integration/test-model-list.js"
Task: "Integration test search functionality in frontend/tests/integration/test-search.js"
Task: "Integration test bottom sheet details in frontend/tests/integration/test-model-details.js"

# Launch T011-T014 together (frontend components):
Task: "Create ModelCard component in frontend/src/components/ModelCard.js"
Task: "Create ModelList component in frontend/src/components/ModelList.js"
Task: "Create SearchBar component in frontend/src/components/SearchBar.js"
Task: "Create ModelDetails bottom sheet in frontend/src/components/ModelDetails.js"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Follow TDD: Red-Green-Refactor cycle
- Use absolute paths for all file operations

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - models-api.yaml → contract test task [P]
   - GET /api/models → implementation task

2. **From Data Model**:
   - AI Model entity → component creation tasks [P]
   - State management → service tasks

3. **From User Stories**:
   - Each acceptance scenario → integration test [P]
   - Quickstart scenarios → validation tasks

4. **Ordering**:
   - Setup → Tests → Backend → Frontend → Integration → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [ ] All contracts have corresponding tests
- [ ] All entities have component tasks
- [ ] All tests come before implementation
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task