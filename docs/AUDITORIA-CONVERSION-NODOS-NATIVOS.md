# 🔴 AUDITORÍA CRÍTICA - Conversión HTTP Request → Nodos Nativos Pipedrive

**Fecha**: 2025-01-08
**Status**: 🚨 URGENTE - Error 500 en autenticación
**Objetivo**: Convertir TODOS los HTTP Request a nodos nativos Pipedrive
**Razón**: Los HTTP Request genéricos fallan con error 500 de autenticación

---

## ❌ PROBLEMA IDENTIFICADO

**Error**: Error 500 al usar HTTP Request con autenticación por query parameters
**Impacto**: Workflow se detiene y no continúa
**Causa**: La autenticación con `api_token` en query no funciona consistentemente
**Solución**: Usar nodos nativos Pipedrive con credenciales de n8n

---

## 📊 AUDITORÍA COMPLETA - HTTP REQUEST NODES

### 1. ❌ "Buscar Deal" - HTTP Request
**Endpoint actual**: `GET /v1/deals/search`
**Tipo actual**: `n8n-nodes-base.httpRequest`
**Parámetros**:
- term, fields, exact_match, api_token

**Conversión a**:
- **Tipo**: `n8n-nodes-base.pipedrive`
- **Resource**: `deal`
- **Operation**: `search`
- **Credential**: `Pipedrive account 2`
- **Parámetros**: term, fields, exactMatch

---

### 2. ❌ "Obtener Productos" - HTTP Request
**Endpoint actual**: `GET /v1/deals/{id}/products`
**Tipo actual**: `n8n-nodes-base.httpRequest`
**Parámetros**:
- deal_id, api_token

**Conversión a**:
- **Tipo**: `n8n-nodes-base.pipedrive`
- **Resource**: `product`
- **Operation**: `getAll`
- **Credential**: `Pipedrive account 2`
- **Additional Fields**: dealId (para filtrar)

---

### 3. ❌ "Actualizar Producto" - HTTP Request
**Endpoint actual**: `PUT /v1/deals/{id}/products/{product_id}`
**Tipo actual**: `n8n-nodes-base.httpRequest`
**Parámetros**:
- deal_id, product_id, item_price, quantity, api_token

**Conversión a**:
- **Tipo**: `n8n-nodes-base.pipedrive`
- **Resource**: `product`
- **Operation**: `update`
- **Credential**: `Pipedrive account 2`
- **Parámetros**: productId, itemPrice, quantity

---

### 4. ❌ "Actualizar Deal Directo" - HTTP Request
**Endpoint actual**: `PUT /v1/deals/{id}`
**Tipo actual**: `n8n-nodes-base.httpRequest`
**Parámetros**:
- deal_id, value, probability, expected_close_date, api_token

**Conversión a**:
- **Tipo**: `n8n-nodes-base.pipedrive`
- **Resource**: `deal`
- **Operation**: `update`
- **Credential**: `Pipedrive account 2`
- **Parámetros**: dealId, value, probability, expectedCloseDate

---

### 5. ❌ "Actualizar Etapa" - HTTP Request
**Endpoint actual**: `PUT /v1/deals/{id}`
**Tipo actual**: `n8n-nodes-base.httpRequest`
**Parámetros**:
- deal_id, stage_id, api_token

**Conversión a**:
- **Tipo**: `n8n-nodes-base.pipedrive`
- **Resource**: `deal`
- **Operation**: `update`
- **Credential**: `Pipedrive account 2`
- **Parámetros**: dealId, stageId

---

### 6. ❌ "Crear Nota" - HTTP Request
**Endpoint actual**: `POST /v1/notes`
**Tipo actual**: `n8n-nodes-base.httpRequest`
**Parámetros**:
- deal_id, content, pinned_to_deal_flag, api_token

**Conversión a**:
- **Tipo**: `n8n-nodes-base.pipedrive`
- **Resource**: `note`
- **Operation**: `create`
- **Credential**: `Pipedrive account 2`
- **Parámetros**: dealId, content, pinnedToDealFlag

---

### 7. ❌ "Crear Actividad en Pipedrive" - HTTP Request
**Endpoint actual**: `POST /v1/activities`
**Tipo actual**: `n8n-nodes-base.httpRequest`
**Parámetros**:
- deal_id, subject, type, due_date, due_time, api_token

