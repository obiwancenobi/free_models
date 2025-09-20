# Implementation Plan: Add Sorting Feature

**Branch**: `003-add-sorting-feature` | **Date**: 2025-09-20 | **Spec**: /specs/003-add-sorting-feature/spec.md
**Input**: Feature specification from /specs/003-add-sorting-feature/spec.md

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Add sorting functionality to the model list allowing users to sort by created date (newest/oldest) and context length (highest/lowest) using icon buttons positioned to the right of the search input field. Sorting must preserve order during search and handle models with missing data gracefully.

## Technical Context
**Language/Version**: TypeScript 4.9+ / React 18+ for frontend, Node.js 18+ for backend  
**Primary Dependencies**: React, Material-UI (@mui/material), Express, Axios  
**Storage**: N/A (client-side sorting)  
**Testing**: Jest, React Testing Library, Supertest  
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge)  
**Project Type**: web (frontend + backend)  
**Performance Goals**: Sorting completes in <100ms for 1000 models  
**Constraints**: Maintain search functionality, handle missing created date/context length, responsive design  
**Scale/Scope**: Small UI feature, affects ModelList component, ~100-1000 models

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Responsive Design: Sorting buttons will use Material-UI responsive components
- [x] Performance Optimization: Client-side sorting with efficient algorithms
- [x] Security First: No security implications for UI sorting feature
- [x] User-Centric Experience: Icon buttons with tooltips for accessibility
- [x] Scalability and Maintainability: Modular sorting logic in React hooks

## Project Structure

### Documentation (this feature)
```
specs/003-add-sorting-feature/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/

frontend/
├── src/
│   ├── components/
│   │   ├── ModelList.tsx (modify)
│   │   ├── ModelCard.tsx (no changes)
│   │   └── SearchBar.tsx (modify for positioning)
│   ├── hooks/
│   │   └── useSorting.ts (new)
│   └── services/
```

**Structure Decision**: Option 2: Web application (frontend + backend detected)

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - Material-UI sort icons availability and usage
   - React sorting performance for large lists
   - Handling missing data in sort comparisons
   - Positioning icon buttons next to search input responsively

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research Material-UI sort icons and responsive button positioning"
     Task: "Research efficient sorting algorithms in React for model lists"
     Task: "Research handling missing data in JavaScript sort functions"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: Use Material-UI SortIcon and ArrowUpward/ArrowDownward icons
   - Rationale: Consistent with Material Design, accessible
   - Alternatives considered: Custom SVG icons, text buttons

**Output**: research.md with all unknowns resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Model entity (existing): id, name, created, context_length
   - Sort state: sortBy (date|context), sortOrder (asc|desc)
   - Validation: Handle undefined/null created dates

2. **Generate API contracts** from functional requirements:
   - No new API endpoints required (client-side sorting)
   - Existing /api/models endpoint sufficient

3. **Generate contract tests** from contracts:
   - No new contract tests (no new APIs)

4. **Extract test scenarios** from user stories:
   - Sort by date ascending/descending
   - Sort by context ascending/descending
   - Sort with search active
   - Handle models without created date

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh opencode` for opencode
   - Add sorting feature to recent changes
   - Preserve manual additions

**Output**: data-model.md, /contracts/* (minimal), quickstart.md, AGENTS.md updated

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs
- Create sorting hook: useSorting.ts [P]
- Modify ModelList.tsx to integrate sorting [P]
- Modify SearchBar.tsx for button positioning [P]
- Add unit tests for sorting logic
- Add integration tests for sort + search

**Ordering Strategy**:
- TDD order: Tests before implementation
- Dependency order: Hook before components
- Mark [P] for parallel execution

**Estimated Output**: 8-12 numbered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented

---
*Based on Constitution v1.0.0 - See `/memory/constitution.md`*
