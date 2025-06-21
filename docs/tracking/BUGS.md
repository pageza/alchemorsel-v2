# 🐛 Bug Tracking

**Active bug reports and fixes for Alchemorsel**

## 🚨 **Critical Bugs (MVP Blockers)**

### ✅ **BUG-001: Profile System Broken**
- **Status**: ✅ Resolved
- **Priority**: Critical → Fixed
- **Reporter**: Manual Testing 2025-06-18
- **Component**: Backend Database Schema + Frontend Profile Management
- **Description**: 
  - Profile edit forms show placeholders instead of actual user data
  - Navigation from /profile to /profile/edit throws console errors and fails
  - Username displays as "@username" placeholder instead of actual username
- **Root Cause Found**: Missing `cuisine_preferences` table in database causing profile API to fail with 500 error
- **Impact**: Users cannot manage their profiles - core functionality broken
- **Resolution**: ✅ COMPLETE - All acceptance criteria met
- **Acceptance Criteria**: ✅ ALL COMPLETE
  - ✅ **Backend API fixed**: Missing `cuisine_preferences` table created - profile API now returns data
  - ✅ **Profile view shows real user data**: Fixed with backend API resolution
  - ✅ **Edit profile form populates**: Working correctly with backend data
  - ✅ **Navigation between profile pages**: Working without errors
  - ✅ **Username displays correctly**: Fixed throughout app
- **Files Fixed**: 
  - ✅ `backend/migrations/0015_add_missing_dietary_tables.sql` - Database schema fixed
  - ✅ `frontend/src/views/ProfileView.vue` - Profile data loading working
  - ✅ `frontend/src/views/ProfileEditView.vue` - Edit form populated correctly
  - ✅ `frontend/src/stores/auth.store.ts` - Auth store integration working
  - ✅ `frontend/src/services/user.service.ts` - User service API calls working
- **Validation**: ✅ Confirmed by integration tests - all 6 core tests passing
- **Assigned**: Claude
- **Created**: 2025-06-18
- **Resolved**: 2025-06-21

### 🔴 **BUG-002: AI Recipe Generation Violates Dietary Restrictions (CRITICAL SAFETY BUG)**
- **Status**: 🔄 Active → **INVESTIGATION COMPLETED**
- **Priority**: Critical (Safety Risk)
- **Reporter**: Manual Testing 2025-06-18
- **Component**: Backend LLM Service - Dietary Restriction Enforcement
- **Description**: 
  - **CRITICAL**: Vegan users requesting "chicken dinner" receive actual chicken recipes with chicken ingredients
  - **CRITICAL**: Users with dietary restrictions (dairy-free, gluten-free, etc.) likely receiving non-compliant recipes
  - Dietary preferences ARE retrieved from database correctly (`[vegan]` confirmed in logs)
  - Enhanced dietary restriction prompts with explicit warnings and emojis NOT reaching LLM
  - Code execution bypassing dietary preference incorporation (lines 185-204 never executed)
- **Root Cause**: Code execution flow issue - dietary preferences retrieved but not passed to LLM prompt generation
- **Impact**: **SAFETY RISK** - Could cause allergic reactions, violate religious restrictions, undermine user trust
- **Investigation Results**:
  - ✅ Database stores dietary preferences correctly
  - ✅ `getUserDietaryLifestyles()` function works
  - ✅ Enhanced prompts with strict dietary enforcement created
  - ❌ **Execution flow skips dietary preference code entirely**
  - ❌ Similar recipe search logic may be causing early return
- **Acceptance Criteria**:
  - [ ] **CRITICAL**: Vegan users NEVER receive recipes with animal products (meat, dairy, eggs, honey)
  - [ ] **CRITICAL**: Dairy-free users NEVER receive recipes with milk, cheese, butter, cream, etc.
  - [ ] **CRITICAL**: All dietary restrictions enforced at ingredient level, not just title level
  - [ ] Dietary preferences properly incorporated into LLM prompts
  - [ ] Code execution reaches dietary preference retrieval (debug logs visible)
  - [ ] Test: Vegan user requesting "chicken" gets plant-based alternative
  - [ ] Test: Dairy-free user requesting "ice cream" gets dairy-free alternative
