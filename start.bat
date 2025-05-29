@echo off
echo Spoustim Navareno...

IF NOT EXIST node_modules (
    echo Instalace zavislosti...
    npm install
)

start http://localhost:5173
npm run dev
pause
 