**Conversión a**:
- **Tipo**: `n8n-nodes-base.pipedrive`
- **Resource**: `activity`
- **Operation**: `create`
- **Credential**: `Pipedrive account 2`
- **Parámetros**: dealId, subject, type, dueDate, dueTime

---

### 8. ❌ "Obtener Actividades Pendientes" - HTTP Request
**Endpoint actual**: `GET /v1/deals/{id}/activities?done=0`
**Tipo actual**: `n8n-nodes-base.httpRequest`
**Parámetros**:
- deal_id, done=0, api_token, splitIntoItems=true

**Conversión a**:
- **Tipo**: `n8n-nodes-base.pipedrive`
- **Resource**: `activity`
- **Operation**: `getAll`
- **Credential**: `Pipedrive account 2`
- **Parámetros**: dealId (filter), done=0 (filter)
- **Options**: Return All = true

---

### 9. ❌ "Completar Actividad" - HTTP Request
**Endpoint actual**: `PUT /v1/activities/{id}`
**Tipo actual**: `n8n-nodes-base.httpRequest`
**Parámetros**:
- activity_id, done=1, api_token

**Conversión a**:
- **Tipo**: `n8n-nodes-base.pipedrive`
- **Resource**: `activity`
- **Operation**: `update`
- **Credential**: `Pipedrive account 2`
- **Parámetros**: activityId, done=1

---

## 🔄 PLAN DE CONVERSIÓN

### Fase 1: Convertir nodos de lectura (GET)
1. ✅ Buscar Deal
2. ✅ Obtener Productos
3. ✅ Obtener Actividades Pendientes

### Fase 2: Convertir nodos de actualización (PUT)
4. ✅ Actualizar Producto
5. ✅ Actualizar Deal Directo
6. ✅ Actualizar Etapa
7. ✅ Completar Actividad

### Fase 3: Convertir nodos de creación (POST)
8. ✅ Crear Nota
9. ✅ Crear Actividad en Pipedrive

---

## ⚙️ CONFIGURACIÓN DE CREDENCIALES

**Credencial a usar**: `Pipedrive account 2`
**Tipo**: Pipedrive OAuth2 / API Token
**Ventajas**:
- ✅ Autenticación nativa de n8n
- ✅ No requiere query parameters
- ✅ Manejo automático de headers
- ✅ Mayor confiabilidad

---

## 🎯 VENTAJAS DE NODOS NATIVOS

### 1. Autenticación Robusta
- ✅ No más errores 500 de autenticación
- ✅ Manejo automático de tokens
- ✅ Refresh automático si usa OAuth2

### 2. Validación de Parámetros
- ✅ n8n valida parámetros antes de enviar
- ✅ Auto-complete de campos
- ✅ Tipado correcto

### 3. Error Handling
- ✅ Errores más descriptivos
- ✅ Retry automático en algunos casos
- ✅ Mejor logging

### 4. Mantenibilidad
- ✅ Actualizaciones automáticas de API
- ✅ Cambios de endpoints manejados por n8n
- ✅ Código más limpio

---

## 🚀 IMPACTO EN WORKFLOW

### Cambios estructurales:
- **Total de nodos**: ~30 (sin cambios significativos)
- **Código defensivo**: SE MANTIENE en nodos Code
- **Logging**: SE MANTIENE en nodos Code
- **Flujo lógico**: SIN CAMBIOS

### Solo cambia:
- ✅ Tipo de nodo: `httpRequest` → `pipedrive`
- ✅ Autenticación: query params → credential
- ✅ Nombres de parámetros: snake_case → camelCase (en algunos casos)

---

## 📋 VERIFICACIÓN POST-CONVERSIÓN

### Checklist de validación:
1. ✅ Todos los HTTP Request eliminados
2. ✅ Todos usan "Pipedrive account 2"
3. ✅ Código defensivo intacto en nodos Code
4. ✅ Logging comprehensivo intacto
5. ✅ Conexiones entre nodos correctas
6. ✅ Workflow importable y activable
7. ✅ Test con curl exitoso

---

## 🎉 RESULTADO ESPERADO

**Workflow v1.3**:
- ✅ 100% nodos nativos Pipedrive
- ✅ 0 HTTP Request genéricos
- ✅ Autenticación robusta con credenciales n8n
- ✅ Sin errores 500
- ✅ Listo para demo con BLK

---

**Status**: 📝 Documentado - Iniciando conversión
**Próximo paso**: Generar workflow v1.3 con nodos nativos