- **Files Affected**: 
  - `backend/internal/api/llm.go` - Execution flow issue around lines 175-204
  - `backend/internal/service/llm.go` - Enhanced dietary prompts (implemented but not reached)
- **Assigned**: Claude (Investigation Complete - Implementation Required)
- **Created**: 2025-06-18
- **Updated**: 2025-06-18 - Root cause identified, safety risk confirmed

### 🔴 **BUG-003: Nutrition Calculation Improvements Needed**
- **Status**: 🔄 Active → **PARTIAL PROGRESS**
- **Priority**: High (Reduced from Critical)
- **Reporter**: Manual Testing 2025-06-18
- **Component**: Backend LLM Service
- **Description**: 
  - Nutrition values now show some variation (320→400→550 calories observed)
  - JSON parsing fixes applied for empty nutrition values
  - Still need more realistic and varied nutritional calculations
- **Progress Made**:
  - ✅ Fixed JSON parsing issues causing empty nutrition values
  - ✅ Added default values for malformed nutrition data
  - ✅ Enhanced regex fixes for various LLM response formats
  - 🔄 Nutrition values now varied but may need further refinement
- **Impact**: Moderate - Users get varied nutrition info but accuracy could be improved
- **Acceptance Criteria**:
  - [x] Different recipes show different nutritional profiles (IMPROVED)
  - [x] No more empty/malformed nutrition values (FIXED)
  - [ ] More accurate calculations based on ingredient portions
  - [ ] Realistic calorie ranges for recipe types
- **Files Affected**: 
  - `backend/internal/service/llm.go` - JSON parsing fixes implemented
- **Assigned**: Claude (Partial fixes implemented, further refinement needed)
- **Created**: 2025-06-18
- **Updated**: 2025-06-18 - JSON parsing improved, nutrition values now varied

### ✅ **BUG-004: Email Verification Not Enforced**
- **Status**: ✅ Resolved
- **Priority**: Critical → Fixed
- **Reporter**: Manual Testing 2025-06-18
- **Component**: Backend Authentication + Email System
- **Description**: 
  - Users can generate recipes without email verification
  - Email verification system exists but not enforced
  - Security gap allowing unverified users full access
- **Impact**: Security vulnerability and spam potential
- **Resolution**: ✅ COMPLETE - Full email verification system implemented
- **Acceptance Criteria**: ✅ ALL COMPLETE
  - ✅ **Only email-verified users can generate recipes**: Email verification middleware enforced
  - ✅ **Proper error messages for unverified users**: Error handling and user guidance implemented
  - ✅ **Email verification workflow working end-to-end**: Complete Gmail SMTP integration working
  - ✅ **Verification status properly checked on protected endpoints**: Middleware protecting all content creation
  - ✅ **Professional email templates**: HTML email templates for verification and welcome
  - ✅ **Frontend user guidance**: Email verification banner and status indicators
- **Files Fixed**: 
  - ✅ `backend/internal/middleware/email_verification.go` - Middleware enforcement
  - ✅ `backend/internal/service/email.go` - Complete email service with Gmail SMTP
  - ✅ `backend/internal/api/auth.go` - Verification endpoints and token handling
  - ✅ `frontend/src/components/EmailVerificationBanner.vue` - User guidance
  - ✅ `frontend/src/router/index.ts` - Route guards for verification status
- **Validation**: ✅ Tested end-to-end in production at test.app.alchemorsel.com
- **Assigned**: Claude
- **Created**: 2025-06-18
- **Resolved**: 2025-06-21

