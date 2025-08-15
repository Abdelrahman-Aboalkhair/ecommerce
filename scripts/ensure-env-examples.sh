#!/bin/bash

# Script to ensure .env.example files are properly tracked in git
# Run this script after creating or updating .env.example files

echo "🔍 Checking .env.example files..."

# Check if .env.example files exist
if [ -f "src/client/.env.example" ]; then
    echo "✅ src/client/.env.example exists"
else
    echo "❌ src/client/.env.example missing"
fi

if [ -f "src/server/.env.example" ]; then
    echo "✅ src/server/.env.example exists"
else
    echo "❌ src/server/.env.example missing"
fi

if [ -f "src/.env.example" ]; then
    echo "✅ src/.env.example exists"
else
    echo "❌ src/.env.example missing"
fi

echo ""
echo "📋 Checking git status..."

# Check if .env.example files are tracked by git
if git ls-files | grep -q "src/client/.env.example"; then
    echo "✅ src/client/.env.example is tracked by git"
else
    echo "❌ src/client/.env.example is NOT tracked by git"
    echo "   Run: git add src/client/.env.example"
fi

if git ls-files | grep -q "src/server/.env.example"; then
    echo "✅ src/server/.env.example is tracked by git"
else
    echo "❌ src/server/.env.example is NOT tracked by git"
    echo "   Run: git add src/server/.env.example"
fi

if git ls-files | grep -q "src/.env.example"; then
    echo "✅ src/.env.example is tracked by git"
else
    echo "❌ src/.env.example is NOT tracked by git"
    echo "   Run: git add src/.env.example"
fi

echo ""
echo "🔧 To add all .env.example files to git:"
echo "   git add src/*/.env.example src/.env.example"
echo ""
echo "🔧 To commit and push:"
echo "   git commit -m 'feat: update .env.example files'"
echo "   git push origin main"
