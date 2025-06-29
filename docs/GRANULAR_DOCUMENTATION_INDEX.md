# 📚 Granular Documentation Index

**Purpose**: Detailed, component-level documentation for targeted development and rollback management.  
**Version**: 1.3.0  
**Created**: 2025-06-27

## 🎯 Why Granular Documentation?

This documentation structure provides:
- **Targeted Development**: Focus on specific components without context switching
- **Versioning Clarity**: Track changes at component level for precise rollbacks
- **Feature Isolation**: Understand feature boundaries and dependencies
- **Onboarding**: New developers can quickly understand specific areas
- **Debugging**: Quickly identify affected components for issues

## 📁 Documentation Structure

### Frontend Documentation
**Base Path**: `docs/frontend/`

#### 📄 Pages (`/pages/`)
Individual page components with routing and user flows:

**Public Pages**:
- `LandingView.md` - Landing page for visitors
- `AboutView.md` - Platform information

**Authentication Flow**:
- `LoginView.md` - User login interface
- `RegisterView.md` - Account creation with dietary preferences
- `ForgotPasswordView.md` - Password reset request
- `ResetPasswordView.md` - Password reset form
- `VerifyEmailView.md` - Email verification

**User Dashboard**:
- `DashboardView.md` - Main user dashboard
- `ProfileView.md` - Profile display
- `EditProfileView.md` - Profile editing

**Recipe Management**:
- `RecipeListView.md` - Browse/search recipes
- `RecipeDetailView.md` - Individual recipe view
- `RecipeCreateView.md` - Manual recipe creation
- `RecipeGeneratorView.md` - AI recipe generation
- `FavoritesView.md` - User favorites

**Admin Interface**:
- `admin/AdminDashboard.md` - Admin control panel
- `admin/UserManagement.md` - User administration
- `admin/RecipeModeration.md` - Content moderation
- `admin/AdminAnalytics.md` - Analytics dashboard

#### 🧩 Components (`/components/`)
Reusable UI components:

**Core Components**:
- `AppNavbar.md` - Global navigation
- `RecipeCard.md` - Recipe display card
- `EmailVerificationBanner.md` - Verification prompt
- `NotificationToast.md` - Global notifications

**Modal Components**:
- `FeedbackModal.md` - User feedback interface
- `ForkRecipeModal.md` - Recipe modification

**UI Elements**:
- `FeedbackButton.md` - Floating feedback button
- `RateLimitIndicator.md` - Rate limit display

**Icons**:
- `icons/IconCommunity.md`
- `icons/IconDocumentation.md`
- `icons/IconEcosystem.md`
- `icons/IconSupport.md`
- `icons/IconTooling.md`

#### 🚀 Features (`/features/`)
Complete feature documentation:

**Authentication** (`/auth/`):
- `README.md` - Complete auth system overview
- `auth-store.md` - Authentication state management
- `router-guards.md` - Route protection
- `email-verification.md` - Email verification system

**Recipe Management** (`/recipes/`):
- `README.md` - Complete recipe system
- `recipe-store.md` - Recipe state management
- `ai-generation.md` - AI recipe creation
- `favoriting.md` - Recipe favoriting system
- `search.md` - Advanced search features
- `dietary-safety.md` - Dietary restriction enforcement

**Profile Management** (`/profiles/`):
- `README.md` - Profile system overview
- `profile-store.md` - Profile state management
- `dietary-preferences.md` - Dietary preference management

**Admin Features** (`/admin/`):
- `README.md` - Administrative features
- `user-management.md` - User administration
- `content-moderation.md` - Content oversight
- `analytics.md` - Platform analytics

### Backend Documentation
**Base Path**: `docs/backend/`

#### 🌐 API Endpoints (`/endpoints/`)
RESTful API documentation:

**Authentication**:
- `auth/register.md` - User registration
- `auth/login.md` - User login
- `auth/verify-email.md` - Email verification
- `auth/forgot-password.md` - Password reset request
- `auth/reset-password.md` - Password reset

**Recipe Operations**:
- `recipes/list.md` - List/search recipes
- `recipes/get.md` - Get recipe details
- `recipes/create.md` - Create recipe
- `recipes/update.md` - Update recipe
- `recipes/delete.md` - Delete recipe
- `recipes/favorite.md` - Add to favorites
- `recipes/unfavorite.md` - Remove from favorites
- `recipes/similar.md` - Find similar recipes

**AI/LLM**:
- `llm/query.md` - AI recipe generation

