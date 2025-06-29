# Frontend Documentation Index

**Version**: 1.3.0  
**Last Updated**: 2025-06-27  
**Framework**: Vue 3 + TypeScript + Vuetify

## Documentation Structure

### 📄 Pages
Core application views and routes:

#### Public Pages
- [LandingView](./pages/LandingView.md) - Landing page for unauthenticated users
- [AboutView](./pages/AboutView.md) - About page with platform information

#### Authentication Pages
- [LoginView](./pages/LoginView.md) - User login interface
- [RegisterView](./pages/RegisterView.md) - User registration with dietary preferences
- [ForgotPasswordView](./pages/ForgotPasswordView.md) - Password reset request
- [ResetPasswordView](./pages/ResetPasswordView.md) - Password reset form
- [VerifyEmailView](./pages/VerifyEmailView.md) - Email verification interface

#### Authenticated Pages
- [DashboardView](./pages/DashboardView.md) - Main user dashboard
- [ProfileView](./pages/ProfileView.md) - User profile display
- [EditProfileView](./pages/EditProfileView.md) - Profile editing interface

#### Recipe Pages
- [RecipeListView](./pages/RecipeListView.md) - Browse and search recipes
- [RecipeDetailView](./pages/RecipeDetailView.md) - Individual recipe view
- [RecipeCreateView](./pages/RecipeCreateView.md) - Manual recipe creation
- [RecipeGeneratorView](./pages/RecipeGeneratorView.md) - AI-powered recipe generation
- [FavoritesView](./pages/FavoritesView.md) - User's favorite recipes

#### Admin Pages
- [AdminDashboard](./pages/admin/AdminDashboard.md) - Admin control panel
- [UserManagement](./pages/admin/UserManagement.md) - User administration
- [RecipeModeration](./pages/admin/RecipeModeration.md) - Content moderation
- [AdminAnalytics](./pages/admin/AdminAnalytics.md) - Platform analytics

### 🧩 Components
Reusable UI components:

#### Core Components
- [AppNavbar](./components/AppNavbar.md) - Global navigation component
- [RecipeCard](./components/RecipeCard.md) - Recipe display card
- [EmailVerificationBanner](./components/EmailVerificationBanner.md) - Email verification prompt
- [NotificationToast](./components/NotificationToast.md) - Global notification system

#### Modal Components
- [FeedbackModal](./components/FeedbackModal.md) - User feedback interface
- [ForkRecipeModal](./components/ForkRecipeModal.md) - Recipe modification modal

#### UI Components
- [FeedbackButton](./components/FeedbackButton.md) - Floating feedback button
- [RateLimitIndicator](./components/RateLimitIndicator.md) - Rate limit status display

#### Icon Components
- [IconCommunity](./components/icons/IconCommunity.md) - Community icon
- [IconDocumentation](./components/icons/IconDocumentation.md) - Documentation icon
- [IconEcosystem](./components/icons/IconEcosystem.md) - Ecosystem icon
- [IconSupport](./components/icons/IconSupport.md) - Support icon
- [IconTooling](./components/icons/IconTooling.md) - Tooling icon

### 🚀 Features
Complete feature documentation:

#### Authentication Feature
- [Authentication System](./features/auth/README.md) - Complete auth implementation
- [Auth Store](./features/auth/auth-store.md) - Authentication state management
- [Router Guards](./features/auth/router-guards.md) - Route protection
- [Email Verification](./features/auth/email-verification.md) - Email verification system

#### Recipe Feature
- [Recipe Management](./features/recipes/README.md) - Complete recipe system
- [Recipe Store](./features/recipes/recipe-store.md) - Recipe state management
- [AI Generation](./features/recipes/ai-generation.md) - AI-powered recipe creation
- [Favoriting System](./features/recipes/favoriting.md) - Recipe favoriting
- [Search System](./features/recipes/search.md) - Advanced recipe search
- [Dietary Safety](./features/recipes/dietary-safety.md) - Dietary restriction enforcement

