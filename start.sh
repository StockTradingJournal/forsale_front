#!/bin/bash

echo "🎮 ForSale 프론트엔드를 시작합니다..."

# node_modules가 있는지 확인
if [ ! -d "node_modules" ]; then
    echo "❌ node_modules가 없습니다. 먼저 setup.sh를 실행해주세요."
    echo "   ./setup.sh"
    exit 1
fi

# 프론트엔드 실행
echo "🚀 프론트엔드를 실행합니다..."
echo "   프론트엔드 주소: http://localhost:5173"
echo ""
echo "프론트엔드를 중지하려면 Ctrl+C를 누르세요."
echo ""

npm run dev