#!/bin/bash

# ProfitOps - Ejemplos de Testing del Workflow n8n
# Ejecuta estos comandos para probar el workflow

WEBHOOK_URL="https://profitops.app.n8n.cloud/webhook/7f477b94-4cb6-4f41-938a-5e987e7f1254"

echo "🚀 ProfitOps - Testing del Workflow n8n"
echo "========================================"
echo ""

# Función helper para hacer las pruebas
test_endpoint() {
  local name=$1
  local data=$2

  echo "📝 Test: $name"
  echo "Request:"
  echo "$data" | jq '.'
  echo ""
  echo "Response:"
  curl -s -X POST "$WEBHOOK_URL" \
    -H "Content-Type: application/json" \
    -d "$data" | jq '.'
  echo ""
  echo "---"
  echo ""
}

# Test 1: Actualizar solo el MRR
echo "Test 1: Actualizar MRR"
test_endpoint "Actualizar MRR" '{
  "deal": "Datatechnic México",
  "updates": {
    "mrr": 40000
  }
}'

# Test 2: Cambiar etapa
echo "Test 2: Cambiar Etapa"
test_endpoint "Cambiar a Negociación" '{
  "deal": "Datatechnic México",
  "updates": {
    "stage_id": 4
  }
}'

# Test 3: Agregar nota
echo "Test 3: Agregar Nota"
test_endpoint "Agregar Nota" '{
  "deal": "Datatechnic México",
  "updates": {
    "nota": "Demo exitoso con el cliente. Muy interesado en el producto."
  }
}'

# Test 4: Crear actividad
echo "Test 4: Crear Actividad"
test_endpoint "Crear Actividad de Seguimiento" '{
  "deal": "Datatechnic México",
  "actividad": {
    "titulo": "Llamada de seguimiento",
    "tipo": "call",
    "fecha": "2025-01-15"
  }
}'

# Test 5: Actualización completa
echo "Test 5: Actualización Completa"
test_endpoint "Actualización Completa" '{
  "deal": "Datatechnic México",
  "updates": {
    "mrr": 45000,
    "stage_id": 4,
    "probabilidad": 75,
    "fecha_cierre": "2025-02-15",
    "nota": "Negociación avanzada. Cliente confirmó presupuesto."
  },
  "actividad": {
    "titulo": "Reunión de cierre",
    "tipo": "meeting",
    "fecha": "2025-02-01"
  },
  "completar_actividad": true
}'

# Test 6: Deal inexistente (debe dar error controlado)
echo "Test 6: Deal Inexistente (Error Controlado)"
test_endpoint "Deal Inexistente" '{
  "deal": "Deal Que No Existe",
  "updates": {
    "mrr": 10000
  }
}'

echo ""
echo "✅ Tests completados!"
echo ""
echo "Para ejecutar un test individual:"
echo "  curl -X POST $WEBHOOK_URL \\"
echo "    -H \"Content-Type: application/json\" \\"
echo "    -d '{\"deal\": \"Datatechnic México\", \"updates\": {\"mrr\": 40000}}'"
