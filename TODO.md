# TODO

## Implementation Order

### Phase 1: Core Features & Functionality (Weeks 1-3)
**Goal: Build essential user-facing features that provide immediate value**

1. **Favorite Feature** (3 days)
   - Backend API endpoints for favorites
   - Frontend UI integration
   - Database schema updates
   - Testing

2. **Recipe Search on Recipes Page** (2 days)
   - Implement search UI component
   - Wire up to existing backend search
   - Add filters and sorting

3. **Dashboard Database Integration** (3 days)
   - Connect dashboard to real data
   - Remove placeholder content
   - Add user statistics

4. **Recipe Details Enhancement** (2 days)
   - Wire up nutritional information
   - Add author and creation date
   - Improve recipe display

### Phase 2: Authentication & Security (Week 4)
**Goal: Complete authentication system for better user experience**

5. **Password Reset Flow** (2 days)
   - Add "Forgot Password" button to login
   - Backend password reset endpoints
   - Email token generation

6. **Email Verification** (2 days)
   - Verification endpoints
   - Email sending integration
   - UI flow for verification

7. **Email Notification System** (1 day)
   - Setup email service
   - Templates for notifications
   - User preference settings

### Phase 3: Content & Generation (Weeks 5-6)
**Goal: Improve recipe generation and content quality**

8. **Recipe Generation Logic** (3 days)
   - Database query matching
   - Close match algorithms
   - Token optimization

9. **LLM Improvements** (2 days)
   - Better system prompts for dish names
   - Adjust temperature/top_p values
   - Conditional generation logic

10. **Featured Recipes** (2 days)
    - Remove placeholder content
    - Algorithm for featured selection
    - Homepage integration

### Phase 4: Advanced Features (Weeks 7-8)
**Goal: Add social and administrative features**

11. **Recipe Modifications** (2 days)
    - "Modify" button functionality
    - Recipe forking/versioning
    - Edit UI

12. **Comments System** (3 days)
    - Database schema for comments
    - Backend CRUD endpoints
    - Frontend comment components

13. **Share Functionality** (1 day)
    - Social sharing buttons
    - Copy link functionality
    - Share tracking

### Phase 5: Admin & Infrastructure (Weeks 9-10)
**Goal: Build administrative tools and improve deployment**

14. **Admin Role System** (2 days)
    - Role-based permissions
    - Backend authorization
    - Database updates

15. **Admin Dashboard** (3 days)
    - User management
    - Recipe moderation
    - Analytics and metrics

16. **CI/CD & Docker Tags** (2 days)
    - GitHub release tags
    - Automated versioning
    - Docker image tagging

### Phase 6: Polish & Testing (Weeks 11-12)
**Goal: Improve UI/UX and achieve testing targets**

17. **UI/UX Polish** (3 days)
    - Modern color scheme
    - About page creation
    - General UI improvements

18. **Testing Coverage** (5 days)
    - Follow existing testing plan
    - Focus on critical paths
    - Achieve 75% coverage target

19. **Bug Reporting System** (2 days)
    - Crash reporting integration
    - Feedback form and page
    - Backend logging

### Phase 7: Future Enhancements (Post-MVP)
**Goal: Add advanced features after core completion**

20. **Image Generation** (1 week)
    - AI image generation integration
    - Storage and CDN setup
    - UI for image management

21. **Performance & Monitoring** (1 week)
    - Advanced metrics
    - Performance optimization
    - Monitoring dashboards

