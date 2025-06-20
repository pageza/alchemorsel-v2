# 🏗️ Implementation Generator Process

**Automated generation of development artifacts from parsed specifications**

## 🎯 **Purpose**

This process takes the structured output from `INTAKE_PARSER.md` and generates all necessary development artifacts: tracking entries, test specifications, code templates, and implementation plans.

## 📥 **Input Requirements**

### **Required Input Structure:**
```yaml
item_type: "bug" | "feature" | "patch" | "improvement"
id: "ITEM-XXX"
title: "Brief descriptive title"
priority: "critical" | "high" | "medium" | "low"
component: "frontend" | "backend" | "fullstack" | "infrastructure"
description: "Detailed description"
acceptance_criteria: ["criterion1", "criterion2", ...]
files_affected: ["path/to/file1", "path/to/file2", ...]
user_stories: ["story1", "story2", ...]
dependencies: ["dep1", "dep2", ...]
effort_estimate: "X hours" | "X days"
tests_required: ["unit", "integration", "e2e", "visual", ...]
```

## 🏭 **Generation Process**

### **Step 1: Create Tracking Entry** 📋

#### **Auto-generate tracking file entry:**
```bash
# Determine target file based on item_type
if item_type == "bug": target_file = "tracking/BUGS.md"
if item_type == "feature": target_file = "tracking/FEATURES.md" 
if item_type == "patch": target_file = "tracking/PATCHES.md"
if item_type == "improvement": target_file = "tracking/IMPROVEMENTS.md"

# Generate unique ID
next_id = get_next_id_for_type(item_type)

# Create formatted entry
generate_tracking_entry(target_file, item_data)
```

#### **Generated Tracking Entry Template:**
```markdown
### 🔴 **{{ITEM_TYPE}}-{{ID}}: {{TITLE}}**
- **Status**: {{INITIAL_STATUS}}
- **Priority**: {{PRIORITY}}
- **Reporter**: {{SOURCE}} {{DATE}}
- **Component**: {{COMPONENT}}
- **Description**: 
  {{DESCRIPTION}}
- **Impact**: {{USER_IMPACT}}
- **Acceptance Criteria**:
{{#each ACCEPTANCE_CRITERIA}}
  - [ ] {{this}}
{{/each}}
- **Files Affected**: 
{{#each FILES_AFFECTED}}
  - `{{this}}`
{{/each}}
- **Dependencies**: {{DEPENDENCIES}}
- **Effort Estimate**: {{EFFORT_ESTIMATE}}
- **Tests Required**: {{TESTS_REQUIRED}}
- **Assigned**: Unassigned
- **Created**: {{DATE}}
- **Updated**: {{DATE}}
```

### **Step 2: Generate Test Specifications** 🧪

