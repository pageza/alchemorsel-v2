# DashboardView.vue

**Location**: `frontend/src/views/DashboardView.vue`  
**Type**: Authenticated Page  
**Version**: 1.3.0  
**Last Updated**: 2025-06-27

## Purpose
Main dashboard for authenticated users providing overview and quick access to key features.

## Features
- Welcome message with user name
- Quick stats (favorite count, created recipes)
- Recent recipes created by user
- Personalized recipe recommendations
- Quick actions (create recipe, generate with AI)
- Email verification status banner

## User Stories
- ✅ As a user, I want to see my dashboard after login
- ✅ As a user, I want quick access to create recipes
- ✅ As a user, I want to see my recent activity
- ✅ As a user, I want personalized recommendations
- ✅ As a user, I want to know if my email needs verification

## Dependencies
- **Components**: 
  - RecipeCard
  - EmailVerificationBanner
- **Services**: 
  - dashboard.service.ts
  - recipe.service.ts
  - user.service.ts
- **Stores**: 
  - auth.store.ts
  - recipe.store.ts
- **Routes**: /dashboard (protected)

## Props
None

## Emits
None

## State Management
- **Local State**: Dashboard metrics, recent recipes
- **Global State**: User authentication status, profile data
- **Loading States**: Dashboard data loading indicators

## API Integration
- `GET /api/v1/dashboard/stats` - User statistics
- `GET /api/v1/recipes?user_id=current` - User's recent recipes
- `GET /api/v1/recipes/recommendations` - Personalized recommendations

## Authentication Requirements
- Must be authenticated user
- Router guard protection
- Email verification status display

## Data Display
- User statistics cards
- Recent recipes grid
- Recommendation sections
- Quick action buttons

## Navigation
- Links to recipe creation
- Links to AI generation
- Links to favorites
- Links to profile management

## Responsive Design
- ✅ Card grid layout adapts to screen size
- ✅ Mobile-optimized quick actions
- ✅ Tablet-friendly stats display

## Performance
- Lazy loading for recipe cards
- Caching for dashboard stats
- Efficient API data fetching

## Testing
- **Unit Tests**: Dashboard data loading, user stats display
- **E2E Tests**: `ui-tests/tests/dashboard/dashboard.test.js`
- **Coverage**: Authentication flow, data display, navigation

## Error Handling
- API failure graceful degradation
- Loading state management
- Empty state handling

## Known Issues
None currently identified

## Version History
- **v1.3.0**: Current version with enhanced dashboard
- **v1.2.x**: Added email verification banner
- **v1.1.x**: Added personalized recommendations
- **v1.0.x**: Basic dashboard implementation

## Rollback Guide
- **Safe Rollback**: Compatible to v1.2.x
- **API Compatibility**: All dashboard endpoints stable
- **Database**: No schema dependencies

## Future Enhancements
- [ ] Activity feed
- [ ] Recipe creation analytics
- [ ] Meal planning integration
- [ ] Social features preview
- [ ] Achievement badges

## Related Documentation
- [Dashboard Service](../../backend/services/dashboard.md)
- [Auth Store](../features/auth/auth-store.md)
- [Recipe Store](../features/recipes/recipe-store.md)
- [EmailVerificationBanner](../components/EmailVerificationBanner.md)