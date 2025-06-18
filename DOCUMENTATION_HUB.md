# 🗺️ Alchemorsel Documentation Hub

**Master navigation for all project documentation. This is your single source of truth for understanding where information lives and how to proceed with development.**

---

## 🎯 **For AI Models & Developers**

When working on Alchemorsel, follow this decision tree:

```
What do you need to do?
├── 🔍 Understand the project? → Start with [CLAUDE.md](#project-overview)
├── 🐛 Fix a bug? → Go to [Bugs Tracking](#bug-tracking)
├── 🚀 Build a feature? → Check [Features Tracking](#feature-tracking)  
├── 🩹 Quick fix/polish? → See [Patches Tracking](#patch-tracking)
├── 🔧 Infrastructure work? → View [Improvements Tracking](#improvement-tracking)
├── 📝 Report new issue? → Use [Issue Intake Process](#issue-intake--parsing)
├── 🔍 Analyze codebase? → Use [Codebase Analysis](#codebase-analysis)
├── 🚀 Ready to code? → Follow [Ready to Implement](#ready-to-implement)
├── 🔧 Check environment? → Use [Environment Verification](#environment-verification)
├── 🏗️ Implement something? → Follow [Development Workflow](#development-process)
├── ✅ Verify completion? → Use [Completion Verification](#completion-verification)
├── 🚀 Plan deployment? → See [MVP GAMEPLAN](#mvp-deployment-gameplan)
├── 🧪 Run tests? → Check [Testing Guides](#testing--qa)
└── 📋 Understand user needs? → See [User Stories](#user-stories--requirements)
```

---

## 📋 **Project Overview**

### 🏠 **Start Here**
- **[CLAUDE.md](./CLAUDE.md)** - 🎯 **Primary reference for AI assistants**
  - Project structure and architecture
  - Development commands and workflows  
  - Coding guidelines and conventions
  - Version management guidelines

---

## 🎯 **Granular Work Tracking**

### 🐛 **Bug Tracking**
- **[docs/tracking/BUGS.md](./docs/tracking/BUGS.md)** - 🚨 **Active bug reports**
  - Critical MVP blockers requiring immediate attention
  - Detailed bug reports with reproduction steps
  - Status tracking and assignment
  - **Current Status**: 8 active bugs (4 critical, 2 high, 2 medium)

### 🚀 **Feature Tracking**  
- **[docs/tracking/FEATURES.md](./docs/tracking/FEATURES.md)** - 🎯 **New feature development**
  - MVP features vs. future enhancements
  - Detailed requirements and acceptance criteria
  - Development effort estimates
  - **Current Status**: 4 MVP features in planning, 4 future features in backlog

### 🩹 **Patch Tracking**
- **[docs/tracking/PATCHES.md](./docs/tracking/PATCHES.md)** - ⚡ **Quick fixes & polish**
  - Small improvements (< 4 hours effort)
  - UI polish and workflow enhancements  
  - High-impact, low-effort wins
  - **Current Status**: 3 active patches ready for implementation

### 🔧 **Improvement Tracking**
- **[docs/tracking/IMPROVEMENTS.md](./docs/tracking/IMPROVEMENTS.md)** - 🏗️ **Infrastructure & technical debt**
  - Performance optimization
  - Mobile responsiveness 
  - Security enhancements
  - Technical debt cleanup
  - **Current Status**: 6 improvements planned (2 high priority)

---

## 📋 **User Stories & Requirements**

### 📖 **Complete Feature Catalog**
- **[docs/planning/STORIES.md](./docs/planning/STORIES.md)** - 🎯 **Comprehensive user stories & workflows**
  - 220+ user stories organized by user type
  - Implementation status (✅ ⚠️ ❌ 🔄)
  - MVP vs Future feature classification
  - Critical gaps identified for MVP readiness

### 📈 **Current MVP Status**: ~55% complete

---

## 🔄 **Development Process**

### 📝 **Issue Intake & Parsing**
- **[docs/processes/INTAKE_PARSER.md](./docs/processes/INTAKE_PARSER.md)** - 📥 **New issue processing**
  - Systematic parsing of user reports into structured items
  - Automatic classification (bug/feature/patch/improvement)
  - File discovery guidance for affected components
  - Test planning and user story mapping