#### **Create Test Plan Document:**
```markdown
# Test Plan: {{ITEM_TYPE}}-{{ID}}

## Test Overview
- **Item**: {{TITLE}}
- **Type**: {{ITEM_TYPE}}
- **Component**: {{COMPONENT}}
- **Priority**: {{PRIORITY}}

## Test Categories Required

{{#if REQUIRES_UNIT_TESTS}}
### Unit Tests
{{#each FILES_AFFECTED}}
**File**: `{{this}}`
- **Test File**: `{{generate_test_path this "unit"}}`
- **Test Cases**:
{{#each ../ACCEPTANCE_CRITERIA}}
  - [ ] Test: {{this}}
  - [ ] Edge Case: {{generate_edge_case this}}
  - [ ] Error Case: {{generate_error_case this}}
{{/each}}
{{/each}}
{{/if}}

{{#if REQUIRES_INTEGRATION_TESTS}}
### Integration Tests
{{#each API_ENDPOINTS}}
**Endpoint**: `{{this}}`
- **Test File**: `{{generate_test_path this "integration"}}`
- **Test Cases**:
  - [ ] Happy path with valid data
  - [ ] Invalid data handling
  - [ ] Authentication/authorization
  - [ ] Error response format
  - [ ] Performance within limits
{{/each}}
{{/if}}

{{#if REQUIRES_E2E_TESTS}}
### E2E Tests
{{#each USER_WORKFLOWS}}
**Workflow**: {{this}}
- **Test File**: `ui-tests/specs/{{kebab_case this}}.spec.ts`
- **Test Cases**:
  - [ ] Complete user journey
  - [ ] Error handling and recovery
  - [ ] Cross-browser compatibility
  - [ ] Mobile responsiveness
{{/each}}
{{/if}}

{{#if REQUIRES_VISUAL_TESTS}}
### Visual Regression Tests
{{#each UI_COMPONENTS}}
**Component**: {{this}}
- **Screenshots**: Before/after comparison
- **Test Cases**:
  - [ ] Default state rendering
  - [ ] Interactive state changes
  - [ ] Responsive breakpoints
  - [ ] Dark/light mode (if applicable)
{{/each}}
{{/if}}

## Test Execution Order
1. **Unit Tests**: Run first, must pass before proceeding
2. **Integration Tests**: Test API and data layer
3. **Component Tests**: Test UI components in isolation
4. **E2E Tests**: Test complete user workflows
5. **Visual Tests**: Validate UI appearance

## Success Criteria
- [ ] All unit tests pass (100%)
- [ ] All integration tests pass (100%)
- [ ] E2E tests pass for critical paths (100%)
- [ ] Visual tests show no unintended changes
- [ ] Performance tests within acceptable limits
- [ ] Security tests pass (if applicable)

## Test Data Requirements
{{generate_test_data_requirements COMPONENT ACCEPTANCE_CRITERIA}}

## Mock/Stub Requirements
{{generate_mock_requirements DEPENDENCIES FILES_AFFECTED}}
```

### **Step 3: Generate Code Templates** 💻

#### **Backend Code Templates:**

##### **Test File Template (Go):**
```go
// File: {{generate_test_path FILE_PATH "unit"}}
package {{PACKAGE_NAME}}

import (
    "testing"
    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/mock"
    // Add other imports based on DEPENDENCIES
)

// Test{{FUNCTION_NAME}} tests the main functionality
func Test{{FUNCTION_NAME}}(t *testing.T) {
    // Arrange
    {{generate_test_setup ACCEPTANCE_CRITERIA}}
    
    // Act
    result, err := {{FUNCTION_NAME}}({{generate_test_params}})
    
    // Assert
    assert.NoError(t, err)
    {{#each ACCEPTANCE_CRITERIA}}
    assert.{{generate_assertion this}}
    {{/each}}
}

{{#each ACCEPTANCE_CRITERIA}}
// Test{{FUNCTION_NAME}}_{{camel_case this}} tests: {{this}}
func Test{{FUNCTION_NAME}}_{{camel_case this}}(t *testing.T) {
    // Arrange
    {{generate_specific_test_setup this}}
    
    // Act
    result, err := {{FUNCTION_NAME}}({{generate_test_params}})
    
    // Assert
    {{generate_specific_assertions this}}
}
{{/each}}

// Test{{FUNCTION_NAME}}_ErrorCases tests error handling
func Test{{FUNCTION_NAME}}_ErrorCases(t *testing.T) {
    testCases := []struct {
        name string
        input {{INPUT_TYPE}}
        expectedError string
    }{
        {{generate_error_test_cases ACCEPTANCE_CRITERIA}}
    }
    
    for _, tc := range testCases {
        t.Run(tc.name, func(t *testing.T) {
            // Act
            _, err := {{FUNCTION_NAME}}(tc.input)
            
            // Assert
            assert.Error(t, err)
            assert.Contains(t, err.Error(), tc.expectedError)
        })
    }
}
```