**Profile Management**:
- `profile/get.md` - Get user profile
- `profile/update.md` - Update profile
- `profile/upload-picture.md` - Profile picture upload

**Admin Operations**:
- `admin/users.md` - User management
- `admin/recipes.md` - Recipe moderation
- `admin/analytics.md` - Platform analytics

**Support**:
- `feedback/create.md` - User feedback submission

#### 🏗️ Services (`/services/`)
Business logic layer:

**Core Services**:
- `auth.md` - Authentication service
- `recipe.md` - Recipe management
- `llm.md` - AI integration
- `profile.md` - Profile management
- `email.md` - Email operations
- `embedding.md` - Vector embeddings

**Support Services**:
- `feedback.md` - Feedback handling
- `analytics.md` - Analytics service
- `storage.md` - File storage (S3)

#### 🗄️ Models (`/models/`)
Data models and schema:

**Core Models**:
- `user.md` - User account model
- `user-profile.md` - Profile information
- `recipe.md` - Recipe with embeddings
- `recipe-favorite.md` - Favorite relationships

**Dietary Models**:
- `dietary-preference.md` - Dietary preferences
- `allergen.md` - Allergen information

**Support Models**:
- `feedback.md` - User feedback
- `email-verification.md` - Email tokens

## 🔍 How to Use This Documentation

### For Targeted Development
1. **Identify the component** you need to work on
2. **Read the specific documentation** for that component
3. **Check dependencies** listed in the component docs
4. **Review version history** for rollback compatibility

### For Bug Fixes
1. **Locate the affected component** using error messages or user reports
2. **Read the component documentation** to understand current behavior
3. **Check known issues** section for existing problems
4. **Review testing coverage** to understand test scenarios

### For Feature Development
1. **Start with feature overview** in `/features/` directory
2. **Identify affected components** from the feature documentation
3. **Read individual component docs** for implementation details
4. **Check API integration** requirements in backend docs

### For Rollbacks
1. **Find the component** that needs to be rolled back
2. **Check version history** in component documentation
3. **Review breaking changes** between versions
4. **Identify safe rollback points** based on compatibility notes

## 📋 Documentation Standards

### Component Documentation Template
Each component document includes:
- **Purpose**: What the component does
- **Features**: Current functionality
- **Dependencies**: Required services/components
- **Props/API**: Interface definition
- **State Management**: Local and global state
- **Testing**: Test coverage and scenarios
- **Version History**: Change tracking
- **Rollback Guide**: Safe rollback information
- **Known Issues**: Current problems
- **Future Enhancements**: Planned improvements

### Versioning Strategy
- **Major Version**: Breaking changes requiring migration
- **Minor Version**: New features (backward compatible)
- **Patch Version**: Bug fixes and minor improvements

### Update Frequency
- **After each component change**: Update individual component docs
- **After feature completion**: Update feature overview docs
- **Weekly**: Review and update status indicators
- **Release cycles**: Comprehensive documentation review

## 🔗 Navigation Helpers

### Quick Links by Responsibility

**Frontend Developers**:
- [Frontend README](./frontend/README.md)
- [Component Index](./frontend/components/)
- [Feature Documentation](./frontend/features/)

**Backend Developers**:
- [Backend README](./backend/README.md)
- [API Documentation](./backend/endpoints/)
- [Service Documentation](./backend/services/)

**Full-Stack Features**:
- [Authentication System](./frontend/features/auth/README.md)
- [Recipe Management](./frontend/features/recipes/README.md)
- [Admin Features](./frontend/features/admin/README.md)

**DevOps/Infrastructure**:
- [Database Documentation](./backend/database/)
- [Deployment Guides](./ci-cd/)
- [Monitoring Setup](./backend/monitoring/)

### Search Strategy
Use this index to quickly find documentation by:
- **Component name**: Search for specific Vue component or Go service
- **Feature area**: Authentication, recipes, profiles, admin
- **User story**: Find components related to specific user workflows
- **Error context**: Locate components involved in error scenarios

## 🚧 Maintenance

### Keeping Documentation Current
1. **Update component docs** when modifying components
2. **Increment version numbers** for significant changes
3. **Add to known issues** when bugs are discovered
4. **Update rollback guides** when compatibility changes
5. **Review quarterly** for accuracy and completeness

### Documentation Quality Checks
- [ ] All components documented
- [ ] Version numbers current
- [ ] Dependencies accurately listed
- [ ] Known issues up to date
- [ ] Future enhancements reflect roadmap

---

**This granular documentation structure enables precise, targeted development and maintenance of the Alchemorsel application at the component level.**