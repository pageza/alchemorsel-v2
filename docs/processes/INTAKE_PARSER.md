# 📥 Issue Intake & Parsing Process

**Systematic process for parsing user reports into structured development items**

## 🎯 **Purpose**

When a user reports a bug, requests a feature, or describes an issue, this process helps AI assistants and developers systematically parse, categorize, and structure the information into actionable development items.

## 🔍 **Step 1: Initial Classification**

### **Classification Questions:**
1. **What type of issue is this?**
   - 🐛 **Bug**: Something is broken or not working as expected
   - 🚀 **Feature**: New functionality request
   - 🩹 **Patch**: Small improvement or polish (< 4 hours work)
   - 🔧 **Improvement**: Infrastructure, performance, or technical debt

2. **What is the scope?**
   - **Minimal**: Single component, < 4 hours
   - **Small**: 1-3 days work
   - **Medium**: 1-2 weeks work  
   - **Large**: > 2 weeks work

3. **What is the urgency?**
   - **Critical**: Blocks MVP or breaks core functionality
   - **High**: Important for user experience
   - **Medium**: Nice to have improvement
   - **Low**: Future enhancement

## 📝 **Step 2: Information Extraction**

### **Extract Key Information:**
- **Affected Component(s)**: Frontend, Backend, Database, CI/CD, etc.
- **Affected Files**: Specific files mentioned or likely to be affected (see File Discovery below)
- **User Impact**: How this affects end users
- **Current Behavior**: What currently happens (for bugs)
- **Expected Behavior**: What should happen
- **Steps to Reproduce**: For bugs, how to recreate the issue
- **Related Issues**: Links to similar or dependent issues

### **File Discovery Process:**
When determining "files affected", use systematic discovery:

#### **Frontend File Discovery:**
```bash
# Find components by feature area
find frontend/src/components -name "*.vue" | grep -i "[feature_keyword]"

# Find related services
find frontend/src/services -name "*.ts" | grep -i "[feature_keyword]"

# Find related stores
find frontend/src/stores -name "*.ts" | grep -i "[feature_keyword]"

# Find related views
find frontend/src/views -name "*.vue" | grep -i "[feature_keyword]"
```

#### **Backend File Discovery:**
```bash
# Find handlers by feature area
find backend/internal/api -name "*.go" | grep -i "[feature_keyword]"

# Find services
find backend/internal/service -name "*.go" | grep -i "[feature_keyword]"

# Find models
find backend/internal/models -name "*.go" | grep -i "[feature_keyword]"

# Find migrations
ls backend/migrations/ | grep -i "[feature_keyword]"
```

#### **Common File Patterns:**
- **Authentication features**: `auth.go`, `AuthService.vue`, `auth.store.ts`
- **Recipe features**: `recipe.go`, `RecipeCard.vue`, `recipe.service.ts`
- **Profile features**: `profile.go`, `ProfileView.vue`, `user.service.ts`
- **Database changes**: `migrations/[timestamp]_[description].sql`

### **Parse User Description:**
Look for these indicators:
- **"I can't..."** → Usually a bug
- **"It would be nice if..."** → Usually a feature
- **"When I click..."** → Likely a bug with steps to reproduce
- **"The app should..."** → Feature or improvement request
- **"This looks wrong..."** → UI/UX bug or patch

## 🏗️ **Step 3: Structured Documentation Creation**

### **For Bugs (🐛):**
Create entry in `tracking/BUGS.md`:

```markdown
### 🔴 **BUG-XXX: [Brief Title]**
- **Status**: 🔄 Active
- **Priority**: [Critical/High/Medium/Low]
- **Reporter**: [Source/Date]
- **Component**: [Frontend/Backend/Database/etc.]
- **Description**: 
  - [Clear description of the issue]
  - [Current behavior]
  - [Expected behavior]
- **Steps to Reproduce**:
  1. [Step 1]
  2. [Step 2]
  3. [Step 3]
- **Impact**: [How this affects users]
- **Acceptance Criteria**:
  - [ ] [Criterion 1]
  - [ ] [Criterion 2]
- **Files Affected**: 
  - `path/to/file1.ext`
  - `path/to/file2.ext`
- **Related Issues**: [Links to related bugs/features]
- **Assigned**: Unassigned
- **Created**: [Date]
- **Updated**: [Date]
```