##### **API Handler Template (Go):**
```go
// File: {{FILE_PATH}}
package api

import (
    "net/http"
    "github.com/gin-gonic/gin"
    // Add imports based on DEPENDENCIES
)

{{#if ITEM_TYPE == "feature"}}
// {{HANDLER_NAME}} handles {{DESCRIPTION}}
func (h *{{HANDLER_STRUCT}}) {{HANDLER_NAME}}(c *gin.Context) {
    // Input validation
    {{generate_input_validation ACCEPTANCE_CRITERIA}}
    
    // Business logic
    {{generate_business_logic ACCEPTANCE_CRITERIA}}
    
    // Response
    {{generate_response_logic ACCEPTANCE_CRITERIA}}
}
{{/if}}

{{#if ITEM_TYPE == "bug"}}
// {{HANDLER_NAME}} - Fixed: {{DESCRIPTION}}
func (h *{{HANDLER_STRUCT}}) {{HANDLER_NAME}}(c *gin.Context) {
    // TODO: Implement fix for {{DESCRIPTION}}
    // Acceptance criteria:
    {{#each ACCEPTANCE_CRITERIA}}
    // - {{this}}
    {{/each}}
    
    // Placeholder implementation
    c.JSON(http.StatusOK, gin.H{"status": "fixed"})
}
{{/if}}
```

#### **Frontend Code Templates:**

##### **Vue Component Test Template:**
```typescript
// File: {{generate_test_path FILE_PATH "component"}}
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import {{COMPONENT_NAME}} from './{{COMPONENT_NAME}}.vue'

describe('{{COMPONENT_NAME}}', () => {
  let wrapper: any
  
  beforeEach(() => {
    wrapper = mount({{COMPONENT_NAME}}, {
      props: {
        {{generate_default_props ACCEPTANCE_CRITERIA}}
      }
    })
  })

  {{#each ACCEPTANCE_CRITERIA}}
  it('should {{lowercase this}}', async () => {
    // Arrange
    {{generate_component_test_setup this}}
    
    // Act
    {{generate_component_test_action this}}
    
    // Assert
    {{generate_component_test_assertion this}}
  })
  {{/each}}

  it('handles error states correctly', async () => {
    // Test error handling based on acceptance criteria
    {{generate_error_handling_tests ACCEPTANCE_CRITERIA}}
  })

  it('is accessible', async () => {
    // Basic accessibility tests
    expect(wrapper.find('[role]').exists()).toBe(true)
    expect(wrapper.find('[aria-label]').exists()).toBe(true)
  })
})
```

##### **E2E Test Template:**
```typescript
// File: ui-tests/specs/{{kebab_case TITLE}}.spec.ts
import { test, expect } from '@playwright/test'

test.describe('{{TITLE}}', () => {
  test.beforeEach(async ({ page }) => {
    // Setup test environment
    {{generate_e2e_setup COMPONENT USER_STORIES}}
  })

  {{#each USER_WORKFLOWS}}
  test('{{this}}', async ({ page }) => {
    // Navigate to relevant page
    {{generate_navigation_steps this}}
    
    // Execute user workflow
    {{generate_workflow_steps this ACCEPTANCE_CRITERIA}}
    
    // Verify expected outcomes
    {{generate_verification_steps this ACCEPTANCE_CRITERIA}}
  })
  {{/each}}

  {{#if ITEM_TYPE == "bug"}}
  test('regression test for {{TITLE}}', async ({ page }) => {
    // Specific test to prevent this bug from recurring
    {{generate_regression_test_steps ACCEPTANCE_CRITERIA}}
  })
  {{/if}}

  test('mobile responsiveness', async ({ page }) => {
    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    {{generate_mobile_test_steps ACCEPTANCE_CRITERIA}}
  })
})
```

### **Step 4: Generate Implementation Checklist** ✅

