#!/bin/zsh
set -euo pipefail

PROJECT_DIR="/Users/davidhillier/Dropbox/AI Projects/forge"
BRANCH="main"

cd "$PROJECT_DIR"

echo ""
echo "Forge deployment"
echo "================"
echo "Project: $PROJECT_DIR"
echo "Branch:  $BRANCH"
echo ""

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "This folder is not a Git repository."
  echo "Press any key to close."
  read -k 1
  exit 1
fi

current_branch="$(git branch --show-current)"
if [[ "$current_branch" != "$BRANCH" ]]; then
  echo "You are on '$current_branch', not '$BRANCH'."
  echo "Switch to main before deploying."
  echo "Press any key to close."
  read -k 1
  exit 1
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "No GitHub remote named origin is configured."
  echo "Press any key to close."
  read -k 1
  exit 1
fi

echo "Checking for local changes..."
if [[ -z "$(git status --porcelain)" ]]; then
  echo "No local changes to deploy."
  echo ""
  echo "Press any key to close."
  read -k 1
  exit 0
fi

echo ""
echo "Running lint..."
npm run lint

echo ""
echo "Running production build..."
npm run build

echo ""
echo "Staging changes..."
git add .

commit_message="Update Forge $(date '+%Y-%m-%d %H:%M')"
echo "Creating commit: $commit_message"
git commit -m "$commit_message"

echo ""
echo "Pushing to GitHub..."
git push origin "$BRANCH"

echo ""
echo "Done."
echo "GitHub has been updated. Railway should automatically deploy from main."
echo ""
echo "Railway app:"
echo "https://forge-production-7649.up.railway.app"
echo ""
echo "Press any key to close."
read -k 1
