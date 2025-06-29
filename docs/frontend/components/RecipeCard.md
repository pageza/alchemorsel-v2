# RecipeCard.vue

**Location**: `frontend/src/components/RecipeCard.vue`  
**Type**: Reusable Component  
**Version**: 1.3.0  
**Last Updated**: 2025-06-27

## Purpose
Reusable card component for displaying recipe information in lists, grids, and search results.

## Features
- Recipe thumbnail image
- Recipe title and description
- Author information display
- Nutrition facts summary
- Category and cuisine tags
- Favorite status indicator
- Interactive favorite toggle
- Click-to-navigate functionality

## Props
```typescript
interface Props {
  recipe: Recipe;           // Complete recipe object
  showAuthor?: boolean;     // Display author info (default: true)
  clickable?: boolean;      // Enable click navigation (default: true)
  showFavorite?: boolean;   // Show favorite button (default: true)
  compact?: boolean;        // Compact display mode (default: false)
}
```

## Emits
```typescript
interface Emits {
  'favorite-toggled': Recipe;  // When favorite status changes
  'recipe-clicked': Recipe;    // When card is clicked
}
```

## Dependencies
- **Services**: recipe.service.ts (for favoriting)
- **Stores**: auth.store.ts (for authentication status)
- **Types**: Recipe, RecipeAuthor interfaces

## State Management
- **Local State**: 
  - Loading state for favorite toggle
  - Hover states
- **Props State**: Recipe data passed from parent

## Styling
- Vuetify Card component base
- Hover effects and transitions
- Responsive image handling
- Tag display with color coding
- Favorite heart icon animation

## Responsive Design
- ✅ Mobile card layout optimization
- ✅ Touch-friendly favorite button
- ✅ Adaptive image sizing
- ✅ Text truncation for long titles

## Accessibility
- Proper alt text for recipe images
- Keyboard navigation support
- Screen reader friendly labels
- High contrast favorite indicator

## API Integration
- `POST /api/v1/recipes/:id/favorite` - Toggle favorite status
- Uses recipe data passed via props

## User Interactions
- Card click → Navigate to recipe detail
- Favorite button → Toggle favorite status
- Image click → Navigate to recipe detail
- Author click → Navigate to author profile (future)

## Visual States
- **Default**: Standard card display
- **Compact**: Smaller card for lists
- **Loading**: Shimmer effect during data load
- **Favorited**: Highlighted favorite indicator
- **Hover**: Elevated card with shadow

## Testing
- **Unit Tests**: Props handling, event emission, favoriting
- **E2E Tests**: Card interaction, navigation, favorite toggle
- **Coverage**: All display modes and interactions

## Performance
- Lazy image loading
- Efficient favorite state updates
- Minimal re-renders on prop changes
- CSS-only hover effects

## Error Handling
- Missing image fallback
- API error handling for favoriting
- Graceful degradation for missing data

## Known Issues
None currently identified

## Usage Examples
```vue
<!-- Standard recipe card -->
<RecipeCard 
  :recipe="recipe" 
  @favorite-toggled="handleFavoriteToggle"
  @recipe-clicked="navigateToDetail"
/>

<!-- Compact card for lists -->
<RecipeCard 
  :recipe="recipe" 
  :compact="true"
  :show-author="false"
/>

<!-- Read-only card (no interactions) -->
<RecipeCard 
  :recipe="recipe" 
  :clickable="false"
  :show-favorite="false"
/>
```

## Version History
- **v1.3.0**: Current version with enhanced favoriting
- **v1.2.x**: Added compact display mode
- **v1.1.x**: Improved responsive design
- **v1.0.x**: Initial card implementation

## Rollback Guide
- **Safe Rollback**: Compatible to v1.2.x
- **Props Changes**: Compact mode added in v1.2.x
- **API**: Favorite endpoints stable across versions

## Future Enhancements
- [ ] Recipe rating display
- [ ] Cooking time indicator
- [ ] Difficulty level display
- [ ] Recipe sharing buttons
- [ ] Image lazy loading optimization
- [ ] Card skeleton loading state

## Related Documentation
- [Recipe Types](../types/recipe-types.md)
- [Recipe Service](../../backend/services/recipe.md)
- [Favoriting Feature](../features/recipes/favoriting.md)
- [RecipeListView](../pages/RecipeListView.md)