### ✅ **BUG-009: Feedback Submission Lacks Visual Confirmation**
- **Status**: ✅ Resolved
- **Priority**: High → Fixed
- **Reporter**: User Testing 2025-06-21
- **Component**: Frontend User Experience
- **Description**: 
  - Users submitting feedback through feedback modal received no visual confirmation
  - Backend was working (emails sent to admin) but users didn't know if submission succeeded
  - Poor user experience with no success/error feedback
- **Impact**: User confusion, potential duplicate submissions, poor UX
- **Resolution**: ✅ COMPLETE - Full visual feedback system implemented
- **Acceptance Criteria**: ✅ ALL COMPLETE
  - ✅ **Success notifications**: Green toast notifications for successful submissions
  - ✅ **Error notifications**: Red toast notifications for failed submissions
  - ✅ **Loading states**: Submit button shows loading spinner during submission
  - ✅ **Modal behavior**: Automatically closes after successful submission
  - ✅ **Form reset**: Form clears after successful submission
- **Files Fixed**: 
  - ✅ `frontend/src/components/NotificationToast.vue` - New toast notification system
  - ✅ `frontend/src/App.vue` - Global notification rendering
  - ✅ `frontend/src/components/FeedbackModal.vue` - Success/error handling
  - ✅ `frontend/src/stores/notification.store.ts` - Notification state management
- **Validation**: ✅ Tested in production - users now see clear feedback
- **Assigned**: Claude
- **Created**: 2025-06-21
- **Resolved**: 2025-06-21

## 🟡 **High Priority Bugs**

### 🟡 **BUG-005: Dietary Restrictions Not Enforced (DUPLICATE OF BUG-002)**
- **Status**: 🔄 Active → **MERGED INTO BUG-002**
- **Priority**: High → Critical (Merged)
- **Reporter**: Manual Testing 2025-06-18
- **Component**: Backend Recipe Filtering
- **Description**: 
  - **MERGED**: This issue is the same as BUG-002 dietary restriction violations
  - Originally identified as separate recipe filtering issue
  - Root cause is same execution flow problem in LLM generation
- **Resolution**: All work moved to BUG-002 which covers the comprehensive dietary restriction enforcement
- **Files Affected**: 
  - Same as BUG-002: `backend/internal/api/llm.go`, `backend/internal/service/llm.go`
- **Assigned**: Claude (Merged into BUG-002)
- **Created**: 2025-06-18
- **Updated**: 2025-06-18 - Merged into BUG-002 for comprehensive fix

### 🟡 **BUG-006: Primary Diet Not Populating Consistently**
- **Status**: 🔄 Active
- **Priority**: High
- **Reporter**: Manual Testing 2025-06-18
- **Component**: Frontend Dashboard
- **Description**: 
  - Dashboard "Primary Diet" field shows inconsistent data
  - Sometimes shows correct diet, sometimes empty
  - User with 'paleo' diet not showing consistently on Dashboard
- **Impact**: Inconsistent user experience
- **Acceptance Criteria**:
  - [ ] Primary diet always displays when set
  - [ ] Data loads consistently on dashboard
  - [ ] API response format is correct
  - [ ] Frontend parsing works reliably
- **Files Affected**: 
  - `frontend/src/views/DashboardView.vue`
  - `backend/internal/api/dashboard.go`
  - `backend/internal/service/profile.go`
- **Assigned**: Unassigned
- **Created**: 2025-06-18
- **Updated**: 2025-06-18

## 🟢 **Medium Priority Bugs**

### 🟢 **BUG-007: Unnecessary Checkboxes in Recipe Ingredients**
- **Status**: 🔄 Active
- **Priority**: Medium
- **Reporter**: Manual Testing 2025-06-18
- **Component**: Frontend Recipe Display
- **Description**: 
  - Recipe detail view shows checkboxes next to ingredients for no clear purpose
  - Checkboxes serve no functional purpose and clutter the UI
  - Users don't need to "check off" ingredients while viewing recipes
- **Impact**: Poor UI/UX, confusing interface
- **Acceptance Criteria**:
  - [ ] Remove checkboxes from ingredient lists
  - [ ] Clean ingredient display formatting
  - [ ] Maintain readability without checkboxes
