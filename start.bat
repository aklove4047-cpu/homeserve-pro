@echo off
echo Starting HomeServe Pro (Website + Admin Panel + API)...
cd /d "%~dp0backend"
start "" http://localhost:4000
start "" http://localhost:4000/admin
node src/server.js
