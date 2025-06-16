# Pull Request

## 📝 Description
<!-- Provide a brief description of the changes in this PR -->

## 🔗 Related Issues
<!-- Link to any related issues or feature requests -->
Closes #<!-- issue number -->

## 🧪 Type of Change
<!-- Mark the relevant option with an x -->
- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update
- [ ] 🧹 Code refactoring (no functional changes)
- [ ] ⚡ Performance improvement
- [ ] 🧪 Test additions or improvements
- [ ] 🔧 CI/CD improvements
- [ ] 🔐 Security improvements

## 🧪 Testing
<!-- Describe the testing you have performed -->

### Backend Testing
- [ ] Unit tests pass (`make test`)
- [ ] Integration tests pass
- [ ] API endpoints tested manually
- [ ] Database migrations tested

### Frontend Testing
- [ ] Unit tests pass (`npm run test:unit`)
- [ ] TypeScript compilation successful (`npm run type-check`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Manual testing performed
- [ ] Responsive design tested

### E2E Testing
- [ ] E2E tests pass (`npm test` in ui-tests)
- [ ] User journeys tested
- [ ] Cross-browser compatibility verified

## 📋 Checklist
<!-- Mark completed items with x -->

### Code Quality
- [ ] Code follows the project's style guidelines
- [ ] Self-review of code completed
- [ ] Code is documented (comments, JSDoc, etc.)
- [ ] No console.log statements left in production code
- [ ] No TODO/FIXME comments without associated issues

### Security
- [ ] No sensitive data (API keys, passwords) in code
- [ ] Input validation implemented where needed
- [ ] Authentication/authorization properly handled
- [ ] SQL injection prevention measures in place

### Performance
- [ ] Database queries optimized
- [ ] Frontend bundle size considered
- [ ] Caching strategies implemented where appropriate
- [ ] No unnecessary re-renders or network calls

### Documentation
- [ ] README updated if needed
- [ ] API documentation updated
- [ ] CHANGELOG updated
- [ ] Migration guide provided (if breaking changes)

## 📸 Screenshots
<!-- If applicable, add screenshots to help explain your changes -->

### Before
<!-- Screenshot of the current state -->

### After
<!-- Screenshot of the new state -->

## 🚀 Deployment Notes
<!-- Any special deployment instructions or considerations -->

### Environment Variables
<!-- List any new environment variables needed -->
- [ ] No new environment variables
- [ ] New environment variables documented

### Database Changes
- [ ] No database changes
- [ ] Migration scripts included
- [ ] Backwards compatible
- [ ] Data migration required

### Dependencies
- [ ] No new dependencies
- [ ] New dependencies justified and documented
- [ ] Security audit passed for new dependencies

## 🔍 Review Focus Areas
<!-- Highlight specific areas where you'd like reviewer attention -->

## 📝 Additional Notes
<!-- Any additional information for reviewers -->

---

## For Reviewers

### Review Checklist
- [ ] Code quality and style
- [ ] Test coverage adequate
- [ ] Security considerations addressed
- [ ] Performance impact acceptable
- [ ] Documentation complete
- [ ] Breaking changes properly communicated

### Testing Instructions
<!-- Specific instructions for manual testing -->

1. 
2. 
3. 

---

**Note:** This PR will trigger automated tests including:
- ✅ Backend unit and integration tests
- ✅ Frontend unit tests and linting
- ✅ E2E browser automation tests
- ✅ Security vulnerability scanning
- ✅ Code quality analysis