- **Files Affected**: 
  - `frontend/src/views/RecipeDetailView.vue`
  - `frontend/src/components/Recipe/IngredientsList.vue`
- **Assigned**: Unassigned
- **Created**: 2025-06-18
- **Updated**: 2025-06-18

### 🟢 **BUG-008: Recipe Draft Card Needs Cleanup**
- **Status**: 🔄 Active
- **Priority**: Medium
- **Reporter**: Manual Testing 2025-06-18
- **Component**: Frontend Recipe Generation
- **Description**: 
  - Recipe draft card on Generate Recipe page looks unpolished
  - Inconsistent styling with rest of application
  - Could benefit from better visual hierarchy
- **Impact**: Poor user experience during recipe generation
- **Acceptance Criteria**:
  - [ ] Clean up draft card styling
  - [ ] Match application design system
  - [ ] Improve visual hierarchy
  - [ ] Better spacing and typography
- **Files Affected**: 
  - `frontend/src/views/GenerateRecipeView.vue`
  - `frontend/src/components/Recipe/RecipeDraftCard.vue`
- **Assigned**: Unassigned
- **Created**: 2025-06-18
- **Updated**: 2025-06-18

## 📋 **Bug Workflow States**

- **🔄 Active** - Bug confirmed, awaiting fix
- **🔨 In Progress** - Currently being worked on
- **🧪 Testing** - Fix implemented, under testing
- **✅ Resolved** - Fixed and verified
- **❌ Closed** - Not a bug or won't fix
- **🔄 Reopened** - Previously fixed but issue returned

## 📊 **Bug Statistics**

- **Total Bugs**: 9 (3 resolved, 6 active)
- **Resolved**: 3 ✅ (BUG-001, BUG-004, BUG-009)
- **Critical Active**: 2 (BUG-002, BUG-003 partial)
- **High Active**: 1 (BUG-006)
- **Medium Active**: 2 (BUG-007, BUG-008)
- **Merged/Duplicate**: 1 (BUG-005 into BUG-002)

### **Progress Summary**
- ✅ **BUG-001**: Profile System COMPLETE (database + frontend) - **VALIDATED BY TESTS**
- 🔄 **BUG-002**: Dietary Restrictions INVESTIGATION COMPLETE (safety-critical, execution flow issue identified)
- 🔄 **BUG-003**: Nutrition Calculation PARTIAL PROGRESS (JSON parsing fixed, values now varied)
- ✅ **BUG-004**: Email Verification COMPLETE (full system implemented) - **VALIDATED IN PRODUCTION**
- ✅ **BUG-009**: Visual Feedback COMPLETE (toast notifications implemented) - **VALIDATED IN PRODUCTION**

### **Recent Achievements** 
- 🎯 **Email System**: Complete end-to-end verification workflow deployed
- 🎯 **User Experience**: Visual feedback system implemented across application
- 🎯 **Production Deployment**: Live beta working at test.app.alchemorsel.com
- 🎯 **Quality Improvement**: +3 critical bugs resolved in production environment

### **Test Results Validation**
- ✅ **Integration Tests**: All 6 core tests passing (auth, profile, recipe CRUD)
- ✅ **Profile System**: Backend API working correctly as validated by TestUserProfile
- ✅ **Core Business Logic**: Auth, middleware, configuration all passing
- 🔄 **Test Infrastructure**: Fixed model naming issues (DietaryPreference → DietaryLifestyle)
- 🔄 **Frontend Types**: TypeScript errors remain for frontend integration (non-critical)

## 🏷️ **Bug Labels**

- **frontend** - Frontend/UI issues
- **backend** - Backend/API issues
- **database** - Database related
- **auth** - Authentication/authorization
- **ai** - AI/LLM related
- **performance** - Performance issues
- **security** - Security vulnerabilities
- **ux** - User experience issues

---

**Last Updated**: 2025-06-21  
**Next Review**: Daily during active development