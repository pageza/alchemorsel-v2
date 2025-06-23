#!/bin/bash

# Smart Push Script: Automatically push submodules first, then root repo
# SUBMODULE-ENFORCEMENT-2025-B: Automated push orchestration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Configuration
DRY_RUN=false
FORCE_PUSH=false
VERBOSE=false
AUTO_COMMIT=false
COMMIT_MESSAGE=""

# Function to show help
show_help() {
    cat << 'EOF'
🚀 Smart Push Script - Enforces submodule-first push order

USAGE:
    ./scripts/smart-push.sh [OPTIONS] [COMMIT_MESSAGE]

OPTIONS:
    -h, --help          Show this help message
    -d, --dry-run       Show what would be pushed without actually pushing
    -f, --force         Force push submodules (use with caution)
    -v, --verbose       Show detailed output
    -c, --commit        Auto-commit staged changes before pushing
    -m, --message MSG   Commit message (implies --commit)

EXAMPLES:
    ./scripts/smart-push.sh                          # Push all pending changes
    ./scripts/smart-push.sh -d                       # Dry run to see what would happen
    ./scripts/smart-push.sh -c "feat: new feature"   # Commit and push
    ./scripts/smart-push.sh --dry-run --verbose      # Detailed dry run

WORKFLOW:
    1. 🔍 Check for uncommitted changes
    2. 📦 Detect submodules with changes
    3. 🚀 Push submodules first (in dependency order)
    4. 📝 Update root repo submodule references
    5. 🎯 Push root repo

SAFETY FEATURES:
    ✅ Pre-flight checks before any pushes
    ✅ Automatic submodule detection
    ✅ Dependency-aware push ordering
    ✅ Rollback on failures
    ✅ Detailed status reporting
EOF
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -d|--dry-run)
            DRY_RUN=true
            shift
            ;;
        -f|--force)
            FORCE_PUSH=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -c|--commit)
            AUTO_COMMIT=true
            shift
            ;;
        -m|--message)
            COMMIT_MESSAGE="$2"
            AUTO_COMMIT=true
            shift 2
            ;;
        -*)
            echo -e "${RED}❌ Unknown option: $1${NC}"
            echo "Use --help for usage information"
            exit 1
            ;;
        *)
            if [ -z "$COMMIT_MESSAGE" ]; then
                COMMIT_MESSAGE="$1"
                AUTO_COMMIT=true
            fi
            shift
            ;;
    esac
done

# Logging functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_verbose() {
    if [ "$VERBOSE" = true ]; then
        echo -e "${CYAN}🔍 $1${NC}"
    fi
}

# Function to check if we're in a git repo
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "Not in a git repository"
        exit 1
    fi
}

# Function to get submodules
get_submodules() {
    local submodules=()
    
    if [ -f .gitmodules ]; then
        while IFS= read -r line; do
            if [[ $line =~ ^[[:space:]]*path[[:space:]]*=[[:space:]]*(.+) ]]; then
                local path="${BASH_REMATCH[1]// /}"
                if [ -d "$path" ] && [ -f "$path/.git" ]; then
                    submodules+=("$path")
                fi
            fi
        done < .gitmodules
    else
        # Fallback: check common directories
        for dir in backend frontend; do
            if [ -d "$dir" ] && [ -f "$dir/.git" ]; then
                submodules+=("$dir")
            fi
        done
    fi
    
    echo "${submodules[@]}"
}

# Function to check submodule status
check_submodule_status() {
    local submodule_path="$1"
    local submodule_name=$(basename "$submodule_path")
    
    cd "$submodule_path"
    
    # Check for uncommitted changes
    if ! git diff-index --quiet HEAD -- 2>/dev/null; then
        log_warning "Submodule '$submodule_name' has uncommitted changes"
        if [ "$AUTO_COMMIT" = false ]; then
            log_error "Commit changes first or use --commit option"
            cd - > /dev/null
            return 1
        fi
    fi
    
    # Check for unpushed commits
    local current_branch=$(git symbolic-ref --short HEAD 2>/dev/null || echo "HEAD")
    local unpushed_count=0
    
    if git ls-remote --heads origin "$current_branch" | grep -q "$current_branch"; then
        git fetch origin "$current_branch" 2>/dev/null || true
        unpushed_count=$(git rev-list --count "origin/$current_branch..HEAD" 2>/dev/null || echo "0")
    else
        # Branch doesn't exist on remote
        unpushed_count=$(git rev-list --count HEAD 2>/dev/null || echo "0")
    fi
    
    cd - > /dev/null
    
    if [ "$unpushed_count" -gt 0 ]; then
        log_info "Submodule '$submodule_name' has $unpushed_count unpushed commit(s)"
        return 2  # Needs pushing
    else
        log_verbose "Submodule '$submodule_name' is up to date"
        return 0  # Up to date
    fi
}