### **For Features (🚀):**
Create entry in `tracking/FEATURES.md`:

```markdown
### 🔶 **FEATURE-XXX: [Feature Title]**
- **Status**: 📋 Planning
- **Priority**: [High/Medium/Low]
- **Type**: [New Feature/Enhancement]
- **Component**: [Component Name]
- **Description**: 
  - [Detailed feature description]
  - [Why this feature is needed]
  - [How it fits into the app]
- **Business Value**: [Why this matters for users/business]
- **Acceptance Criteria**:
  - [ ] [Criterion 1]
  - [ ] [Criterion 2]
- **User Stories**: 
  - [Link to stories in STORIES.md]
- **Dependencies**: 
  - [Other features/systems needed first]
- **Effort Estimate**: [X-Y days]
- **Files to Create/Modify**:
  - `path/to/new/file.ext` (create)
  - `path/to/existing/file.ext` (modify)
- **Assigned**: Unassigned
- **Created**: [Date]
- **Updated**: [Date]
```

### **For Patches (🩹):**
Create entry in `tracking/PATCHES.md`:

```markdown
### 🟡 **PATCH-XXX: [Patch Title]**
- **Status**: 🔄 Ready
- **Priority**: [High/Medium/Low]
- **Type**: [UI Polish/Workflow/Performance/etc.]
- **Component**: [Component Name]
- **Description**: 
  - [What needs to be improved]
  - [Current state vs desired state]
- **Impact**: [Why this improvement matters]
- **Acceptance Criteria**:
  - [ ] [Simple, testable criteria]
- **Files to Modify**:
  - `path/to/file.ext`
- **Effort Estimate**: [X hours (< 4)]
- **Source**: [Where this came from]
- **Assigned**: Unassigned
- **Created**: [Date]
- **Updated**: [Date]
```

## 🧪 **Step 4: Test Planning**

### **Identify Required Tests:**

#### **For Bugs:**
- [ ] **Regression Test**: Prevents the bug from happening again
- [ ] **Unit Tests**: Test the specific function/component
- [ ] **Integration Tests**: Test interaction between components
- [ ] **E2E Tests**: Test complete user workflow (if UI-related)

#### **For Features:**
- [ ] **Unit Tests**: Test individual functions/components
- [ ] **Integration Tests**: Test API endpoints and data flow
- [ ] **Component Tests**: Test UI components (if applicable)
- [ ] **E2E Tests**: Test complete user workflows
- [ ] **Performance Tests**: Test impact on app performance

#### **For Patches:**
- [ ] **Existing Tests**: Ensure existing functionality still works
- [ ] **Simple Validation**: Test the specific improvement
- [ ] **Visual Tests**: For UI changes

### **Test Categories by Component:**

#### **Frontend Tests Needed:**
- **Component Tests**: `ComponentName.test.ts`
- **Integration Tests**: API call interactions
- **E2E Tests**: User workflow tests
- **Visual Tests**: Screenshots/visual regression

#### **Backend Tests Needed:**
- **Unit Tests**: `service_test.go`, `handler_test.go`
- **Integration Tests**: Database interactions
- **API Tests**: Endpoint behavior
- **Performance Tests**: Load and response time

#### **Full Stack Tests Needed:**
- **E2E Tests**: Complete user journeys
- **System Tests**: Cross-component interactions
- **Security Tests**: Authentication and authorization

## 📋 **Step 5: User Story Mapping**

### **Create/Reference User Stories:**

#### **Story Format:**
```
As a [user type]
I want [functionality] 
So that [benefit/value]
```

#### **Map to Existing Stories:**
1. Check `STORIES.md` for existing related stories
2. Reference existing story IDs when possible
3. Create new stories if none exist
4. Update implementation status in `STORIES.md`

