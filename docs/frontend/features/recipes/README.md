# Recipe Management Feature

**Version**: 1.3.0  
**Last Updated**: 2025-06-27  
**Status**: Production Ready ✅

## Overview
Comprehensive recipe management system with CRUD operations, AI generation, advanced search, and personalization features.

## Features Included
- ✅ Recipe CRUD Operations (Create, Read, Update, Delete)
- ✅ AI-Powered Recipe Generation with DeepSeek/OpenAI
- ✅ Advanced Search with pgvector Embeddings
- ✅ Recipe Favoriting System
- ✅ Recipe Forking/Modification
- ✅ Dietary Restriction Enforcement
- ✅ Nutrition Calculation and Display
- ✅ Category and Cuisine Organization
- ✅ Author Attribution System

## Architecture

### Frontend Components
- **Pages**:
  - [RecipeListView](../../pages/RecipeListView.md) - Browse and search recipes
  - [RecipeDetailView](../../pages/RecipeDetailView.md) - View recipe details
  - [RecipeCreateView](../../pages/RecipeCreateView.md) - Manual recipe creation
  - [RecipeGeneratorView](../../pages/RecipeGeneratorView.md) - AI recipe generation
  - [FavoritesView](../../pages/FavoritesView.md) - User's favorite recipes

- **Components**:
  - [RecipeCard](../../components/RecipeCard.md) - Recipe display card
  - [ForkRecipeModal](../../components/ForkRecipeModal.md) - Recipe modification modal

- **Services**:
  - recipe.service.ts - Recipe CRUD operations
  - llm.service.ts - AI generation service

- **Stores**:
  - recipe.store.ts - Recipe state management

### Backend Components
- **Endpoints**:
  - `GET /api/v1/recipes` - List/search recipes
  - `GET /api/v1/recipes/:id` - Get recipe details
  - `POST /api/v1/recipes` - Create recipe
  - `PUT /api/v1/recipes/:id` - Update recipe
  - `DELETE /api/v1/recipes/:id` - Delete recipe
  - `POST /api/v1/recipes/:id/favorite` - Add to favorites
  - `DELETE /api/v1/recipes/:id/favorite` - Remove from favorites
  - `POST /api/v1/llm/query` - AI recipe generation

- **Models**:
  - Recipe (with pgvector embeddings)
  - RecipeFavorite

- **Services**:
  - recipe.go - Recipe business logic
  - llm.go - AI integration
  - embedding.go - Vector embeddings

## Recipe Data Model

### Core Recipe Fields
```typescript
interface Recipe {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  ingredients: string[];
  instructions: string[];
  category: string;           // breakfast, lunch, dinner, dessert, etc.
  cuisine: string;            // italian, mexican, asian, etc.
  dietary_preferences: string[]; // vegan, vegetarian, keto, etc.
  tags: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  author?: RecipeAuthor;
  isFavorite?: boolean;
}
```

### Nutrition Information
- Automatic calculation via AI analysis
- Per-serving nutritional breakdown
- Calorie, protein, carbs, fat tracking
- Dietary compatibility indicators

## AI Recipe Generation

### Generation Process
1. **User Input**: Natural language recipe request
2. **Dietary Integration**: Automatic dietary preference injection
3. **AI Processing**: DeepSeek/OpenAI API generation
4. **Nutrition Analysis**: Automatic nutritional calculation
5. **Similar Recipe Detection**: Vector similarity search
6. **User Review**: Preview and modification options
7. **Recipe Saving**: Final recipe storage

### Dietary Safety Features
- ✅ Automatic dietary restriction enforcement
- ✅ Allergen avoidance validation
- ✅ Cuisine preference consideration
- ✅ Safety rules in AI prompts (9 safety guidelines)
- ✅ Ingredient substitution for restrictions

### AI Integration
```typescript
// Example AI generation request
const generateRecipe = async (request: string, userPreferences: DietaryPreferences) => {
  const response = await llmService.generateRecipe({
    prompt: request,
    dietary_preferences: userPreferences.dietary_preferences,
    allergens: userPreferences.allergens,
    cuisine_preferences: userPreferences.cuisine_preferences
  });
  return response;
};
```

## Search and Discovery

### Advanced Search Features
- **Text Search**: Recipe names, descriptions, ingredients
- **Vector Search**: Semantic similarity using pgvector
- **Filters**: Category, cuisine, dietary preferences
- **Exclusions**: Allergen and ingredient avoidance
- **Sorting**: Relevance, date, favorites, calories