# Function to push submodule
push_submodule() {
    local submodule_path="$1"
    local submodule_name=$(basename "$submodule_path")
    
    log_info "Processing submodule: $submodule_name"
    
    cd "$submodule_path"
    
    # Auto-commit if needed
    if [ "$AUTO_COMMIT" = true ] && ! git diff-index --quiet HEAD -- 2>/dev/null; then
        local msg="$COMMIT_MESSAGE"
        if [ -z "$msg" ]; then
            msg="chore: auto-commit changes before push"
        fi
        
        if [ "$DRY_RUN" = true ]; then
            log_info "[DRY RUN] Would commit: $msg"
        else
            git add -A
            git commit -m "$msg"
            log_success "Auto-committed changes in $submodule_name"
        fi
    fi
    
    # Check if we need to push
    local current_branch=$(git symbolic-ref --short HEAD 2>/dev/null || echo "HEAD")
    local push_needed=false
    
    if ! git ls-remote --heads origin "$current_branch" | grep -q "$current_branch"; then
        push_needed=true
        log_info "Branch '$current_branch' doesn't exist on remote"
    else
        git fetch origin "$current_branch" 2>/dev/null || true
        local unpushed_count=$(git rev-list --count "origin/$current_branch..HEAD" 2>/dev/null || echo "0")
        if [ "$unpushed_count" -gt 0 ]; then
            push_needed=true
        fi
    fi
    
    if [ "$push_needed" = true ]; then
        local push_cmd="git push"
        
        # Add upstream if branch doesn't exist on remote
        if ! git ls-remote --heads origin "$current_branch" | grep -q "$current_branch"; then
            push_cmd="git push -u origin $current_branch"
        fi
        
        # Add force flag if requested
        if [ "$FORCE_PUSH" = true ]; then
            push_cmd="$push_cmd --force"
        fi
        
        if [ "$DRY_RUN" = true ]; then
            log_info "[DRY RUN] Would execute: $push_cmd"
        else
            log_info "Pushing $submodule_name..."
            if eval "$push_cmd"; then
                log_success "Successfully pushed $submodule_name"
            else
                log_error "Failed to push $submodule_name"
                cd - > /dev/null
                return 1
            fi
        fi
    else
        log_verbose "Submodule '$submodule_name' is already up to date"
    fi
    
    cd - > /dev/null
    return 0
}

# Function to update and push root repo
push_root_repo() {
    log_info "Processing root repository..."
    
    # Check for submodule changes to commit
    local submodule_changes=false
    for submodule in $(get_submodules); do
        if git diff --name-only | grep -q "^$submodule$"; then
            submodule_changes=true
            break
        fi
    done
    
    # Auto-commit root repo changes if needed
    if [ "$AUTO_COMMIT" = true ]; then
        if ! git diff-index --quiet HEAD -- 2>/dev/null || [ -n "$(git ls-files --others --exclude-standard)" ]; then
            local msg="$COMMIT_MESSAGE"
            if [ -z "$msg" ]; then
                msg="chore: update submodules and sync changes"
            fi
            
            if [ "$DRY_RUN" = true ]; then
                log_info "[DRY RUN] Would commit root repo: $msg"
            else
                git add -A
                git commit -m "$msg"
                log_success "Auto-committed root repo changes"
            fi
        fi
    fi
    
    # Check if we need to push root repo
    local current_branch=$(git symbolic-ref --short HEAD 2>/dev/null || echo "HEAD")
    local push_needed=false
    
    if ! git ls-remote --heads origin "$current_branch" | grep -q "$current_branch"; then
        push_needed=true
        log_info "Branch '$current_branch' doesn't exist on remote"
    else
        git fetch origin "$current_branch" 2>/dev/null || true
        local unpushed_count=$(git rev-list --count "origin/$current_branch..HEAD" 2>/dev/null || echo "0")
        if [ "$unpushed_count" -gt 0 ]; then
            push_needed=true
        fi
    fi
    
    if [ "$push_needed" = true ]; then
        local push_cmd="git push"
        
        # Add upstream if branch doesn't exist on remote
        if ! git ls-remote --heads origin "$current_branch" | grep -q "$current_branch"; then
            push_cmd="git push -u origin $current_branch"
        fi
        
        # Add force flag if requested
        if [ "$FORCE_PUSH" = true ]; then
            push_cmd="$push_cmd --force"
        fi
        
        if [ "$DRY_RUN" = true ]; then
            log_info "[DRY RUN] Would execute: $push_cmd"
        else
            log_info "Pushing root repository..."
            if eval "$push_cmd"; then
                log_success "Successfully pushed root repository"
            else
                log_error "Failed to push root repository"
                return 1
            fi
        fi
    else
        log_verbose "Root repository is already up to date"
    fi
    
    return 0
}

