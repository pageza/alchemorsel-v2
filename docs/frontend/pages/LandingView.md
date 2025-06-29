# LandingView.vue

**Location**: `frontend/src/views/LandingView.vue`  
**Type**: Public Page  
**Version**: 1.3.0  
**Last Updated**: 2025-06-27

## Purpose
Landing page for unauthenticated users, showcasing the platform and encouraging registration.

## Features
- Hero section with value proposition
- Featured recipes display
- Call-to-action for registration
- Responsive design for all devices

## User Stories
- ✅ As a visitor, I want to see featured recipes to understand the platform value
- ✅ As a visitor, I want clear navigation to registration/login
- ✅ As a visitor, I want to understand what Alchemorsel offers

## Dependencies
- **Components**: RecipeCard, AppNavbar
- **Services**: recipe.service.ts (for featured recipes)
- **Stores**: recipe.store.ts
- **Routes**: Landing route (/)

## Props
None - Root route component

## State Management
- Uses recipe store for featured recipes
- No local state requirements

## API Integration
- `GET /api/v1/recipes` - Fetches featured recipes for display

## Responsive Design
- ✅ Mobile optimized
- ✅ Tablet compatible
- ✅ Desktop layouts

## Testing
- **E2E Tests**: `ui-tests/tests/auth/landing.test.js`
- **Coverage**: Hero section, featured recipes, navigation

## Known Issues
None currently identified

## Version History
- **v1.3.0**: Current stable version
- **v1.2.x**: Added featured recipes section
- **v1.1.x**: Initial implementation

## Rollback Guide
- **Safe Rollback**: Can revert to v1.2.x without breaking changes
- **Database**: No direct database dependencies
- **API**: Compatible with all API versions

## Future Enhancements
- [ ] Recipe preview overlays for unauthenticated users
- [ ] More compelling call-to-action content
- [ ] SEO optimization
- [ ] Performance metrics tracking

## Related Documentation
- [RecipeCard Component](../components/RecipeCard.md)
- [Recipe Feature](../features/recipes/README.md)
- [Authentication Feature](../features/auth/README.md)