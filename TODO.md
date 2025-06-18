# TODO

## Implementation Order

### Phase 1: Core Features & Functionality ✅ COMPLETED
**Goal: Build essential user-facing features that provide immediate value**

1. ✅ **Favorite Feature** (3 days)
   - ✅ Backend API endpoints for favorites
   - ✅ Frontend UI integration
   - ✅ Database schema updates
   - ✅ Testing
   - ✅ E2E tests for favorites functionality

2. ✅ **Recipe Search on Recipes Page** (2 days)
   - ✅ Implement search UI component
   - ✅ Wire up to existing backend search
   - ✅ Add filters and sorting

3. ✅ **Dashboard Database Integration** (3 days)
   - ✅ Connect dashboard to real data
   - ✅ Remove placeholder content
   - ✅ Add user statistics
   - ✅ E2E tests for dashboard functionality

4. ✅ **Recipe Details Enhancement** (2 days)
   - ✅ Wire up nutritional information
   - ✅ Add author and creation date
   - ✅ Improve recipe display
   - ✅ Add prep/cook time and servings
   - ✅ E2E tests for enhanced details

### Phase 2: Authentication & Security ✅ COMPLETED
**Goal: Complete authentication system for better user experience**

5. ✅ **Password Reset Flow** (2 days)
   - ✅ Add "Forgot Password" button to login
   - ✅ Backend password reset endpoints
   - ✅ Email token generation
   - ✅ Frontend password reset UI (ForgotPasswordView, ResetPasswordView)
   - ✅ E2E tests for password reset flow

6. ✅ **Email Verification** (2 days)
   - ✅ Verification endpoints
   - ✅ Email sending integration
   - ✅ UI flow for verification
   - ✅ Email verification banner for unverified users
   - ✅ E2E tests for email verification

7. ✅ **Email Notification System** (1 day)
   - ✅ Setup email service (flexible SMTP configuration)
   - ✅ Templates for notifications (password reset, welcome, verification)
   - ✅ Log email service for development

### Phase 3: Content & Generation (Weeks 5-6) ✅ COMPLETED
**Goal: Improve recipe generation and content quality**

8. ✅ **Recipe Generation Logic** (3 days)
   - ✅ Database query matching for recipe requests using pgvector similarity search
   - ✅ Add logic to return close matches first with combined keyword + semantic scoring
   - ✅ Enable new recipe generation using close matches as starting points (token optimization)

9. ✅ **LLM Improvements** (2 days)
   - ✅ Better system prompts to assign creative names to dishes with specific guidelines
   - ✅ Adjust temperature (0.85) and top_p (0.95) values for more creative recipes
   - ✅ Conditional generation logic (only allow generation if no matches to query)

10. ✅ **Featured Recipes** (2 days)
    - ✅ Remove placeholder content from home/landing page
    - ✅ Algorithm for featured selection (recent, popular, diverse categories, random)
    - ✅ Homepage integration with real-time featured recipe loading

### Phase 4: Admin & Infrastructure (Weeks 7-8) ✅ COMPLETED
**Goal: Build administrative tools and improve deployment**

11. ✅ **Admin Role System** (2 days)
    - ✅ Create Admin role for the app (user, admin, moderator roles)
    - ✅ Role-based permissions with database-backed permission system
    - ✅ Backend authorization with middleware for admin/moderator routes
    - ✅ Database updates (admin_actions audit table, role_permissions, user role fields)

12. ✅ **Admin Dashboard** (3 days)
    - ✅ User management (list, view, update role, ban/unban, delete)
    - ✅ Recipe moderation (list, hide/unhide, delete with reasons)
    - ✅ Analytics and metrics (platform stats, daily trends, top contributors)
    - ✅ Admin action audit logging for compliance
    - ✅ Full frontend UI with responsive design