### 🔍 **Codebase Analysis**
- **[docs/processes/CODEBASE_ANALYSIS.md](./docs/processes/CODEBASE_ANALYSIS.md)** - 🔍 **Code pattern discovery**
  - Systematic analysis of existing code patterns
  - Integration point identification
  - Dependency mapping and architecture discovery
  - Pattern recognition for consistent implementation

### 🏗️ **Implementation Generation**
- **[docs/processes/IMPLEMENTATION_GENERATOR.md](./docs/processes/IMPLEMENTATION_GENERATOR.md)** - 🏭 **Automated artifact generation**
  - Generate tracking entries from specifications
  - Create comprehensive test plans
  - Generate code templates and checklists
  - Branch strategy and commit templates

### 🚀 **Ready to Implement**
- **[docs/processes/READY_TO_IMPLEMENT.md](./docs/processes/READY_TO_IMPLEMENT.md)** - 🚀 **Implementation bridge**
  - Consolidate requirements into actionable plans
  - Create execution checklists and sequences
  - Bridge between planning and actual coding
  - Progress tracking and validation

### 🔧 **Environment Verification**
- **[docs/processes/ENVIRONMENT_CHECKLIST.md](./docs/processes/ENVIRONMENT_CHECKLIST.md)** - 🔧 **Environment health**
  - Systematic dev environment verification
  - Service health checks and validation
  - Configuration and secrets verification
  - Troubleshooting common environment issues

### 🔄 **Development Workflow**
- **[docs/processes/DEVELOPMENT_WORKFLOW.md](./docs/processes/DEVELOPMENT_WORKFLOW.md)** - 📋 **Step-by-step development process**
  - Test-driven development approach
  - Local testing → CI pipeline → deployment
  - Quality gates and success criteria
  - Branch naming and commit conventions

### ✅ **Completion Verification**
- **[docs/processes/COMPLETION_VERIFICATION.md](./docs/processes/COMPLETION_VERIFICATION.md)** - ✅ **Systematic validation**
  - Comprehensive completion checklist
  - Acceptance criteria verification
  - Quality gates and regression testing
  - Manual testing and final validation

---

## 🚀 **MVP Deployment Gameplan**

**For detailed 4-week deployment plan, see: [docs/planning/MVP_GAMEPLAN.md](./docs/planning/MVP_GAMEPLAN.md)**

### **Quick Overview:**
- **Week 1**: Critical bug fixes and blockers
- **Week 2**: Essential MVP features 
- **Week 3**: MVP polish and optimization
- **Week 4**: Production deployment and go-live

---

## 🏗️ **Architecture & Technical**

### 📐 **System Design**
- **[frontend/frontend-architecture.md](./frontend/frontend-architecture.md)** - Frontend structure and patterns
- **[backend/README.md](./backend/README.md)** - Backend API documentation

### 🔄 **Legacy Planning Documents** *(Historical Reference)*
- **[TODO.md](./TODO.md)** - ⚠️ **DEPRECATED** - Old phase planning (Phase 1 completed)
  - *Note: Information moved to IMPROVEMENTS.md and STORIES.md*
- **[MORE-TODO.md](./MORE-TODO.md)** - ⚠️ **EMPTY** - Placeholder file

---

## 🛠️ **Infrastructure & DevOps**

### 🔄 **CI/CD Pipeline**
- **[docs/ci-cd/CI_SETUP.md](./docs/ci-cd/CI_SETUP.md)** - GitHub Actions workflow configuration
- **[docs/ci-cd/CI_PIPELINE_SUMMARY.md](./docs/ci-cd/CI_PIPELINE_SUMMARY.md)** - Pipeline overview and status

### 📧 **External Services**
- **[docs/EMAIL_SETUP.md](./docs/EMAIL_SETUP.md)** - Email service configuration
- **[docs/VERSION_MANAGEMENT.md](./docs/VERSION_MANAGEMENT.md)** - Release and versioning process

---

## 🧪 **Testing & QA**

### 🔍 **Testing Strategy**
- **[docs/testing/TESTING_EXPLANATION.md](./docs/testing/TESTING_EXPLANATION.md)** - Testing methodology and approach
- **[ui-tests/README.md](./ui-tests/README.md)** - UI testing setup and guidelines

### 🤖 **AI Development Assistance**
- **[docs/AGENTS.md](./docs/AGENTS.md)** - Root-level AI agent configurations
- **[backend/AGENTS.md](./backend/AGENTS.md)** - Backend-specific AI guidance
- **[frontend/AGENTS.md](./frontend/AGENTS.md)** - Frontend-specific AI guidance

---

## 🚨 **Critical Development Notes**

### ⚡ **Immediate Priorities**
1. **Profile system is broken** - Users cannot edit profiles or see correct data
2. **AI recipe generation has accuracy issues** - Search returning wrong results
3. **Email verification not enforced** - Security gap for recipe generation

### 🎯 **MVP Definition**
- **Core Features**: Authentication, Recipe CRUD, AI Generation, Basic Admin
- **Must Work**: Profile management, accurate search, email verification
- **Quality Bar**: Mobile responsive, stable navigation, proper error handling

### 📊 **Success Metrics**
- All MVP user stories marked ✅ in STORIES.md
- All HIGH priority items in IMPROVEMENTS.md resolved
- E2E test suite passing at 90%+
- Performance: Page loads under 2 seconds

---

## 🔄 **Document Maintenance**

### 📝 **Update Frequency**
- **IMPROVEMENTS.md**: After each testing session or bug report
- **STORIES.md**: When implementing new features or changing requirements
- **CLAUDE.md**: When development processes or architecture changes
- **This Hub**: When adding new documents or changing information architecture

### 🗂️ **Deprecation Policy**
- Mark outdated docs with ⚠️ **DEPRECATED** 
- Move historical information to archive folder if needed
- Always provide migration path to current documentation

---

## 🎯 **Quick Reference for Common Tasks**

### 🐛 **I found a bug**
1. Use [INTAKE_PARSER.md](./docs/processes/INTAKE_PARSER.md) to structure the report
2. Check if it's already in [BUGS.md](./docs/tracking/BUGS.md)
3. If new, create structured entry with acceptance criteria
4. Assess priority (Critical/High/Medium/Low) and MVP impact

### 🚀 **I want to build a feature**
1. Use [INTAKE_PARSER.md](./docs/processes/INTAKE_PARSER.md) to define requirements
2. Check [FEATURES.md](./docs/tracking/FEATURES.md) for similar features
3. Use [IMPLEMENTATION_GENERATOR.md](./docs/processes/IMPLEMENTATION_GENERATOR.md) to create artifacts
4. Follow [DEVELOPMENT_WORKFLOW.md](./docs/processes/DEVELOPMENT_WORKFLOW.md) for implementation

### 🩹 **I need a quick fix**
1. Check if it qualifies as a patch (< 4 hours)
2. Add to [PATCHES.md](./docs/tracking/PATCHES.md)
3. Follow simplified workflow for small changes
4. Focus on high-impact, low-effort improvements

### 🤖 **I'm an AI assistant helping with development**
1. Start with [CLAUDE.md](./CLAUDE.md) for project context
2. Use appropriate tracking file based on work type:
   - Bugs → [BUGS.md](./docs/tracking/BUGS.md)
   - Features → [FEATURES.md](./docs/tracking/FEATURES.md)
   - Patches → [PATCHES.md](./docs/tracking/PATCHES.md)
   - Infrastructure → [IMPROVEMENTS.md](./docs/tracking/IMPROVEMENTS.md)
3. For new issues, use [INTAKE_PARSER.md](./docs/processes/INTAKE_PARSER.md)
4. For implementation, use [IMPLEMENTATION_GENERATOR.md](./docs/processes/IMPLEMENTATION_GENERATOR.md)
5. Follow [DEVELOPMENT_WORKFLOW.md](./docs/processes/DEVELOPMENT_WORKFLOW.md) for execution

---

**Last Updated**: 2025-06-18  
**Next Review**: Weekly during active development  
**Maintainer**: Development Team