#### **Development Checklist Template:**
```markdown
# Implementation Checklist: {{ITEM_TYPE}}-{{ID}}

## Pre-Development
- [ ] **Review requirements** in tracking document
- [ ] **Understand acceptance criteria** completely
- [ ] **Check dependencies** are available
- [ ] **Review related code** for patterns
- [ ] **Create feature branch**: `{{ITEM_TYPE}}/{{kebab_case TITLE}}`

## Test Development (TDD)
### Unit Tests
{{#each FILES_AFFECTED}}
- [ ] **Create test file**: `{{generate_test_path this "unit"}}`
- [ ] **Write failing tests** for all acceptance criteria
- [ ] **Run tests** - confirm they fail initially
{{/each}}

### Integration Tests (if applicable)
{{#if REQUIRES_INTEGRATION_TESTS}}
{{#each API_ENDPOINTS}}
- [ ] **Create integration test**: `{{generate_test_path this "integration"}}`
- [ ] **Test API contract** and data flow
- [ ] **Test error handling** and edge cases
{{/each}}
{{/if}}

### E2E Tests (if applicable)
{{#if REQUIRES_E2E_TESTS}}
{{#each USER_WORKFLOWS}}
- [ ] **Create E2E test**: `ui-tests/specs/{{kebab_case this}}.spec.ts`
- [ ] **Test complete user journey**
- [ ] **Test error scenarios**
{{/each}}
{{/if}}

## Implementation
### Backend Changes
{{#if COMPONENT == "backend" || COMPONENT == "fullstack"}}
{{#each FILES_AFFECTED}}
{{#if (is_backend_file this)}}
- [ ] **Implement**: `{{this}}`
  - [ ] Add business logic
  - [ ] Add error handling  
  - [ ] Add input validation
  - [ ] Add logging
  - [ ] Follow existing patterns
{{/if}}
{{/each}}
{{/if}}

### Frontend Changes
{{#if COMPONENT == "frontend" || COMPONENT == "fullstack"}}
{{#each FILES_AFFECTED}}
{{#if (is_frontend_file this)}}
- [ ] **Implement**: `{{this}}`
  - [ ] Add UI components
  - [ ] Add state management
  - [ ] Add error handling
  - [ ] Add loading states
  - [ ] Follow design system
{{/if}}
{{/each}}
{{/if}}

### Database Changes (if applicable)
{{#if REQUIRES_DATABASE_CHANGES}}
- [ ] **Create migration**: `{{generate_migration_name TITLE}}`
- [ ] **Update models** if needed
- [ ] **Test migration** up and down
{{/if}}

## Testing & Validation
- [ ] **Run unit tests** - all pass
- [ ] **Run integration tests** - all pass  
- [ ] **Run E2E tests** - all pass
- [ ] **Manual testing** - verify acceptance criteria
- [ ] **Cross-browser testing** (if UI changes)
- [ ] **Mobile testing** (if UI changes)
- [ ] **Performance testing** (if applicable)

## Code Quality
- [ ] **Linting passes** (frontend: ESLint, backend: golangci-lint)
- [ ] **Type checking passes** (TypeScript)
- [ ] **Security scan passes**
- [ ] **Code review** self-review completed
- [ ] **Documentation updated** (if API changes)

## Integration & Deployment
- [ ] **Create pull request** with proper description
- [ ] **Link to tracking issue**: {{ITEM_TYPE}}-{{ID}}
- [ ] **Assign reviewers**
- [ ] **Monitor CI pipeline**
- [ ] **Address review feedback**
- [ ] **Merge after approval**

## Post-Implementation
- [ ] **Update tracking document** status to "✅ Complete"
- [ ] **Update STORIES.md** if user stories affected
- [ ] **Monitor for regressions** after deployment
- [ ] **Verify in production** (if applicable)

## Success Criteria Verification
{{#each ACCEPTANCE_CRITERIA}}
- [ ] **Verified**: {{this}}
{{/each}}

## Notes & Learnings
- **Implementation notes**: 
- **Challenges encountered**:
- **Lessons learned**:
- **Future improvements**:
```

### **Step 5: Generate Branch and Commit Strategy** 🌿

