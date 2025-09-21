# Tasks: Enable Cache on Backend Side

**Input**: Design documents from `/specs/004-enable-cache-on/`
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
- **Web app**: `backend/src/`, `backend/tests/`
- Paths shown below follow the backend structure from plan.md

## Phase 3.1: Setup
- [x] T001 Install node-cache dependency in backend/package.json
- [ ] T002 [P] Configure ESLint rules for cache-related code in backend/.eslintrc.js

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [x] T003 [P] Contract test POST /api/cache/invalidate in backend/tests/contract/test-cache-invalidate.js
- [x] T004 [P] Contract test GET /api/cache/stats in backend/tests/contract/test-cache-stats.js
- [x] T005 [P] Integration test cache hit scenario in backend/tests/integration/test-cache-hit.js
- [x] T006 [P] Integration test cache miss scenario in backend/tests/integration/test-cache-miss.js
- [x] T007 [P] Integration test cache expiration in backend/tests/integration/test-cache-expiration.js

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [x] T008 [P] Create CacheService in backend/src/services/cacheService.js
- [x] T009 Integrate cache in ModelService for fetchAllModels in backend/src/services/modelService.js
- [x] T010 Integrate cache in ModelService for getModelById in backend/src/services/modelService.js
- [x] T011 Create cache middleware in backend/src/middleware/cache.js

## Phase 3.4: Integration
- [x] T012 Add cache routes in backend/src/routes/cache.js
- [x] T013 Integrate cache middleware in models routes in backend/src/routes/models.js
- [x] T014 Add cache statistics logging in backend/src/app.js

## Phase 3.5: Polish
- [x] T015 [P] Unit tests for CacheService in backend/tests/unit/test-cacheService.js
- [x] T016 Performance tests for cache operations in backend/tests/integration/test-cache-performance.js
- [x] T017 [P] Update API documentation for cache endpoints in backend/README.md
- [x] T018 Run quickstart validation scenarios from specs/004-enable-cache-on/quickstart.md

## Dependencies
- Tests (T003-T007) before implementation (T008-T014)
- T008 blocks T009, T010
- T011 blocks T013
- T012 blocks T014
- Implementation before polish (T015-T018)

## Parallel Example
```
# Launch T003-T007 together:
Task: "Contract test POST /api/cache/invalidate in backend/tests/contract/test-cache-invalidate.js"
Task: "Contract test GET /api/cache/stats in backend/tests/contract/test-cache-stats.js"
Task: "Integration test cache hit scenario in backend/tests/integration/test-cache-hit.js"
Task: "Integration test cache miss scenario in backend/tests/integration/test-cache-miss.js"
Task: "Integration test cache expiration in backend/tests/integration/test-cache-expiration.js"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - Each contract file → contract test task [P]
   - Each endpoint → implementation task

2. **From Data Model**:
   - Each entity → model creation task [P]
   - Relationships → service layer tasks

3. **From User Stories**:
   - Each story → integration test [P]
   - Quickstart scenarios → validation tasks

4. **Ordering**:
   - Setup → Tests → Models → Services → Endpoints → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All contracts have corresponding tests
- [x] All entities have model tasks
- [x] All tests come before implementation
- [x] Parallel tasks truly independent
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task