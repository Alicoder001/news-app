# Git Workflow

> **Versiya:** 1.0  
> **Yangilangan:** 2026-01-20

---

## Branch Strategy

### Main Branches

| Branch | Maqsad | Deploy |
|--------|--------|--------|
| \main\ | Production code | Auto → Production |
| \develop\ | Development | Auto → Staging |

### Feature Branches

\\\
feature/add-search
feature/telegram-miniapp
fix/article-loading
hotfix/api-crash
chore/update-deps
docs/api-documentation
\\\

---

## Branch Naming

\\\
<type>/<short-description>

Types:
- feature/  - Yangi funksiya
- fix/      - Bug fix
- hotfix/   - Urgent production fix
- chore/    - Maintenance
- docs/     - Documentation
- refactor/ - Code refactoring
- test/     - Test qo'shish
\\\

**Misollar:**
\\\ash
git checkout -b feature/user-authentication
git checkout -b fix/article-image-loading
git checkout -b docs/api-endpoints
\\\

---

## Commit Messages

### Conventional Commits

\\\
<type>(<scope>): <description>

[optional body]

[optional footer]
\\\

### Types

| Type | Tavsif |
|------|--------|
| \eat\ | Yangi funksiya |
| \ix\ | Bug fix |
| \docs\ | Documentation |
| \style\ | Formatting (no code change) |
| \efactor\ | Code refactoring |
| \	est\ | Tests |
| \chore\ | Maintenance |
| \perf\ | Performance |
| \ci\ | CI/CD changes |

### Scopes

\\\
web, mobile, api, db, pipeline, telegram, admin, docs
\\\

### Misollar

\\\ash
# Feature
git commit -m "feat(web): add article search functionality"

# Fix
git commit -m "fix(api): handle null category in article response"

# Docs
git commit -m "docs(api): add authentication endpoints documentation"

# Breaking change
git commit -m "feat(api)!: change article response format

BREAKING CHANGE: Article response now includes category object instead of categoryId"
\\\

---

## Workflow

### 1. Yangi Feature

\\\ash
# 1. develop dan yangi branch
git checkout develop
git pull origin develop
git checkout -b feature/my-feature

# 2. Kod yozish va commit
git add .
git commit -m "feat(web): add feature description"

# 3. Push
git push origin feature/my-feature

# 4. PR yaratish (GitHub)
# develop ← feature/my-feature

# 5. Code review va merge
\\\

### 2. Bug Fix

\\\ash
git checkout develop
git checkout -b fix/bug-description
# ... fix ...
git commit -m "fix(api): description"
git push origin fix/bug-description
# PR → develop
\\\

### 3. Hotfix (Production)

\\\ash
git checkout main
git checkout -b hotfix/critical-bug
# ... fix ...
git commit -m "fix(api): critical bug fix"
git push origin hotfix/critical-bug
# PR → main (urgent review)
# After merge: also merge to develop
\\\

---

## Pull Request

### PR Title

\\\
<type>(<scope>): <description>

Misollar:
feat(web): implement article search
fix(api): resolve rate limiting issue
\\\

### PR Template

\\\markdown
## Description
<!-- Nima qilindi? -->

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Testing
<!-- Qanday test qilindi? -->

## Screenshots
<!-- Agar UI o'zgargan bo'lsa -->

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added where needed
- [ ] Documentation updated
- [ ] Tests added/updated
\\\

### Review Process

1. **Author:** PR yaratish, reviewers tayinlash
2. **Reviewer:** Kod ko'rish, comments
3. **Author:** Feedback bo'yicha fix
4. **Reviewer:** Approve
5. **Author:** Squash and merge

---

## Git Commands

### Foydali Commands

\\\ash
# Branch ko'rish
git branch -a

# Remote sync
git fetch origin

# Rebase (feature branch yangilash)
git checkout feature/my-feature
git rebase develop

# Interactive rebase (commits tozalash)
git rebase -i HEAD~3

# Stash
git stash
git stash pop

# Undo last commit (keep changes)
git reset --soft HEAD~1

# View log
git log --oneline -20
\\\

### Xatoliklarni Tuzatish

\\\ash
# Wrong branch ga commit qilgan
git reset --soft HEAD~1
git stash
git checkout correct-branch
git stash pop
git commit -m "..."

# Merge conflict
git merge develop
# Fix conflicts in files
git add .
git commit -m "merge: resolve conflicts with develop"
\\\

---

## Protected Branches

### main
- ✅ Require PR
- ✅ Require 1 approval
- ✅ Require status checks
- ✅ No force push

### develop
- ✅ Require PR
- ✅ Require status checks
- ❌ No direct push

---

## Bog'liq Hujjatlar

- [Coding Guidelines](./CODING_GUIDELINES.md) - Kod standartlari
- [Deployment](./DEPLOYMENT.md) - Deploy jarayoni
