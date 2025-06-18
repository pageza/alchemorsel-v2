# Alchemorsel v2 - Improvement Tracking

This document tracks improvements and issues identified during manual testing and user feedback.

## 🔄 In Progress

*No tasks currently in progress*

## ⏳ To Do

### 🤖 Recipe Generation & AI Features

- [ ] **Recipe Image Generation**: Generate AI images for recipes when saving
  - Integrate with image generation API (DALL-E, Midjourney, or Stable Diffusion)
  - Generate images based on recipe name and description
  - Store generated images with recipe data
  - Display images in recipe cards and detail views

- [ ] **Recipe Generation UX Overhaul**: Refine the Generate Recipe workflow
  - Hide "Generate Recipe" nav tab until user searches first
  - Show close matches when no exact match found
  - Prompt user to select close matches as guides or generate from scratch
  - Improve recipe draft card design and functionality
  - Only allow email-verified users to generate recipes

- [ ] **Recipe Modification Feature**: Add modify functionality to existing recipes
  - Add "Modify" button to recipe detail pages
  - Allow users to modify their own recipes using AI
  - Implement recipe versioning for modifications
  - Preserve original recipe while creating modified version

- [ ] **Nutritional Calculation Review**: Fix nutrition calculation accuracy
  - Currently all recipes showing ~320 calories regardless of ingredients
  - Review LLM prompt for nutrition calculation
  - Implement ingredient-based nutrition database lookup
  - Validate nutrition calculations against real-world data

- [ ] **Search & Matching Algorithm**: Fix recipe search and similarity detection
  - Current search returning incorrect matches (vanilla desserts for spicy chicken request)
  - Improve embedding generation for better semantic search
  - Enhance search query preprocessing
  - Fix recipe similarity scoring algorithm

- [ ] **Dietary Restriction Enforcement**: Ensure dietary compliance
  - Vegan users should only see vegan-compliant recipes
  - Implement strict dietary filter validation
  - Add allergen checking against user profiles
  - Warn users about potential dietary conflicts

### 🗄️ Database & Seeding
- [ ] **Enhanced Database Seeding**: Improve seeding workflow
  - Seed recipes to existing users (distribute among created users)
  - Make database flush step optional in seeding
  - Preserve users between database reseeds
  - Use actual user data for realistic recipe attribution

- [ ] **Database Seeding with Real Users**: Current seeding creates users but may not preserve proper authentication flow
  - Need batch job that uses actual user registration API endpoints
  - Ensure proper password hashing and authentication state
  - Maintain database referential integrity

### 🔐 Access Control
- [ ] **Ensure Unauthenticated Users Can Only View Landing Page**: Need to restrict access
  - Unauthenticated users should only be able to view the landing page
  - All other pages should require authentication
  - Need to update router guards and access controls

### 🏠 Landing Page Enhancements
- [ ] **Featured Recipe Cards**: Landing page should show recipe previews
  - Display recipe cards but make them non-clickable for unauthenticated users
  - Show preview content to entice users to register/login
  - Consider "Login to view recipe" overlay or similar UX

### ⚡ Performance Issues
- [ ] **Navigation Lag**: Page transitions taking several seconds
  - Investigate component loading times
  - Consider code splitting and lazy loading
  - Check for unnecessary API calls or heavy computations
  - May need loading states between routes

### 👤 Profile & User Data
- [ ] **Profile Page Data Population**: Fix profile views to show actual user data
  - **Profile View (/profile)**: Username placeholder (@username) not showing actual username
  - **Edit Profile View (/profile/edit)**: Shows placeholders instead of user's actual data
  - Profile pages need to populate with authenticated user's information
  - Ensure all profile fields load correctly from API

- [ ] **Profile Navigation Issues**: Fix navigation errors from profile pages
  - Clicking "Edit Profile" from /profile doesn't navigate and throws console errors
  - Any navigation from /profile is failing
  - Debug routing and component state issues
  - Fix profile-related navigation guards

- [ ] **Dietary Preferences Display Consistency**: Primary diet not populating consistently
  - Dashboard "Primary Diet" field inconsistent
  - New user with 'paleo' diet not showing on Dashboard consistently
  - Check API response format for dietary preferences
  - Verify frontend is correctly parsing and displaying preferences
  - May need to update user profile API endpoint

