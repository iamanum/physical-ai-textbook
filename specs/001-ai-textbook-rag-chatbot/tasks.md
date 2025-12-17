---

description: "Task list for implementing Physical AI & Humanoid Robotics textbook with RAG chatbot using OpenAI Agent SDK and Cohere embeddings"
---

# Tasks: AI Physical AI & Humanoid Robotics Textbook with RAG Chatbot

**Input**: Design documents from `/specs/001-ai-textbook-rag-chatbot/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/`, `backend/`, `scripts/`
- Paths shown based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization with Python 3.12, uv, and basic structure

- [X] T101 [P] Setup Python 3.12 with .python-version file in backend/
- [X] T102 [P] Create pyproject.toml with dependencies in backend/
- [X] T103 [P] Create requirements.txt based on pyproject.toml in backend/
- [X] T104 Create .env.example with required env vars in backend/
- [X] T105 Create main.py FastAPI application in backend/
- [X] T106 Create src directory structure in backend/src/
- [X] T107 [P] Create agents, tools, and embeddings subdirectories in backend/src/
- [X] T108 Create Dockerfile for containerization in backend/
- [X] T109 Create comprehensive README.md for backend/

**Checkpoint**: Backend structure ready with proper Python 3.12 setup

---

## Phase 2: Foundational Components (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T110 [P] Implement textbook embedder in backend/src/embeddings/textbook_embedder.py
- [X] T111 [P] Configure Qdrant client and Cohere integration in textbook_embedder.py
- [X] T112 [P] Create textbook search tool in backend/src/tools/textbook_search_tool.py
- [X] T113 [P] Create collection info tool in backend/src/tools/collection_info_tool.py
- [X] T114 [P] Implement RAG agent with OpenAI Agent SDK in backend/src/agents/rag_agent.py
- [X] T115 [P] Add guardrails and query validation to RAG agent
- [X] T116 Configure environment loading and validation in main.py
- [X] T117 Set up FastAPI routing and model definitions in main.py

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Get AI-Powered Answers from Textbook (Priority: P1) 🎯 MVP

**Goal**: Allow users to ask questions about textbook content and receive AI-generated responses based on the textbook using OpenAI Agent SDK

**Independent Test**: Ask questions about textbook content and verify responses are generated from actual textbook content with proper citations

### Implementation for User Story 1

- [X] T118 [P] [US1] Create POST /query endpoint in main.py
- [X] T119 [US1] Connect query endpoint to RAG agent for processing
- [X] T120 [US1] Implement response formatting with sources in main.py
- [X] T121 [US1] Add error handling for query processing in main.py
- [X] T122 [US1] Test guardrail functionality for out-of-scope questions
- [X] T123 [US1] Add intermediate step tracking for transparency
- [X] T124 [US1] Verify source citation extraction works properly

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Embed Textbook Content (Priority: P1)

**Goal**: Enable administrators to embed textbook content from a URL into the vector store

**Independent Test**: Provide a textbook URL and verify that content is properly embedded into the vector database

### Implementation for User Story 2

- [X] T125 [P] [US2] Create POST /embed-textbook endpoint in main.py
- [X] T126 [US2] Connect endpoint to textbook embedder functionality
- [X] T127 [US2] Implement URL content loading and parsing
- [X] T128 [US2] Add batch processing for efficient embedding
- [X] T129 [US2] Implement progress tracking and chunk counting
- [X] T130 [US2] Add error handling for embedding process
- [X] T131 [US2] Create collection information endpoint for status checking

**Checkpoint**: At this point, User Story 2 should be fully functional and testable independently

---

## Phase 5: User Story 3 - Access RAG via API (Priority: P2)

**Goal**: Provide clean API endpoints for developers to integrate the RAG system

**Independent Test**: Make API calls and verify proper responses and error handling

### Implementation for User Story 3

- [X] T132 [P] [US3] Enhance API documentation with FastAPI's automatic docs
- [X] T133 [US3] Add request/response validation using Pydantic models
- [X] T134 [US3] Implement health check endpoint in main.py
- [X] T135 [US3] Add proper HTTP status codes and error responses
- [X] T136 [US3] Create API usage examples in README.md
- [X] T137 [US3] Implement comprehensive logging in backend components

**Checkpoint**: At this point, User Story 3 should be fully functional and testable independently

---

## Phase 6: User Story 4 - Experience Fast Response Times (Priority: P2)

**Goal**: Optimize the application to ensure responses are returned within acceptable time frames

**Independent Test**: Measure response times for various queries and verify they meet performance requirements

### Implementation for User Story 4

- [X] T138 [P] [US4] Add startup event initialization for agent and embedder in main.py
- [X] T139 [US4] Optimize embedding batch processing in textbook_embedder.py
- [X] T140 [US4] Implement connection pooling for Qdrant client
- [X] T141 [US4] Add performance logging and timing metrics
- [X] T142 [US4] Optimize agent tool usage and intermediate steps
- [X] T143 [US4] Test concurrent query handling capabilities

**Checkpoint**: At this point, User Story 4 should be fully functional and testable independently

---

## Phase 7: User Story 5 - Ensure Content Safety and Accuracy (Priority: P3)

**Goal**: Ensure responses are accurate and safe with proper guardrails

**Independent Test**: Ask various types of questions and verify responses are accurate and inappropriate queries are handled properly

### Implementation for User Story 5

- [X] T144 [P] [US5] Enhance guardrails in RAG agent for topic relevance
- [X] T145 [US5] Improve pre-validation for user queries in rag_agent.py
- [X] T146 [US5] Add more comprehensive inappropriate keyword detection
- [X] T147 [US5] Enhance agent instructions to emphasize textbook-only responses
- [X] T148 [US5] Test edge cases for content safety
- [X] T149 [US5] Document safety mechanisms in README.md

**Checkpoint**: At this point, User Story 5 should be fully functional and testable independently

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T150 [P] Update all documentation to reflect new architecture
- [X] T151 Add comprehensive error handling across all components
- [X] T152 Add unit tests for core backend services in backend/tests/
- [X] T153 Create quickstart guide in backend/README.md
- [X] T154 Add proper logging to all components
- [ ] T155 [P] Add integration tests for all user stories
- [ ] T156 Set up GitHub Actions for automated testing in .github/workflows/
- [ ] T157 [P] Run comprehensive validation to ensure setup instructions work

**Checkpoint**: All user stories should now be thoroughly tested and production-ready

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1/US2/US3 but should be independently testable
- **User Story 5 (P3)**: Can start after Foundational (Phase 2) - May integrate with all previous stories but should be independently testable

### Within Each User Story

- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1 & 2

```bash
# Launch all services for User Story 1 together:
Task: "Create POST /query endpoint in main.py"
Task: "Connect query endpoint to RAG agent for processing"

# Launch all services for User Story 2 together:
Task: "Create POST /embed-textbook endpoint in main.py"
Task: "Connect endpoint to textbook embedder functionality"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 - Query processing
4. Complete Phase 4: User Story 2 - Textbook embedding
5. **STOP and VALIDATE**: Test User Stories 1 & 2 together
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 & 2 → Test together → Deploy/Demo (MVP!)
3. Add User Story 3 → Test independently → Deploy/Demo
4. Add User Story 4 → Test independently → Deploy/Demo
5. Add User Story 5 → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
   - Developer D: User Story 4 & 5
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify that each phase is working before moving to next
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence