# 🩹 Patch Tracking

**Quick fixes, hotfixes, and small improvements for Alchemorsel**

## 🔥 **Active Patches**

### 🔴 **PATCH-001: Welcome Message Personalization**
- **Status**: 🔄 Ready
- **Priority**: High
- **Type**: UI Polish
- **Component**: Frontend Authentication Display
- **Description**: 
  - Change "Welcome, zach@alchemorsel.com" to "Welcome, Zach"
  - Extract first name from email or use actual name field
  - Ensure consistent format across all pages/views
- **Impact**: Better user experience, professional appearance
- **Acceptance Criteria**:
  - [ ] Welcome message shows first name only
  - [ ] Handles both email-based and full name formats
  - [ ] Consistent across all views and components
  - [ ] Fallback to email if name extraction fails
- **Files to Modify**:
  - `frontend/src/stores/auth.store.ts`
  - `frontend/src/components/Layout/AuthenticatedLayout.vue`
  - `frontend/src/views/DashboardView.vue`
- **Effort Estimate**: 30 minutes
- **Source**: `IMPROVEMENTS.md → UI/UX Consistency`
- **Assigned**: Unassigned
- **Created**: 2025-06-18
- **Updated**: 2025-06-18

### 🟡 **PATCH-002: Database Seeding Optimization**
- **Status**: 🔄 Ready
- **Priority**: Medium
- **Type**: Development Workflow
- **Component**: Backend Database Seeding
- **Description**: 
  - Make database flush step optional in seeding scripts
  - Preserve existing users between database reseeds
  - Distribute recipes among existing users realistically
- **Impact**: Improved development workflow, data preservation
- **Acceptance Criteria**:
  - [ ] Optional flush parameter in seeding script
  - [ ] Users preserved between runs
  - [ ] Recipes distributed among existing users
  - [ ] Realistic recipe attribution maintained
- **Files to Modify**:
  - `backend/cmd/seed_recipes/main.go`
  - `backend/cmd/seed_users/main.go`
- **Effort Estimate**: 2 hours
- **Source**: `IMPROVEMENTS.md → Database & Seeding`
- **Assigned**: Unassigned
- **Created**: 2025-06-18
- **Updated**: 2025-06-18

### 🟡 **PATCH-003: Recipe Generation UX Improvements**
- **Status**: 🔄 Ready
- **Priority**: Medium
- **Type**: UX Enhancement
- **Component**: Frontend Recipe Generation
- **Description**: 
  - Hide "Generate Recipe" nav tab until user searches first
  - Show close matches when no exact match found
  - Prompt user to select close matches as guides or generate from scratch
- **Impact**: Improved AI recipe generation workflow
- **Acceptance Criteria**:
  - [ ] Generate Recipe tab hidden initially
  - [ ] Search-first workflow implemented
  - [ ] Close matches displayed when available
  - [ ] User choice between guided generation or blank slate
- **Files to Modify**:
  - `frontend/src/components/Layout/NavigationBar.vue`
  - `frontend/src/views/GenerateRecipeView.vue`
  - `frontend/src/router/index.ts`
- **Effort Estimate**: 3-4 hours
- **Source**: `IMPROVEMENTS.md → Recipe Generation & AI`
- **Assigned**: Unassigned
- **Created**: 2025-06-18
- **Updated**: 2025-06-18

## ✅ **Completed Patches**

### ✅ **PATCH-004: Navigation Consistency**
- **Status**: ✅ Complete
- **Priority**: High
- **Type**: UI Consistency
- **Component**: Frontend Navigation
- **Description**: 
  - Standardized user menu across all pages
  - Moved Dashboard and Admin to avatar dropdown
  - Implemented consistent avatar dropdown behavior
- **Completion Date**: 2025-06-18
- **Files Modified**:
  - `frontend/src/components/Layout/AuthenticatedLayout.vue`
  - `frontend/src/components/Layout/DefaultLayout.vue`
- **Source**: `IMPROVEMENTS.md → UI/UX Consistency → Navigation Consistency`

### ✅ **PATCH-005: Favorites System Fix**
- **Status**: ✅ Complete
- **Priority**: High
- **Type**: Bug Fix
- **Component**: Full Stack Favorites
- **Description**: 
  - Fixed state management between browse and detail pages
  - Resolved API field mapping (snake_case ↔ camelCase)
  - Fixed soft delete handling in backend
- **Completion Date**: 2025-06-18
- **Files Modified**:
  - `backend/internal/api/recipes.go`
  - `frontend/src/stores/recipes.store.ts`
  - `frontend/src/components/Recipe/RecipeCard.vue`
- **Source**: `IMPROVEMENTS.md → Favorites Functionality`

## 📋 **Patch Workflow States**

- **🔄 Ready** - Patch identified and scoped, ready for implementation
- **🔨 In Progress** - Currently being worked on
- **🧪 Testing** - Patch implemented, under testing
- **✅ Complete** - Patch deployed and verified
- **❌ Rejected** - Patch rejected or no longer needed
- **🔄 Reopened** - Previously completed but issue returned

## 📊 **Patch Statistics**

- **Total Patches**: 5
- **Active**: 3
- **Completed**: 2
- **High Priority**: 2
- **Medium Priority**: 3

## 🏷️ **Patch Types**

- **ui-polish** - Minor UI/UX improvements
- **workflow** - Development workflow improvements
- **hotfix** - Critical production fixes
- **performance** - Small performance improvements
- **accessibility** - Accessibility improvements
- **mobile** - Mobile-specific fixes
- **security** - Minor security improvements

## 📝 **Patch Guidelines**

### **What Qualifies as a Patch?**
- **Small scope**: Can be completed in 4 hours or less
- **Low risk**: Minimal chance of breaking existing functionality
- **Isolated**: Affects limited number of files
- **Quick win**: High impact relative to effort required

### **What Should Be a Feature Instead?**
- **Large scope**: Requires more than 1 day of work
- **New functionality**: Adds significant new capabilities
- **Complex**: Requires architectural changes
- **Multiple components**: Touches many parts of the system

---

**Last Updated**: 2025-06-18  
**Next Review**: Weekly during active development