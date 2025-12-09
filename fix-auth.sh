#!/bin/bash

echo "🧹 Clearing build cache..."
rm -rf .next node_modules/.cache

echo "🔧 Regenerating Prisma client..."
npx prisma generate

echo "✅ Done! The dev server should automatically restart."
echo "📍 Visit: http://localhost:3000/landing"