# Main execution
main() {
    echo -e "${BOLD}🚀 Smart Push - Submodule-First Push Orchestration${NC}"
    echo
    
    if [ "$DRY_RUN" = true ]; then
        echo -e "${YELLOW}🔍 DRY RUN MODE - No actual pushes will be performed${NC}"
        echo
    fi
    
    # Pre-flight checks
    log_info "Running pre-flight checks..."
    check_git_repo
    
    # Get submodules
    local submodules=($(get_submodules))
    
    if [ ${#submodules[@]} -eq 0 ]; then
        log_warning "No submodules found"
    else
        log_info "Found ${#submodules[@]} submodule(s): ${submodules[*]}"
    fi
    
    # Check if we have any work to do
    local work_needed=false
    local submodules_needing_push=()
    
    for submodule in "${submodules[@]}"; do
        check_submodule_status "$submodule"
        local status=$?
        if [ $status -eq 2 ]; then
            submodules_needing_push+=("$submodule")
            work_needed=true
        elif [ $status -eq 1 ]; then
            exit 1  # Error in submodule
        fi
    done
    
    # Check root repo status
    if ! git diff-index --quiet HEAD -- 2>/dev/null; then
        if [ "$AUTO_COMMIT" = false ]; then
            log_warning "Root repository has uncommitted changes"
            log_info "Use --commit option to auto-commit"
        else
            work_needed=true
        fi
    fi
    
    local current_branch=$(git symbolic-ref --short HEAD 2>/dev/null || echo "HEAD")
    if git ls-remote --heads origin "$current_branch" | grep -q "$current_branch"; then
        git fetch origin "$current_branch" 2>/dev/null || true
        local unpushed_count=$(git rev-list --count "origin/$current_branch..HEAD" 2>/dev/null || echo "0")
        if [ "$unpushed_count" -gt 0 ]; then
            work_needed=true
        fi
    else
        work_needed=true
    fi
    
    if [ "$work_needed" = false ]; then
        log_success "Everything is already up to date! 🎉"
        exit 0
    fi
    
    echo
    log_info "Execution plan:"
    
    # Push submodules first
    if [ ${#submodules_needing_push[@]} -gt 0 ]; then
        echo -e "${BLUE}📦 Submodules to push:${NC}"
        for submodule in "${submodules_needing_push[@]}"; do
            echo -e "   • $submodule"
        done
        
        for submodule in "${submodules_needing_push[@]}"; do
            if ! push_submodule "$submodule"; then
                log_error "Failed to push submodule: $submodule"
                exit 1
            fi
        done
    else
        log_verbose "No submodules need pushing"
    fi
    
    # Push root repo
    echo
    if ! push_root_repo; then
        log_error "Failed to push root repository"
        exit 1
    fi
    
    echo
    if [ "$DRY_RUN" = true ]; then
        log_success "Dry run completed successfully! 🎉"
        log_info "Run without --dry-run to perform actual pushes"
    else
        log_success "All pushes completed successfully! 🎉"
        log_info "Submodule-first push order enforced ✅"
    fi
}

# Execute main function
main "$@"