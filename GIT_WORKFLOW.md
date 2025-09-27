# Git Workflow Guide - AI Interview Assistant

## 🌿 Branch Structure

### Main Branches
- **`main`** - Production-ready code, stable releases
- **`develop`** - Integration branch for features (optional)

### Feature Branches
- **`feature/resume-upload`** - Resume parsing and upload functionality
- **`feature/chat-interface`** - Chat UI and interview flow
- **`feature/interviewer-dashboard`** - Dashboard for interviewers
- **`feature/state-management`** - Redux store and state management

## 🚀 Current Status

✅ **All branches created and pushed to remote**
- Main branch: Contains complete working application
- Feature branches: Ready for individual feature development

## 📋 Branch Usage Guide

### Working on Resume Upload Feature
```bash
git checkout feature/resume-upload
# Make changes to resume-related components
git add .
git commit -m "feat: improve resume parsing accuracy"
git push origin feature/resume-upload
```

### Working on Chat Interface
```bash
git checkout feature/chat-interface
# Make changes to chat components
git add .
git commit -m "feat: add typing indicators"
git push origin feature/chat-interface
```

### Working on Interviewer Dashboard
```bash
git checkout feature/interviewer-dashboard
# Make changes to dashboard components
git add .
git commit -m "feat: add candidate filtering"
git push origin feature/interviewer-dashboard
```

### Working on State Management
```bash
git checkout feature/state-management
# Make changes to Redux store
git add .
git commit -m "feat: add new action types"
git push origin feature/state-management
```

## 🔄 Merging Features

### Option 1: Merge to Main (Recommended for this project)
```bash
git checkout main
git merge feature/resume-upload
git push origin main
```

### Option 2: Create Pull Requests (Professional workflow)
1. Go to GitHub repository
2. Create Pull Request from feature branch to main
3. Review and merge through GitHub interface

## 🏷️ Tagging Releases

### Create a Release Tag
```bash
git tag -a v1.0.0 -m "Initial release - Complete AI Interview Assistant"
git push origin v1.0.0
```

### List Tags
```bash
git tag
```

## 🧹 Branch Cleanup

### Delete Local Branches (after merging)
```bash
git branch -d feature/resume-upload
```

### Delete Remote Branches
```bash
git push origin --delete feature/resume-upload
```

## 📝 Commit Message Convention

Use conventional commits for better tracking:

- **feat:** New features
- **fix:** Bug fixes
- **docs:** Documentation changes
- **style:** Code style changes
- **refactor:** Code refactoring
- **test:** Adding tests
- **chore:** Maintenance tasks

### Examples:
```bash
git commit -m "feat: add resume validation"
git commit -m "fix: timer not stopping on question completion"
git commit -m "docs: update README with new features"
```

## 🔍 Useful Git Commands

### Check Status
```bash
git status
git log --oneline
git branch -a
```

### Stash Changes
```bash
git stash
git stash pop
```

### Reset Changes
```bash
git reset --hard HEAD
git clean -fd
```

## 🎯 Recommended Workflow for This Project

1. **Start with main branch** - Always up to date
2. **Create feature branch** - For specific features
3. **Develop and test** - Make incremental commits
4. **Push regularly** - Keep remote updated
5. **Merge to main** - When feature is complete
6. **Tag releases** - For important milestones

## 🚨 Important Notes

- Always pull latest changes before starting work
- Keep commits small and focused
- Write descriptive commit messages
- Test thoroughly before merging
- Use meaningful branch names

## 📊 Current Repository Status

- **Main Branch**: Complete working application
- **Feature Branches**: 4 branches created and pushed
- **Remote**: All branches synchronized
- **Ready for**: Individual feature development and collaboration

---

**Next Steps:**
1. Choose a feature branch to work on
2. Make your changes
3. Commit and push regularly
4. Merge back to main when complete
5. Create release tags for milestones