### Search API
```typescript
// Search parameters
interface SearchParams {
  q?: string;                    // Search query
  category?: string;             // Filter by category
  cuisine?: string;              // Filter by cuisine
  dietary?: string[];            // Dietary preferences
  exclude?: string[];            // Exclude allergens/ingredients
  sort?: 'relevance' | 'date' | 'favorites';
  limit?: number;
  offset?: number;
}
```

### Vector Embeddings
- Recipe embeddings generated on creation
- Semantic similarity matching
- Improved search relevance
- Similar recipe detection

## Recipe Operations

### Create Recipe
- Manual recipe entry form
- Ingredient and instruction management
- Category and cuisine selection
- Nutrition information input
- Image upload capability

### View Recipe
- Complete recipe display
- Nutrition facts panel
- Author information
- Favorite status indicator
- Interactive ingredient checklist

### Edit Recipe
- Owner-only editing permissions
- Version history tracking
- Change validation
- Updated nutrition recalculation

### Delete Recipe
- Owner and admin permissions
- Cascade deletion of related data
- Favorite removal handling
- Soft delete option

## Favoriting System

### Favorite Operations
- **Add Favorite**: `POST /api/v1/recipes/:id/favorite`
- **Remove Favorite**: `DELETE /api/v1/recipes/:id/favorite`
- **List Favorites**: `GET /api/v1/recipes?favorites=true`

### Frontend Integration
- Heart icon toggle on recipe cards
- Favorite status in recipe details
- Dedicated favorites page
- Real-time favorite updates

## Recipe Forking

### Fork Process
1. User clicks "Fork Recipe" button
2. Recipe data copied to new recipe
3. User modifies ingredients/instructions
4. AI recalculates nutrition if needed
5. New recipe saved with original attribution

### Fork Attribution
- Original recipe reference maintained
- Fork relationship tracking
- Author credit preservation

## Dietary Management

### Dietary Preferences
- Vegetarian, Vegan, Keto, Paleo, etc.
- Automatic recipe filtering
- AI generation compliance
- Search result filtering

### Allergen Management
- Common allergen tracking
- Recipe exclusion filtering
- AI generation safety
- Warning displays

## Performance Optimization

### Caching Strategy
- Recipe list caching
- Search result caching
- User favorite caching
- Image lazy loading

### Database Optimization
- Indexed search fields
- Vector index optimization
- Efficient pagination
- Query optimization

## Testing Coverage

### Unit Tests
- Recipe CRUD operations
- Search functionality
- Favoriting logic
- AI generation integration

### E2E Tests
- Recipe creation flow
- AI generation process
- Search and filtering
- Favorite management
- Recipe modification

## Error Handling

### Frontend Errors
- Network failures
- Validation errors
- AI service failures
- Search timeouts

### Backend Errors
- Database connection issues
- AI service downtime
- Invalid recipe data
- Permission violations

## Mobile Optimization
- Touch-friendly recipe cards
- Mobile-optimized forms
- Responsive recipe display
- Mobile search interface

## Version History
- **v1.3.0**: Current version with enhanced AI safety
- **v1.2.x**: Added recipe forking and modification
- **v1.1.x**: Improved search with vector embeddings
- **v1.0.x**: Initial recipe management implementation

## Known Issues
- 🔄 Search algorithm could be optimized for better similarity detection
- ❌ Recipe modification button missing from detail view

## Future Enhancements
- [ ] Recipe rating system
- [ ] Comment system for recipes
- [ ] Recipe collections/folders
- [ ] Meal planning integration
- [ ] Recipe import/export
- [ ] Advanced nutrition tracking
- [ ] Recipe scaling (serving size adjustment)
- [ ] Cooking timer integration
- [ ] Shopping list generation

## Configuration
```typescript
// Recipe configuration
const recipeConfig = {
  maxIngredients: 50,
  maxInstructions: 20,
  maxDescriptionLength: 500,
  supportedCategories: ['breakfast', 'lunch', 'dinner', 'dessert', 'snack'],
  supportedCuisines: ['italian', 'mexican', 'asian', 'american', 'french'],
  aiGenerationRateLimit: 10, // per hour
  searchResultsPerPage: 20
};
```

## Related Documentation
- [Backend Recipe Service](../../../backend/services/recipe.md)
- [Backend LLM Service](../../../backend/services/llm.md)
- [Recipe Model](../../../backend/models/recipe.md)
- [AI Integration Guide](../../../backend/ai-integration.md)