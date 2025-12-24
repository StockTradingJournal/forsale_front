#!/bin/bash

echo "🚀 ForSale 프론트엔드 환경 설정을 시작합니다..."

# node_modules가 이미 있는지 확인
if [ -d "node_modules" ]; then
    echo "⚠️  기존 node_modules가 발견되었습니다. 삭제하고 새로 설치합니다."
    rm -rf node_modules
fi

# 의존성 설치
echo "📦 의존성 패키지를 설치합니다..."
npm install

echo "✅ 설정이 완료되었습니다!"
echo ""
echo "프론트엔드를 실행하려면 다음 명령어를 사용하세요:"
echo "  ./start.sh"
echo ""
echo "또는 수동으로 실행하려면:"
echo "  npm run dev"