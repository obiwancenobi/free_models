
# Implementation Plan: Add Dynamic Theme

**Branch**: `002-add-dynamic-theme` | **Date**: 2025-09-20 | **Spec**: specs/002-add-dynamic-theme/spec.md
**Input**: Feature specification from `/specs/002-add-dynamic-theme/spec.md`

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
Implement dynamic theme switching for the web application, defaulting to system theme preference, with manual override via an icon button in the top right corner. Use React context for state management, CSS custom properties for theming, and localStorage for persistence.

## Technical Context
**Language/Version**: TypeScript 4.9+, React 18
**Primary Dependencies**: React, styled-components or CSS modules
**Storage**: localStorage for user theme preference
**Testing**: Jest, React Testing Library
**Target Platform**: Modern web browsers
**Project Type**: Web application (frontend + backend)
**Performance Goals**: Instant theme switching (<50ms)
**Constraints**: Use icon button on top right to change theme, no page reload required, persist across sessions, responsive design
**Scale/Scope**: Single feature affecting UI components

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Responsive Design: Theme icon button positioned responsively, theme applies across all devices
- [x] Performance Optimization: Instant theme switching with minimal bundle impact
- [x] Security First: N/A - theme feature doesn't involve security concerns
- [x] User-Centric Experience: Theme preference respects system setting and allows manual override
- [x] Scalability and Maintainability: Modular theme context and CSS variables for easy maintenance

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure]
```

**Structure Decision**: Option 2: Web application (frontend + backend detected)

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
    - System theme detection in browsers
    - React theming patterns and best practices
    - CSS variables vs styled-components for dynamic theming
    - localStorage persistence patterns
    - Responsive icon button positioning

2. **Generate and dispatch research agents**:
    ```
    Task: "Research system theme detection in modern browsers"
    Task: "Find best practices for React theming with CSS variables"
    Task: "Research localStorage patterns for user preferences"
    Task: "Find patterns for responsive icon buttons in React apps"
    ```

3. **Consolidate findings** in `research.md` using format:
    - Decision: Use window.matchMedia for system theme detection
    - Rationale: Native browser API, no dependencies
    - Alternatives considered: Third-party libraries like 'prefers-color-scheme-polyfill'
    - Decision: CSS custom properties with React context
    - Rationale: Performance, maintainability, no runtime overhead
    - Alternatives considered: styled-components, emotion
    - Decision: localStorage with JSON serialization
    - Rationale: Simple, persistent, widely supported
    - Alternatives considered: IndexedDB, cookies
    - Decision: Position-fixed icon button with responsive adjustments
    - Rationale: Always visible, adapts to screen size
    - Alternatives considered: Header integration, drawer menu

**Output**: research.md with all unknowns resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
    - Theme entity: type (light/dark/system), current value
    - UserPreference entity: theme choice, persistence
    - Validation: theme type must be valid enum

2. **Generate API contracts** from functional requirements:
    - No API endpoints required (frontend-only feature)
    - Output note in `/contracts/` indicating client-side only

3. **Generate contract tests** from contracts:
    - No contract tests needed (no APIs)
    - Integration tests will cover theme functionality

4. **Extract test scenarios** from user stories:
    - System theme detection scenario
    - Manual theme switching scenario
    - Persistence across sessions scenario
    - Quickstart test = theme switching validation steps

5. **Update agent file incrementally** (O(1) operation):
    - Run `.specify/scripts/bash/update-agent-context.sh opencode` for your AI assistant
    - Add React theming patterns and CSS variables
    - Preserve manual additions between markers
    - Update recent changes (keep last 3)
    - Keep under 150 lines for token efficiency
    - Output to repository root

**Output**: data-model.md, /contracts/*, quickstart.md, updated agent file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (data model, quickstart)
- Theme context → context creation task [P]
- Theme hook → custom hook task [P]
- Theme provider → provider component task
- Icon button → UI component task [P]
- CSS variables → styling task [P]
- localStorage utils → utility task [P]
- System theme detection → detection utility task [P]
- Each acceptance scenario → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:
- TDD order: Tests before implementation
- Dependency order: Utils → Context → Components → Integration
- Mark [P] for parallel execution (independent files)
- Theme context must be created before components

**Estimated Output**: 15-20 numbered, ordered tasks in tasks.md

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
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


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
- [ ] Complexity deviations documented

---
*Based on Constitution v1.0.0 - See `/memory/constitution.md`*