## Bug Fixes
- ✅ **Fix intermittent DeepSeek response malformation issues affecting recipe presentation** 
  - ✅ **Phase 1: Evaluate and Install DeepSeek Go Client**
    - ✅ Install chosen client: `go get github.com/trustsight-io/deepseek-go` 
    - ✅ Update go.mod and test basic client initialization 
    
  - ✅ **Phase 2: Refactor LLMService to Use Client**
    - ✅ Update `LLMService` struct to use `*deepseek.Client` instead of manual HTTP 
    - ✅ Implement `NewLLMService()` with proper client initialization 
    - ✅ Add error handling for API key validation and client setup 
    - ✅ Update dependency injection in service initialization 
    
  - ✅ **Phase 3: Replace Manual JSON Parsing**
    - ✅ Define JSON schema for recipe data structure with proper validation 
    - ✅ Implement `JSONExtractor` with schema validation 
    - ✅ Remove manual JSON parsing and cleanup logic (`fixDeepSeekJSON`) 
    - ✅ Update error handling to use client's built-in error types 
    
  - ✅ **Phase 4: Update Request Structure**
    - ✅ Refactor `GenerateRecipe()` to use `CreateChatCompletion()` with proper message structure 
    - ✅ Set `ResponseFormat: {Type: "json_object"}` for consistent JSON responses 
    - ✅ Update system and user message formatting for better JSON compliance 
    - ✅ Configure appropriate `MaxTokens` (4096) to prevent truncation 
    - ✅ Add temperature and other parameters for consistent output 
    
  - ✅ **Phase 5: Improve Error Handling & Retry Logic**
    - ✅ Implement retry logic with exponential backoff (3 retries, 2s intervals) 
    - ✅ Add specific error handling for all scenarios 
    - ✅ Add detailed logging with `[LLMService]` prefix 
    
  - ✅ **Phase 6: Testing & Validation**
    - ✅ Write unit tests for new LLMService implementation 
    - ✅ Test JSON extraction with various response formats 
    - ✅ Test error scenarios and ServingsType handling 
    - ✅ Validate that recipe data structure is properly populated 
    
  - ✅ **Phase 7: Deployment & Monitoring**
    - ✅ Update environment configuration documentation 
    - ✅ Create comprehensive upgrade guide (`DEEPSEEK_UPGRADE.md`) 
    - ✅ Add enhanced logging for monitoring 
    - ✅ Document new implementation and troubleshooting guide 

## Feature Implementation
- ❌ Implement 'Favorite' feature 
- ❌ Create /about page 
- ❌ Add 'Modify' button to recipe details page 
- ❌ Implement Dashboard with database integration 
- ❌ Add image generation to save recipe function for photorealistic recipe images 
- ❌ Implement Featured Recipes on Home/Landing page (remove placeholders) 
- ❌ Implement Search functionality on Recipes page 
- ❌ Add comments to the recipe details page and wire up the backend 
- ❌ Add a 'Share' button to the recipe details page and wire up the backend 
- ❌ Add an Admin dashboard for the app, with the ability to view all users, recipes, and other data, like activity, traffic, any kind of useful metric to keep track of. 
- ❌ Create Admin role for the app and wire up the backend 
- ❌ github CI/CD tags 
- ❌ docker image tags and versioning for both backend and frontend images. 


## UI/UX Improvements
- ✅ Normalize page layouts with consistent Nav bar and footer 
- ✅ Hide 'Generate' buttons until no query matches are found 
- ✅ Hide the 'Generate' button on the dashboard page 
- ❌ Nutritional information on the recipe details page needs to be wired up 
- ❌ Recipe Author and Date of creation needs to be added to the recipe details page and wired up 
- ❌ improve system prompt to assign names to the dishes instead of just listing the ingredients 
- ❌ adjust the temp and top_p values to be more creative to avoid repeating the same dishes frequently 
- ❌ the only time the user should be able to generate a recipe is if there are no matches to their query 
- ❌ adjust the color scheme to be more modern and appealing 



## Authentication
- ✅ Reduce JWT token TTL to a few hours for improved security 
- ❌ implement password reset functionality 
- ❌ implement email verification functionality 
- ❌ implement email notifications for new users and password resets as well as notifications for new recipes and other updates 
- ❌ add bug/feedback reporting to the app automatically when there is a crash, plus a button and page for them to report issues 
- ❌ add a 'Forgot Password' button to the login page 


## Recipe Generation Logic
- ❌ Implement database query matching for recipe requests 
- ❌ Add logic to return close matches first 
- ❌ Enable new recipe generation using close matches as starting points (token optimization) 

## Testing Coverage

### Coverage Goals (Industry Standard: 70-80% Overall)
**Target: 75% overall coverage with 90%+ on critical paths**

**Current Status:**
- Backend: ~60% overall (42.3% API, 77.8% Server) - **Target: 75%**
- Frontend: ~3% overall (Service Layer: 100% ) - **Target: 70%**  
- E2E:  Comprehensive (27 tests) - **Maintain Excellence**

### Phased Testing Implementation Plan

#### 🎯 **Phase 1: Foundation (Weeks 1-2) - HIGH ROI**
**Goal: Establish critical path coverage (60% overall)**

**Priority 1: Frontend Service Layer (0% → 85%)** 
- ✅ `auth.service.ts` - Login/logout/token management (100% coverage) 
- ✅ `api.ts` - HTTP client, error handling, interceptors (tests created) 
- ✅ `recipe.service.ts` - CRUD operations, search (100% coverage) 
- ✅ `llm.service.ts` - AI generation API calls (100% coverage) 

