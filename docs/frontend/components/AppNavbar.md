# AppNavbar.vue

**Location**: `frontend/src/components/AppNavbar.vue`  
**Type**: Layout Component  
**Version**: 1.3.0  
**Last Updated**: 2025-06-27

## Purpose
Global navigation component providing consistent navigation across all pages.

## Features
- Responsive navigation bar
- User authentication status display
- Dynamic navigation menu based on auth state
- Mobile hamburger menu
- User profile dropdown
- Search functionality integration
- Admin access indicator

## Navigation Structure
### Unauthenticated Users
- Home/Landing
- Login
- Register

### Authenticated Users
- Dashboard
- Recipes (Browse)
- Generate Recipe (AI)
- Favorites
- Profile dropdown:
  - View Profile
  - Edit Profile
  - Settings
  - Logout

### Admin Users
- All authenticated features plus:
- Admin Dashboard
- User Management
- Recipe Moderation

## Props
None (uses global auth state)

## Emits
```typescript
interface Emits {
  'search-query': string;      // When search is performed
  'navigation-changed': string; // When navigation item is selected
}
```

## Dependencies
- **Stores**: auth.store.ts (user authentication status)
- **Services**: auth.service.ts (logout functionality)
- **Router**: Vue Router for navigation

## State Management
- **Global State**: 
  - User authentication status
  - User profile information
  - Admin role status
- **Local State**: 
  - Mobile menu open/closed
  - Search query
  - Dropdown states

## Responsive Behavior
- **Desktop**: Full horizontal navigation
- **Tablet**: Condensed navigation with dropdowns
- **Mobile**: Hamburger menu with overlay

## User Authentication Integration
- Displays user name and avatar when authenticated
- Shows login/register buttons when unauthenticated
- Hides protected routes from unauthenticated users

## Admin Features
- Admin badge/indicator for admin users
- Admin navigation items
- Admin panel quick access

## Search Integration
- Global search input (future enhancement)
- Recipe search functionality
- Search suggestions dropdown

## Styling
- Vuetify AppBar component
- Consistent brand colors
- Smooth transitions and animations
- Proper z-index layering

## Accessibility
- Keyboard navigation support
- Screen reader friendly labels
- High contrast navigation options
- Focus management for mobile menu

## Performance
- Lazy loading for user avatar
- Efficient state updates
- Minimal re-renders

## Testing
- **Unit Tests**: Authentication state handling, navigation
- **E2E Tests**: Navigation flows, mobile menu, logout
- **Coverage**: All navigation states and user types

## Error Handling
- Logout failure handling
- Navigation error recovery
- Missing user data graceful degradation

## Known Issues
None currently identified

## Mobile Menu Behavior
- Touch-friendly menu items
- Smooth slide animations
- Overlay backdrop for focus
- Automatic close on navigation

## Version History
- **v1.3.0**: Current version with admin features
- **v1.2.x**: Added user profile dropdown
- **v1.1.x**: Enhanced mobile responsiveness
- **v1.0.x**: Initial navigation implementation

## Rollback Guide
- **Safe Rollback**: Compatible to v1.2.x
- **Admin Features**: Admin nav added in v1.3.0
- **Mobile Menu**: Stable across versions

## Future Enhancements
- [ ] Global search integration
- [ ] Notification bell with counts
- [ ] User settings quick access
- [ ] Breadcrumb navigation
- [ ] Dark mode toggle
- [ ] Multi-language support

## CSS Classes
```scss
.app-navbar {
  // Main navbar styles
  &__brand { /* Brand/logo styles */ }
  &__menu { /* Navigation menu styles */ }
  &__user { /* User section styles */ }
  &__mobile { /* Mobile menu styles */ }
}
```

## Related Documentation
- [Auth Store](../features/auth/auth-store.md)
- [Auth Service](../../backend/services/auth.md)
- [Admin Features](../features/admin/README.md)
- [Responsive Design](../features/responsive-design.md)