- [ ] **Profile Page Integration**: Connect profile page to actual user data
  - Display real user information from API
  - Allow editing of profile fields
  - Ensure dietary preferences are properly displayed

### 🎨 UI/UX Consistency & Polish
- [ ] **Recipe Detail UI Improvements**: Clean up recipe display components
  - Remove unnecessary checkboxes from ingredients list on recipe detail view
  - Clean up recipe draft card design on Generate Recipe page
  - Improve overall recipe card styling and consistency
  - Optimize ingredient and instruction display formatting

- [ ] **Welcome Message Personalization**: Change "Welcome, zach@alchemorsel.com" to "Welcome, Zach"
  - Extract first name from email or use actual name field
  - Ensure consistent format across all pages/views
  - Consider using display name from user profile

- [ ] **Navigation Consistency**: Inconsistent user menu across pages
  - **Current State**: Dashboard has circle dropdown, other pages have username + buttons
  - **Desired State**: Circle dropdown with consistent menu across all views
  - Move "Dashboard" to main navigation bar alongside "Browse Recipes", "Generate Recipe", "My Favorites"
  - Standardize user menu component

### 💬 Comments & Social Features
- [ ] **Recipe Comments System**: Implement commenting functionality
  - Add comments functionality to backend API
  - Create comment models and database tables
  - Implement frontend comment components
  - Add comment display to recipe detail pages
  - Include comment moderation capabilities
  - Allow users to reply to comments

### 📧 Email Communications
- [ ] **Email Verification System**: Implement email verification for new users
  - Send verification links to new user registrations
  - Create email verification templates
  - Implement email verification workflow
  - Ensure only verified users can generate recipes

- [ ] **Coming Soon Email Invites**: Send invites to early subscribers
  - Send initial invites to users who signed up on "Coming Soon" page
  - Create welcome email templates for early adopters
  - Include platform introduction and getting started guide

- [ ] **Email Notification System**: Important updates and notifications
  - Implement email notification infrastructure
  - Create templates for platform updates
  - Add user notification preferences
  - Include security notifications and password changes

### 📱 Navigation & Information Architecture
- [ ] **My Favorites Page Evaluation**: Consider if separate favorites page is needed
  - Current: Favorites show on Dashboard
  - Question: Is dedicated favorites page redundant?
  - Need to evaluate user journey and decide on information architecture
  - **Status**: Pending discussion and decision

## ✅ Completed

### 🤖 Recipe Generation & Variety
- [x] **Recipe Variety Issue**: Enhanced LLM prompt engineering for diverse recipes ⏱️ *6 hours*
  - ✅ Implemented variety-focused prompt engineering with randomized elements
  - ✅ Added cooking technique randomization (roasting, braising, grilling, etc.)
  - ✅ Added texture goal randomization (creamy, crispy, tender, etc.)
  - ✅ Added flavor profile randomization (bright, rich, spicy, etc.)
  - ✅ Added serving style randomization (family-style, individual, elegant, etc.)
  - ✅ Enhanced both single recipe generation and batch generation methods
  - ✅ Increased LLM creativity parameters (temperature, top_p, penalties)
  - ✅ Added similar recipe context to avoid duplicates in single generation
  - ✅ Fixed JSON parsing issues with FlexibleFloat type for nutritional values
  - ✅ Enhanced system prompts to ensure all required fields are populated
  - ✅ Resolved intermittent parsing failures after first successful generation
  - ✅ Core product functionality improvement to prevent repetitive recipes like multiple Panna Cotta for vanilla dessert requests

### 💖 Favorites Functionality
- [x] **Recipe Favorites System**: Hearts now properly toggle and persist
  - Fixed state management between browse and detail pages
  - Resolved API field mapping (snake_case ↔ camelCase)
  - Fixed soft delete handling in backend
  - Added proper event handling to prevent navigation interference

### 🎨 UI/UX Consistency
- [x] **Navigation Consistency**: Standardized user menu across all pages ⏱️ *3 hours*
  - ✅ Removed Dashboard and Admin from main nav bar
  - ✅ Added Dashboard and Admin Dashboard to avatar dropdown menu
  - ✅ Implemented userFirstName logic to show only first name
  - ✅ Standardized avatar dropdown across both AuthenticatedLayout and DefaultLayout

