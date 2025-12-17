<!--
Sync Impact Report:
- Version change: 0.1.0 → 1.0.0
- Modified principles: All principles completely redefined for Physical AI & Humanoid Robotics Textbook project
- Added sections: Content Accuracy & RAG Quality, AI Integration, Deployment & Documentation Standards
- Removed sections: None
- Templates requiring updates:
  - .specify/templates/plan-template.md ✅ updated
  - .specify/templates/spec-template.md ✅ updated
  - .specify/templates/tasks-template.md ✅ updated
  - .specify/commands/*.toml ⚠ pending review
- Follow-up TODOs: None

Rationale for version bump: MAJOR - this is a complete redefinition of principles for the new project
-->

# Physical AI & Humanoid Robotics Textbook Constitution

## Core Principles

### I. Content Accuracy & RAG Quality (NON-NEGOTIABLE)
All textbook content must be technically accurate, thoroughly reviewed by domain experts, and validated through the RAG system. Every chapter must be testable for factual correctness and chatbot retrieval accuracy. RAG responses must cite sources and maintain precision when answering user queries about Physical AI and Humanoid Robotics.

### II. Modular Documentation Architecture
Every chapter and section must be modular and independently accessible via Docusaurus. Content should follow a clear hierarchy that supports both sequential reading and random access. Each module should be self-contained enough to stand alone while linking cohesively to the broader textbook.

### III. Test-Driven Content Development (NON-NEGOTIABLE)
Content development follows a test-first approach: Learning objectives defined → Test questions created → Content written to meet objectives → Tests validated. RAG functionality must be tested with defined accuracy metrics before each deployment. Every new section must include verification queries to ensure retrieval quality.

### IV. AI Integration Excellence
The RAG chatbot must provide accurate, contextual responses leveraging the textbook content. All AI interactions should maintain a clear distinction between textbook facts and speculative content. The system must gracefully handle queries outside the textbook scope with appropriate disclaimers.

### V. Open Source & Reproducible Standards
All code, documentation, and deployment processes must be fully reproducible from the public repository. Installation and setup should follow the principle of "works on anyone's machine with minimal configuration". Dependencies must be version-locked and deployment scripts idempotent.

### VI. Accessibility & Education-First Design
All content and interfaces must be accessible to diverse learning styles and technical backgrounds. The textbook should provide multiple pathways through the material, supporting both novice learners and advanced practitioners. User experience should prioritize educational value over technical sophistication.

## Technology Stack Requirements

The project must use Docusaurus for documentation, FastAPI for backend services, Qdrant for vector storage, Neon for PostgreSQL database, and OpenAI agents for chat functionality. All components must be containerized using Docker to ensure consistent environments across development, testing, and production.

## Development Workflow

All contributions must undergo peer review with at least one domain expert. New content requires fact-checking and technical validation. Pull requests must include updates to both textbook content and associated RAG test cases. Feature branches should be short-lived with atomic commits that maintain system functionality.

## Governance

This constitution governs all development activities for the Physical AI & Humanoid Robotics Textbook project. Amendments require documentation of technical rationale and approval from the core maintainers. All PRs and reviews must verify compliance with these principles. New features must demonstrate clear educational value before acceptance.

**Version**: 1.0.0 | **Ratified**: 2025-12-07 | **Last Amended**: 2025-12-07