#### **Git Workflow Template:**
```bash
# Branch Creation
git checkout main
git pull origin main
git checkout -b {{ITEM_TYPE}}/{{kebab_case TITLE}}

# Commit Strategy (TDD approach)
git add {{TEST_FILES}}
git commit -m "test: add failing tests for {{TITLE}}

{{#each ACCEPTANCE_CRITERIA}}
- Test: {{this}}
{{/each}}

🤖 Generated with [Claude Code](https://claude.ai/code)
Co-Authored-By: Claude <noreply@anthropic.com>"

# Implementation commits
git add {{IMPLEMENTATION_FILES}}
git commit -m "{{COMMIT_TYPE}}: {{TITLE}}

{{#each ACCEPTANCE_CRITERIA}}
- {{this}}
{{/each}}

Fixes: {{ITEM_TYPE}}-{{ID}}

🤖 Generated with [Claude Code](https://claude.ai/code)
Co-Authored-By: Claude <noreply@anthropic.com>"

# Push and create PR
git push origin {{ITEM_TYPE}}/{{kebab_case TITLE}}
gh pr create --title "{{COMMIT_TYPE}}: {{TITLE}}" --body "$(cat PR_TEMPLATE.md)"
```

### **Step 6: Generate Documentation Updates** 📚

#### **Documentation Update Checklist:**
```markdown
# Documentation Updates for {{ITEM_TYPE}}-{{ID}}

## Tracking Documents
- [ ] **Add entry** to `{{TARGET_TRACKING_FILE}}`
- [ ] **Update status** as work progresses
- [ ] **Cross-reference** related issues

## User Stories (if applicable)
{{#if USER_STORIES}}
- [ ] **Update STORIES.md** implementation status
{{#each USER_STORIES}}
- [ ] **Mark story complete**: {{this}}
{{/each}}
{{/if}}

## API Documentation (if applicable)
{{#if API_CHANGES}}
- [ ] **Update OpenAPI spec** for new/changed endpoints
- [ ] **Update README.md** with new API examples
- [ ] **Update CLAUDE.md** if architectural changes
{{/if}}

## Architecture Documentation (if applicable)
{{#if ARCHITECTURAL_CHANGES}}
- [ ] **Update frontend-architecture.md** if frontend changes
- [ ] **Update backend README.md** if backend changes
- [ ] **Update CLAUDE.md** if major changes
{{/if}}

## Process Documentation (if applicable)
{{#if PROCESS_CHANGES}}
- [ ] **Update DEVELOPMENT_WORKFLOW.md** if process changes
- [ ] **Update CI documentation** if pipeline changes
{{/if}}
```

## 🔄 **Generator Execution**

### **Command-Line Interface:**
```bash
# Generate implementation artifacts
./scripts/generate-implementation.sh --spec="{{SPEC_FILE}}"

# Example usage:
./scripts/generate-implementation.sh --spec="bug-profile-edit-broken.yaml"
```

### **Automated Generation Workflow:**
1. **Parse input specification**
2. **Validate required fields**
3. **Generate unique IDs**
4. **Create all artifacts**
5. **Update tracking documents**
6. **Generate summary report**

### **Output Summary:**
```
✅ Generated Implementation Package for {{ITEM_TYPE}}-{{ID}}

📋 Created Files:
- tracking/{{TARGET_FILE}}: New entry added
- tests/{{TEST_PLAN_FILE}}: Comprehensive test plan
- templates/{{IMPLEMENTATION_CHECKLIST}}: Step-by-step checklist
- templates/{{CODE_TEMPLATES}}: Starter code templates

🎯 Next Steps:
1. Review generated artifacts
2. Create feature branch: {{BRANCH_NAME}}
3. Follow implementation checklist
4. Execute TDD workflow

📊 Estimated Effort: {{EFFORT_ESTIMATE}}
🏷️ Priority: {{PRIORITY}}
📅 Target Completion: {{ESTIMATED_COMPLETION_DATE}}
```

---

**This systematic generation process ensures consistency, completeness, and quality in all development work while reducing manual overhead and potential oversights.**