13. ✅ **CI/CD & Docker Tags** (2 days)
    - ✅ GitHub CI/CD workflows enhanced with version management
    - ✅ Automated versioning system with semantic versioning
    - ✅ Docker image tags and versioning for both backend and frontend
    - ✅ Version bump workflow for automated releases
    - ✅ Version validation in CI pipeline

### MVP Launch Preparation 🚀 CURRENT
**Goal: Final polish and seeding for launch readiness**

14. **Admin User Setup & Favorites UI Fix** (1 day)
    - Create admin user in database
    - Fix favorite heart icon to show active state when favorited
    - Final UI polish

15. **Database Seeding & Recipe Generation** (2 days)
    - Flush existing database data
    - Create diverse user profiles (regular users + 1-2 admins)
    - Batch generate ~50 recipes using varied user preferences
    - Ensure recipe diversity and quality for launch content

## Bug Fixes ✅ COMPLETED
- ✅ **Fix intermittent DeepSeek response malformation issues affecting recipe presentation** 
  - ✅ All phases completed successfully with new DeepSeek Go client integration

## Testing Coverage Status

### Current Status:
- Backend: ~60% overall - **Target: 75%**
- Frontend: Service Layer 100%, Auth 97%+, Components need work - **Target: 70%**  
- E2E: Comprehensive (35+ tests) - **Maintain Excellence**

### Priority Testing Items:
1. **Backend Testing**
   - Recipe search and filtering logic
   - LLM integration error handling
   - User authorization edge cases

2. **Frontend Testing**
   - Component tests (LoginView, RegisterView, RecipeCard, RecipeListView)
   - Store tests (recipe.store.ts, notification.store.ts)
   - Integration tests

 

## Future Enhancements (Post-MVP)
**These features will be implemented after the core application is complete**

### UI/UX & Polish
- **UI/UX Polish** 
  - Adjust color scheme to be more modern and appealing
  - Create /about page
  - General UI improvements and design refinements

### Testing & Quality Assurance
- **Enhanced Testing Coverage**
  - Backend Critical Paths: Recipe search and filtering logic
  - Backend: LLM integration error handling
  - Backend: User authorization edge cases
  - Frontend Components: LoginView/RegisterView form validation
  - Frontend Components: RecipeCard, RecipeListView
  - Frontend Stores: recipe.store.ts, notification.store.ts
  - Achieve 75%+ coverage target

- **Bug Reporting System**
  - Crash reporting integration
  - Feedback form and page for users to report issues
  - Enhanced backend logging and monitoring

### Advanced Features
- **Image Generation**
  - Add image generation to save recipe function for photorealistic recipe images
  - AI image generation integration
  - Storage and CDN setup
  - UI for image management

- **User Preferences & Personalization**
  - User preference settings for email notifications
  - Email notifications for new recipes and other updates
  - Dietary preference management
  - Advanced recipe recommendations

- **Performance & Monitoring**
  - Advanced metrics and analytics
  - Performance optimization
  - Monitoring dashboards
  - Load testing setup

### Testing Enhancements
- Visual regression testing
- Cross-browser automation
- Advanced performance monitoring
- Chaos engineering for resilience
- Advanced accessibility compliance
- Mutation testing for critical paths

### Infrastructure & DevOps
- Advanced CI/CD pipelines
- Multi-environment deployment
- Automated backup strategies
- Disaster recovery planning

### Social & Community Features
- **Recipe Modifications** (2 days)
  - Add 'Modify' button to recipe details page
  - Recipe forking/versioning
  - Edit UI for user's own recipes
- **Comments System** (3 days)
  - Database schema for comments
  - Backend CRUD endpoints
  - Frontend comment components
  - Wire up to recipe details page
- **Share Functionality** (1 day)
  - Add 'Share' button to recipe details page
  - Social sharing buttons
  - Copy link functionality
  - Share tracking
- User profiles and following
- Recipe collections/cookbooks
- Community challenges
- Recipe ratings beyond favorites


# Need to review the mechanism for the close matches to be used in generating a new recipe. How exaclty does it determine what to use? 