- [x] **Welcome Message Personalization**: Shows first name instead of email ⏱️ *30 mins*
  - ✅ Extracts first name from email (zach@domain.com → Zach)
  - ✅ Handles full names (John Smith → John)
  - ✅ Consistent across all pages via userFirstName computed property

### 👤 Profile & User Data (Partial)
- [x] **Dietary Preferences Display Diagnosis**: Identified root cause ⏱️ *1 hour*
  - ✅ Dashboard API works correctly when preferences exist
  - ✅ Root cause: No UI/API for users to set dietary preferences
  - ➡️ **Moved to Profile Page Integration** (Phase 2)

## 📋 Technical Debt & Code Quality

### 🔧 Backend Improvements Needed
- Recipe generation prompt engineering
- User authentication middleware improvements
- API response consistency

### 🎨 Frontend Improvements Needed
- Component loading optimization
- Router guard implementation
- Consistent component design system
- State management optimization

## 🚀 Implementation Gameplan

### 🎯 **Phase 1: Quick Wins & UI Polish** (1-2 days)
**High impact, low complexity - immediate user experience improvements**

1. **Welcome Message Personalization** ⏱️ *30 mins*
   - Extract first name from email or use actual name field
   - Update all components that display username
   - **Why first**: Simple change, big UX impact

2. **Navigation Consistency** ⏱️ *2-3 hours*
   - Standardize user menu component across all pages
   - Move Dashboard to main nav bar
   - **Why early**: Affects all pages, better to standardize before other UI work

3. **Dietary Preferences Display Fix** ⏱️ *1 hour*
   - Debug why "paleo" isn't showing on Dashboard
   - Check API response format and frontend parsing
   - **Why quick**: Likely a simple data mapping issue

### 🎯 **Phase 2: Core Functionality** (2-3 days)
**Medium-high impact, addresses core product issues**

4. **Recipe Variety Issue** ⏱️ *4-6 hours* ✅ **COMPLETED**
   - ✅ Improved LLM prompt engineering for diverse recipes
   - ✅ Added variety enforcement mechanisms with randomized elements
   - ✅ Enhanced single and batch recipe generation
   - **Why important**: Core product functionality affecting user satisfaction

5. **Profile Page Integration** ⏱️ *3-4 hours*
   - Connect to actual user data APIs
   - Enable editing of profile fields
   - **Why now**: Builds on dietary preferences fix, needed for full user experience

### 🎯 **Phase 3: Access Control & Security** (1-2 days)
**High importance for proper app behavior**

6. **Access Control Implementation** ⏱️ *3-4 hours*
   - Update router guards to restrict unauthenticated access
   - Only allow landing page for non-authenticated users
   - **Why after UI**: Need consistent navigation before restricting access

7. **Landing Page Featured Recipes** ⏱️ *2-3 hours*
   - Show non-clickable recipe previews for unauthenticated users
   - Add "Login to view" overlays
   - **Why with access control**: Part of the same user flow

### 🎯 **Phase 4: Performance & Infrastructure** (2-3 days)
**Important but can be done after core functionality**

8. **Navigation Lag Investigation** ⏱️ *4-6 hours*
   - Profile component loading times
   - Implement code splitting/lazy loading
   - Add loading states between routes
   - **Why later**: Complex debugging, app should function first

9. **Database Seeding Improvements** ⏱️ *3-4 hours*
   - Create batch job using actual registration APIs
   - Ensure proper authentication flow
   - **Why later**: Development workflow improvement, doesn't affect users

### 🎯 **Phase 5: Information Architecture Decision** (Discussion)

10. **My Favorites Page Evaluation**
    - Discuss and decide on information architecture
    - Implement based on decision
    - **Why last**: Requires product decision, affects navigation structure

## 📊 **Implementation Priority Rationale:**

- **Start with UI/UX fixes**: Quick wins build momentum, user-facing improvements show immediate value
- **Core functionality next**: Recipe variety directly affects user satisfaction, profile integration enables full user experience  
- **Access control third**: Security is important but app should work properly first
- **Performance last**: App should function correctly before optimizing, performance issues don't block core functionality

---

**Last Updated**: 2025-06-18
**Implementation Status**: Phase 2 Core Functionality - Recipe Variety Issue COMPLETED ✅
**Next Phase**: Ready to execute Phase 3 (Access Control & Security) or Phase 5 (Profile Page Integration)
**Next Review**: After each phase completion