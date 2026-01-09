#!/bin/bash

# Script para testar todos os métodos HTTP da API /api/transform
# Execute: chmod +x test-api-handlers.sh && ./test-api-handlers.sh

BASE_URL="${1:-http://localhost:3000}"
ENDPOINT="$BASE_URL/api/transform"

echo "🧪 Testando handlers da API: $ENDPOINT"
echo "========================================"
echo ""

# Test GET request (health check)
echo "1️⃣  Testando GET (health check)..."
GET_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$ENDPOINT")
GET_STATUS=$(echo "$GET_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
GET_BODY=$(echo "$GET_RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$GET_STATUS" = "200" ]; then
    echo "✅ GET retornou 200 OK"
    echo "   Response: $GET_BODY"
else
    echo "❌ GET retornou $GET_STATUS (esperado: 200)"
fi
echo ""

# Test OPTIONS request (CORS preflight)
echo "2️⃣  Testando OPTIONS (CORS preflight)..."
OPTIONS_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X OPTIONS "$ENDPOINT" -H "Origin: http://localhost:3000")
OPTIONS_STATUS=$(echo "$OPTIONS_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
OPTIONS_HEADERS=$(curl -s -I -X OPTIONS "$ENDPOINT" -H "Origin: http://localhost:3000" | grep -i "access-control")

if [ "$OPTIONS_STATUS" = "204" ]; then
    echo "✅ OPTIONS retornou 204 No Content"
    echo "   CORS Headers:"
    echo "$OPTIONS_HEADERS" | sed 's/^/   /'
    
    # Verificar se GET está nos métodos permitidos
    if echo "$OPTIONS_HEADERS" | grep -qi "access-control-allow-methods.*GET"; then
        echo "   ✅ GET está incluído nos métodos permitidos"
    else
        echo "   ⚠️  GET não encontrado nos métodos permitidos"
    fi
else
    echo "❌ OPTIONS retornou $OPTIONS_STATUS (esperado: 204)"
fi
echo ""

# Test POST request (sem auth, deve retornar 401)
echo "3️⃣  Testando POST (sem autenticação, deve retornar 401)..."
POST_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$ENDPOINT" \
    -H "Content-Type: application/json" \
    -d '{"imageUrls":[],"adjustments":{}}')
POST_STATUS=$(echo "$POST_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
POST_BODY=$(echo "$POST_RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$POST_STATUS" = "401" ]; then
    echo "✅ POST retornou 401 Unauthorized (esperado sem autenticação)"
    echo "   Response: $POST_BODY"
else
    echo "⚠️  POST retornou $POST_STATUS (esperado: 401 sem autenticação)"
fi
echo ""

# Summary
echo "========================================"
echo "📊 Resumo dos Testes:"
echo "   GET:      $([ "$GET_STATUS" = "200" ] && echo "✅ Passou" || echo "❌ Falhou")"
echo "   OPTIONS:  $([ "$OPTIONS_STATUS" = "204" ] && echo "✅ Passou" || echo "❌ Falhou")"
echo "   POST:     $([ "$POST_STATUS" = "401" ] && echo "✅ Passou" || echo "⚠️  Inesperado")"
echo ""
echo "💡 Para testar em produção, execute:"
echo "   ./test-api-handlers.sh https://seu-app.vercel.app"
