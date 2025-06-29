# RecipeGeneratorView.vue

**Location**: `frontend/src/views/RecipeGeneratorView.vue`  
**Type**: Authenticated Page (Email Verified Required)  
**Version**: 1.3.0  
**Last Updated**: 2025-06-27

## Purpose
AI-powered recipe generation interface allowing users to create custom recipes using natural language.

## Features
- Natural language recipe request input
- AI-powered recipe generation via DeepSeek/OpenAI
- Real-time generation progress feedback
- Recipe preview with nutrition information
- Dietary restriction enforcement
- Similar recipe detection and bypass option
- Recipe modification capabilities

## User Stories
- ✅ As a user, I want to generate recipes using AI by describing what I want
- ✅ As a user, I want the AI to consider my dietary preferences
- ✅ As a user, I want to see if similar recipes exist
- ✅ As a user, I want to modify AI-generated recipes before saving
- ✅ As a user, I want to skip similarity checking for recipe variants

## Dependencies
- **Components**: 
  - RateLimitIndicator
  - ForkRecipeModal
  - NotificationToast
- **Services**: 
  - llm.service.ts
  - recipe.service.ts
- **Stores**: 
  - auth.store.ts
  - recipe.store.ts
- **Routes**: /generate (protected, email verified)

## Props
None

## Emits
None

## Authentication Requirements
- Must be authenticated
- Must have verified email address
- Rate limiting applied

## State Management
- **Local State**: 
  - Request text
  - Generation status
  - Generated recipe draft
  - Similar recipes
  - Loading states
- **Global State**: User dietary preferences

## API Integration
- `POST /api/v1/llm/query` - Generate recipe with AI
- `GET /api/v1/recipes/similar` - Find similar existing recipes
- `POST /api/v1/recipes` - Save generated recipe

## AI Generation Process
1. User input validation
2. Dietary preference injection
3. AI recipe generation
4. Nutrition calculation
5. Similar recipe detection
6. User review and modification
7. Recipe saving

## Dietary Safety Features
- ✅ Automatic dietary preference enforcement
- ✅ Allergen avoidance
- ✅ Cuisine preference consideration
- ✅ Safety validation before generation

## Rate Limiting
- Generation limits per user
- Visual rate limit indicator
- Graceful limit handling

## Error Handling
- AI service failures
- Rate limit exceeded
- Network connectivity issues
- Invalid input handling

## Responsive Design
- ✅ Mobile-optimized text input
- ✅ Touch-friendly controls
- ✅ Adaptive recipe preview

## Testing
- **Unit Tests**: AI service integration, dietary enforcement
- **E2E Tests**: `ui-tests/tests/recipes/ai-generation.test.js`
- **Coverage**: Generation flow, error states, dietary safety

## Known Issues
- 🔄 Search algorithm could be optimized for better similarity detection

## Version History
- **v1.3.0**: Current version with enhanced dietary safety
- **v1.2.x**: Added similar recipe detection
- **v1.1.x**: Improved nutrition calculation
- **v1.0.x**: Initial AI generation implementation

## Rollback Guide
- **Safe Rollback**: Compatible to v1.2.x
- **Critical Safety**: v1.3.0 required for dietary safety
- **API**: All LLM endpoints stable

## Future Enhancements
- [ ] Recipe regeneration options
- [ ] Multiple recipe variations
- [ ] Ingredient-based generation
- [ ] Cooking time constraints
- [ ] Advanced dietary filters

## Related Documentation
- [LLM Service](../../backend/services/llm.md)
- [Recipe Service](../../backend/services/recipe.md)
- [Dietary Safety](../features/recipes/dietary-safety.md)
- [Rate Limiting](../features/auth/rate-limiting.md)