#### Profile Feature
- [Profile Management](./features/profiles/README.md) - User profile system
- [Profile Store](./features/profiles/profile-store.md) - Profile state management
- [Dietary Preferences](./features/profiles/dietary-preferences.md) - Dietary preference management

#### Admin Feature
- [Admin System](./features/admin/README.md) - Administrative features
- [User Management](./features/admin/user-management.md) - User administration
- [Content Moderation](./features/admin/content-moderation.md) - Content oversight
- [Analytics Dashboard](./features/admin/analytics.md) - Platform analytics

### 🔧 Services & Architecture

#### Services
- [API Service](./services/api.md) - Core API communication
- [Auth Service](./services/auth.md) - Authentication operations
- [Recipe Service](./services/recipe.md) - Recipe operations
- [LLM Service](./services/llm.md) - AI integration
- [User Service](./services/user.md) - User management

#### State Management
- [Store Architecture](./stores/README.md) - Pinia store structure
- [Auth Store](./stores/auth-store.md) - Authentication state
- [Recipe Store](./stores/recipe-store.md) - Recipe state
- [Notification Store](./stores/notification-store.md) - Global notifications

#### Routing
- [Router Configuration](./router/README.md) - Vue Router setup
- [Route Guards](./router/guards.md) - Authentication guards
- [Route Structure](./router/routes.md) - Application routes

#### Composables
- [useAuth](./composables/useAuth.md) - Authentication composable
- [useRecipes](./composables/useRecipes.md) - Recipe management composable
- [useNotification](./composables/useNotification.md) - Notification handling
- [useRateLimit](./composables/useRateLimit.md) - Rate limiting composable

### 📱 Cross-Cutting Concerns

#### Responsive Design
- [Mobile Optimization](./responsive/mobile.md) - Mobile-first design
- [Tablet Layout](./responsive/tablet.md) - Tablet optimizations
- [Desktop Experience](./responsive/desktop.md) - Desktop enhancements

#### Performance
- [Performance Optimization](./performance/README.md) - Performance strategies
- [Lazy Loading](./performance/lazy-loading.md) - Component lazy loading
- [Caching Strategy](./performance/caching.md) - Frontend caching

#### Testing
- [Testing Strategy](./testing/README.md) - Frontend testing approach
- [Unit Tests](./testing/unit-tests.md) - Component unit tests
- [E2E Tests](./testing/e2e-tests.md) - End-to-end testing

#### Accessibility
- [Accessibility Guidelines](./accessibility/README.md) - A11y implementation
- [Keyboard Navigation](./accessibility/keyboard.md) - Keyboard accessibility
- [Screen Reader Support](./accessibility/screen-reader.md) - Screen reader optimization

## Quick Start Guide

### Development Setup
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Run tests: `npm run test:unit`
4. Build for production: `npm run build`

### Key Directories
```
src/
├── views/           # Page components
├── components/      # Reusable components
├── stores/          # Pinia state management
├── services/        # API and business logic
├── composables/     # Vue composables
├── router/          # Vue Router configuration
├── types/           # TypeScript type definitions
└── assets/          # Static assets and styles
```

### Naming Conventions
- **Pages**: `ViewName.vue` (e.g., `DashboardView.vue`)
- **Components**: `ComponentName.vue` (e.g., `RecipeCard.vue`)
- **Stores**: `feature.store.ts` (e.g., `auth.store.ts`)
- **Services**: `feature.service.ts` (e.g., `recipe.service.ts`)
- **Composables**: `useFeature.ts` (e.g., `useAuth.ts`)

### Development Guidelines
- Follow Vue 3 Composition API patterns
- Use TypeScript for type safety
- Implement responsive design with Vuetify
- Write comprehensive tests for components
- Document all new features and components

## Related Documentation
- [Backend Documentation](../backend/README.md)
- [Project Architecture](../PROJECT_STRUCTURE.md)
- [API Documentation](../backend/api/README.md)
- [Deployment Guide](../ci-cd/deployment.md)