#### **Story Categories:**
- **User Stories**: End-user facing functionality
- **Admin Stories**: Administrative functionality
- **Developer Stories**: Technical/infrastructure needs
- **API Stories**: Integration requirements

## 🔄 **Step 6: Dependencies & Impact Analysis**

### **Identify Dependencies:**
- **Technical Dependencies**: What systems/features must exist first
- **Design Dependencies**: UI/UX design requirements
- **Data Dependencies**: Database schema changes needed
- **External Dependencies**: Third-party services or APIs

### **Impact Analysis:**
- **Breaking Changes**: Will this break existing functionality?
- **Performance Impact**: How will this affect app performance?
- **Security Impact**: Any security considerations?
- **User Experience Impact**: How does this affect user workflows?

## 📊 **Step 7: Prioritization Matrix**

### **Priority Calculation:**
```
Priority = (User Impact × Business Value × Urgency) / (Effort × Risk)

Where:
- User Impact: 1-5 (how many users affected)
- Business Value: 1-5 (importance to business goals)
- Urgency: 1-5 (how quickly this is needed)
- Effort: 1-5 (development time/complexity)
- Risk: 1-5 (chance of breaking things)
```

### **Priority Levels:**
- **Critical**: Score > 8, MVP blocker
- **High**: Score 6-8, important for launch
- **Medium**: Score 4-6, post-MVP enhancement
- **Low**: Score < 4, future consideration

## 🎯 **Step 8: Assignment to MVP Phases**

### **MVP Phase Assignment:**
- **Phase 1 (Week 1)**: Critical bugs and blockers
- **Phase 2 (Week 2)**: Essential features for MVP
- **Phase 3 (Week 3)**: MVP polish and optimization
- **Phase 4 (Week 4)**: Production readiness
- **Post-MVP**: Future enhancements

### **Decision Criteria:**
- **MVP Essential**: Required for basic app functionality
- **MVP Nice-to-Have**: Improves experience but not required
- **Post-MVP**: Can be added after launch

## 📤 **Step 9: Output Generation**

### **Generate Specification Document:**
Create a comprehensive spec document that includes:
1. **Classification and metadata**
2. **Detailed requirements**
3. **Test plans**
4. **User story mappings**
5. **Implementation approach**
6. **Success criteria**

### **Update Tracking Documents:**
1. Add entry to appropriate tracking file
2. Update related user stories in `STORIES.md`
3. Cross-reference with existing issues
4. Update MVP gameplan if needed

## 🔍 **Parsing Examples**

### **Example 1: Bug Report**
**User Input**: *"When I click 'Edit Profile' on the /profile page, nothing happens and I see errors in the console. The page should navigate to the edit form."*

**Parsed Output:**
- **Type**: 🐛 Bug
- **Priority**: High (blocks core functionality)
- **Component**: Frontend Navigation
- **Files**: `ProfileView.vue`, router configuration
- **Tests Needed**: Navigation test, error handling test
- **User Story**: Profile management story

### **Example 2: Feature Request**
**User Input**: *"It would be great if recipes could have AI-generated images automatically when they're saved."*

**Parsed Output:**
- **Type**: 🚀 Feature
- **Priority**: Medium (enhancement)
- **Component**: Backend AI Service + Frontend Display
- **Files**: New image service, recipe components
- **Tests Needed**: API integration, image display, error handling
- **User Story**: Recipe enhancement story

### **Example 3: Polish Item**
**User Input**: *"The checkboxes on the ingredients list don't serve any purpose and make the recipe view look cluttered."*

**Parsed Output:**
- **Type**: 🩹 Patch
- **Priority**: Medium (UI polish)
- **Component**: Frontend Recipe Display
- **Files**: `RecipeDetailView.vue`
- **Tests Needed**: Visual regression test
- **User Story**: Recipe display improvement

---

**This systematic approach ensures no details are lost and every issue is properly categorized and structured for efficient development.**