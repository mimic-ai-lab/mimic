#!/usr/bin/env bash
# mimic-update.sh  –  add Next.js dashboard + fix turbo.json
set -euo pipefail

echo "⏩  Updating Mimic monorepo …"

### 1. Fix turbo.json (“pipeline” → “tasks”) ############################
if grep -q '"pipeline"' turbo.json; then
  echo "⚙️  Converting turbo.json pipeline → tasks"
  # BSD-sed (mac) vs GNU-sed (Linux); pick whichever is available
  sed -i.bak 's/"pipeline":/"tasks":/' turbo.json && rm turbo.json.bak
fi

### 2. Create apps/web (Next.js 14) ####################################
if [ ! -d apps/web ]; then
  echo "📁  Creating apps/web"
  mkdir -p apps/web/src/app
  cat > apps/web/package.json <<'JSON'
{
  "name": "@mimic/web",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000"
  },
  "dependencies": {
    "@mimic/core": "workspace:*",
    "next": "14.2.3",
    "react": "18.3.0",
    "react-dom": "18.3.0"
  }
}
JSON

  cat > apps/web/next.config.js <<'JS'
/** @type {import('next').NextConfig} */
module.exports = { reactStrictMode: true }
JS

  cat > apps/web/src/app/page.tsx <<'TSX'
export default function Home() {
  return (
    <main style={{fontFamily:"sans-serif",padding:"2rem"}}>
      <h1>Mimic Dashboard</h1>
      <p>Your API is at <code>http://localhost:4000/health</code></p>
    </main>
  );
}
TSX
fi

### 3. Add Fastify CORS helper (if missing) ############################
if ! yarn workspace @mimic/api list --pattern "@fastify/cors" | grep -q "@fastify/cors"; then
  echo "➕  Adding @fastify/cors to API workspace"
  yarn workspace @mimic/api add @fastify/cors@^8
fi

### 4. Install any missing deps ########################################
echo "📦  Installing/refreshing dependencies"
yarn install

echo -e "\n✅  Update complete!  Run  yarn dev  to launch API (:4000), Web (:3000) & Worker."