**Priority 2: Frontend Authentication (0% → 90%)**
- ❌ `auth.store.ts` - Login state, token persistence, logout 
- ❌ `useAuth.ts` - Authentication composable logic 
- ❌ Auth guards and route protection 

**Priority 3: Backend Critical Paths (42% → 75%)**
- ❌ Recipe search and filtering logic 
- ❌ LLM integration error handling 
- ❌ User authorization edge cases 

#### 🚀 **Phase 2: Core Features (Weeks 3-4)**
**Goal: Achieve 70% overall coverage**

**Frontend Components (0% → 70%)**
- ❌ LoginView/RegisterView - Form validation, error states 
- ❌ RecipeCard - Display logic, click handlers 
- ❌ RecipeListView - Search, filtering, pagination 
- ❌ Recipe generation components 

**Frontend Stores (0% → 80%)**
- ❌ `recipe.store.ts` - Recipe data management 
- ❌ `notification.store.ts` - Toast notifications 

**Backend Extensions (75% → 80%)**
- ❌ File upload and image handling 
- ❌ User preferences and dietary restrictions 
- ❌ Advanced recipe operations 

#### 🔧 **Phase 3: Polish & Performance (Weeks 5-6)**
**Goal: Achieve 75% overall with performance baseline**

**Test Infrastructure**
- ❌ Coverage reporting and CI thresholds 
- ❌ Test data factories and fixtures 
- ❌ Mock services for isolated testing 

**Performance & Security Baseline**
- ❌ Basic performance tests (API response times) 
- ❌ Security tests (input validation, JWT edge cases) 
- ❌ Load testing setup 

#### 📊 **Phase 4: Advanced Coverage (Weeks 7-8)**
**Goal: Reach 75-80% with quality improvements**

**Advanced Testing**
- ❌ Integration tests (component + API) 
- ❌ Vue Router navigation flows 
- ❌ Form submission with backend integration 
- ❌ Error boundary testing 

**Quality Assurance**
- ❌ Mutation testing for critical paths 
- ❌ Accessibility testing automation 
- ❌ Cross-browser compatibility 

### Coverage Targets by Component

#### **Frontend (Target: 70% overall)**
```
Service Layer:     85% (High ROI - API integration)
Authentication:    90% (Critical - security)
Stores (Pinia):    80% (Business logic)
Composables:       75% (Reusable logic)
Components:        70% (UI logic)
Integration:       65% (Component + API)
```

#### **Backend (Target: 75% overall)**
```
Critical Paths:    90% (Auth, Recipe CRUD, LLM)
API Handlers:      75% (HTTP layer)
Service Layer:     80% (Business logic)
Database Layer:    70% (Data operations)
Utilities:         60% (Helper functions)
```

#### **E2E (Current: Excellent)**
```
User Workflows:     Comprehensive (27 tests)
Error Scenarios:    Well covered
Cross-browser:     🎯 Future enhancement
Performance:       🎯 Future enhancement
```

### Implementation Strategy

#### **Week 1-2 Quick Wins (Foundation)**
1. **Set up Vitest with Vue Test Utils** (1 day)
2. **Create test utilities and mocks** (1 day)
3. **Test auth.service.ts and api.ts** (3 days)
4. **Test auth.store.ts and useAuth.ts** (3 days)

#### **Week 3-4 Core Coverage**
1. **Component testing setup** (2 days)
2. **Test critical components** (4 days)
3. **Backend critical path tests** (2 days)

#### **Week 5-6 Infrastructure**
1. **CI coverage thresholds** (1 day)
2. **Performance test baseline** (2 days)
3. **Security test automation** (2 days)
4. **Documentation and guides** (1 day)

#### **Week 7-8 Quality & Polish**
1. **Integration test suites** (3 days)
2. **Accessibility automation** (2 days)
3. **Load testing setup** (1 day)

### Success Metrics
- **Phase 1**: 60% overall coverage, critical auth paths at 90%
- **Phase 2**: 70% overall coverage, all services tested
- **Phase 3**: 75% overall coverage, performance baseline
- **Phase 4**: 75-80% coverage with quality automation

### Maintenance Strategy
- **Daily**: Monitor coverage in CI
- **Weekly**: Review failed tests and flaky tests
- **Monthly**: Update test data and mock scenarios
- **Quarterly**: Performance and security test review

### Future Enhancements (Beyond Phase 4)
- ❌ Visual regression testing 
- ❌ Cross-browser automation 
- ❌ Advanced performance monitoring 
- ❌ Chaos engineering for resilience 
- ❌ Advanced accessibility compliance 
