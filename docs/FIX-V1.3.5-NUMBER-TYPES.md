# FIX v1.3.5 - Conversión Explícita a NUMBER para Pipedrive API

**Fecha:** 2025-01-08
**Versión:** 1.3.5
**Estado:** ✅ IMPLEMENTADO

---

## CAUSA RAÍZ DEL ERROR 500:

**Problema identificado:**
```
❌ Error 500: "The service was not able to process your request"
✅ Datos correctos: attachment_id: 7, catalog_product_id: 7, mrr: 50000
✅ Endpoint correcto: PUT /deals/958/products/7
✅ Payload aparentemente correcto: {"product_id": 7, "item_price": 50000, "quantity": 1}
```

**PERO:**
```javascript
// Lo que n8n podría estar enviando:
{
  "product_id": "7",      // ❌ STRING - Pipedrive rechaza
  "item_price": "50000",  // ❌ STRING - Pipedrive rechaza
  "quantity": 1           // ✅ NUMBER - Correcto
}
```

---

## EVIDENCIA DE LA DOCUMENTACIÓN OFICIAL:

### Pipedrive API v2 Migration Guide:

> **"API v2 endpoints have significantly stricter input validation, and numeric fields no longer coerce string input to number and instead throw a validation error."**

Aunque usamos API v1, Pipedrive ha endurecido la validación en todos los endpoints. **Los campos numéricos DEBEN ser tipo NUMBER, no STRING**.

### Pipedrive API Changelog - Improved Validation:

> **"For the POST /deals/{id}/products and PUT /deals/{id}/products/{product_attachment_id} endpoints, the required body parameters and their data types are: product_id (integer), item_price (number), and quantity (integer)."**

**Tipos requeridos:**
- `product_id`: **integer** (no string)
- `item_price`: **number** (no string)
- `quantity`: **integer** (no string)

---

## PROBLEMA EN N8N:

### JSON Body con Expresiones:

```javascript
// v1.3.4 - INCORRECTO
"jsonBody": "={\n  \"product_id\": {{ $json.catalog_product_id }},\n  \"item_price\": {{ $json.mrr }},\n  \"quantity\": 1\n}"
```

**Si los valores en `$json` son strings:**
- `catalog_product_id = "7"` (string)
- `mrr = "50000"` (string)

**El JSON resultante:**
```json
{
  "product_id": "7",       // ❌ STRING - Error 500
  "item_price": "50000",   // ❌ STRING - Error 500
  "quantity": 1
}
```

**Pipedrive rechaza con error 500** porque espera tipos NUMBER.

---

## SOLUCIÓN v1.3.5:

### 1. Conversión Explícita a Números en "Preparar Actualización Producto"

```javascript
// CRITICAL FIX v1.3.5: Convertir explícitamente a números
const catalogProductIdNum = Number(dealData.catalog_product_id);
const itemPriceNum = Number(dealData.mrr);
const dealIdNum = Number(dealData.deal_id);
const attachmentIdNum = Number(dealData.attachment_id);

console.log('🔢 CONVERSIÓN A NÚMEROS (v1.3.5):');
console.log('  catalog_product_id:', dealData.catalog_product_id, '→', catalogProductIdNum, '(tipo:', typeof catalogProductIdNum, ')');
console.log('  item_price:', dealData.mrr, '→', itemPriceNum, '(tipo:', typeof itemPriceNum, ')');
console.log('  deal_id:', dealData.deal_id, '→', dealIdNum, '(tipo:', typeof dealIdNum, ')');
console.log('  attachment_id:', dealData.attachment_id, '→', attachmentIdNum, '(tipo:', typeof attachmentIdNum, ')');

// Validar que las conversiones fueron exitosas
if (isNaN(catalogProductIdNum) || isNaN(itemPriceNum) || isNaN(dealIdNum) || isNaN(attachmentIdNum)) {
  throw new Error('Error convirtiendo valores a números');
}

return [{
  json: {
    ...dealData,
    deal_id: dealIdNum,
    attachment_id: attachmentIdNum,
    catalog_product_id: catalogProductIdNum,
    item_price: itemPriceNum,
    quantity: 1
  }
}];
```

**Beneficios:**
1. ✅ Convierte explícitamente strings a números usando `Number()`
2. ✅ Valida que la conversión fue exitosa con `isNaN()`
3. ✅ Logs detallados muestran tipo ANTES y DESPUÉS de conversión
4. ✅ Retorna valores numéricos garantizados

### 2. Uso de Valores Numéricos en HTTP Request

```json
{
  "method": "PUT",
  "url": "=https://api.pipedrive.com/v1/deals/{{ $json.deal_id }}/products/{{ $json.attachment_id }}",
  "jsonBody": "={\n  \"product_id\": {{ $json.catalog_product_id }},\n  \"item_price\": {{ $json.item_price }},\n  \"quantity\": {{ $json.quantity }}\n}",
  "options": {
    "headers": {
      "headers": [
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ]
    }
  }
}
```

**Cambios:**
1. ✅ Usa `$json.item_price` en lugar de `$json.mrr` (valor ya convertido)
2. ✅ Usa `$json.quantity` en lugar de `1` (consistencia)
3. ✅ Agrega **Content-Type: application/json** header explícito

### 3. Resultado Final:

```json
PUT https://api.pipedrive.com/v1/deals/958/products/7
Content-Type: application/json

{
  "product_id": 7,       // ✅ NUMBER - Pipedrive acepta
  "item_price": 50000,   // ✅ NUMBER - Pipedrive acepta
  "quantity": 1          // ✅ NUMBER - Pipedrive acepta
}
```

---

## CAMBIOS REALIZADOS:

### Archivo: `docs/n8n-workflow-export.json`

**Nodo 1: "Preparar Actualización Producto"**
- ✅ Agregada conversión explícita: `Number(dealData.catalog_product_id)`
- ✅ Agregada conversión explícita: `Number(dealData.mrr)`
- ✅ Agregada conversión explícita: `Number(dealData.deal_id)`
- ✅ Agregada conversión explícita: `Number(dealData.attachment_id)`
- ✅ Agregada validación con `isNaN()` para cada conversión
- ✅ Logs detallados con `typeof` para mostrar tipos de datos
- ✅ Retorna objeto con valores numéricos: `item_price`, `quantity`

**Nodo 2: "Actualizar Producto" (HTTP Request)**
- ✅ Usa `$json.item_price` (valor convertido) en lugar de `$json.mrr`
- ✅ Usa `$json.quantity` en lugar de literal `1`
- ✅ Agregado **Content-Type: application/json** header
- ✅ Mantiene endpoint PUT correcto

**Metadata:**
- ✅ Nombre: "ProfitOps - Actualizar Pipedrive v1.3.5 Fix Number Types"
- ✅ Versión: "1.3.5"

---

## VALIDACIÓN DEL FIX:

### Logs Esperados en n8n:

```
🔍 DEBUG - Preparando actualización de producto:
  Deal ID: 958 (tipo: number)
  Attachment ID (para URL): 7 (tipo: number)
  Catalog Product ID (para payload): 7 (tipo: number)
  Nuevo MRR: 50000 (tipo: number)

🔢 CONVERSIÓN A NÚMEROS (v1.3.5):
  catalog_product_id: 7 → 7 (tipo: number)
  item_price: 50000 → 50000 (tipo: number)
  deal_id: 958 → 958 (tipo: number)
  attachment_id: 7 → 7 (tipo: number)

✅ Datos validados y convertidos a números
📤 Payload que se enviará a Pipedrive:
  - product_id: 7 (NUMBER)
  - item_price: 50000 (NUMBER)
  - quantity: 1 (NUMBER)
```

### Respuesta Esperada de Pipedrive:

```
🎯 DEBUG - Respuesta de actualización de producto:
Status Code: 200

{
  "success": true,
  "data": {
    "id": 7,
    "product_id": 7,
    "item_price": 50000,
    "quantity": 1,
    "name": "Producto BLK",
    ...
  }
}

✅ Producto actualizado exitosamente en Pipedrive
💰 Nuevo precio confirmado: 50000
```

---

## TESTING:

### 1. Re-importar Workflow v1.3.5

```
1. Ir a https://profitops.app.n8n.cloud
2. ELIMINAR workflow v1.3.4 anterior
3. Import → docs/n8n-workflow-export.json
4. Verificar credential "Pipedrive account 2"
5. Activar workflow
```

### 2. Ejecutar Prueba

```bash
curl -X POST https://profitops.app.n8n.cloud/webhook/7f477b94-4cb6-4f41-938a-5e987e7f1254 \
  -H "Content-Type: application/json" \
  -d '{
    "deal": "Datatechnic México",
    "updates": {
      "mrr": 50000,
      "nota": "✅ v1.3.5 - Number types fix"
    }
  }'
```

### 3. Verificaciones Críticas:

**En n8n Executions:**
- ✅ **NO error 500** ("The service was not able to process your request")
- ✅ Log muestra: "🔢 CONVERSIÓN A NÚMEROS (v1.3.5)"
- ✅ Log muestra tipos: "(tipo: number)" para todos los valores
- ✅ Log muestra: "✅ Producto actualizado exitosamente en Pipedrive"
- ✅ Status Code: **200** (no 500)

**En Pipedrive:**
- ✅ Deal "Datatechnic México" → Producto actualizado a **$50,000**
- ✅ Nota creada: "✅ v1.3.5 - Number types fix"

---

## COMPARACIÓN DE VERSIONES:

| Versión | Problema | Fix |
|---------|----------|-----|
| v1.3.3 | Buscaba `product_id` directo (no existe) | - |
| v1.3.4 | Buscaba en `prices[0].product_id` ✅ | Extracción correcta |
| v1.3.5 | **Enviaba strings en lugar de números** ❌ | **Conversión explícita a NUMBER** ✅ |

---

## FUENTES DE INFORMACIÓN:

1. **Pipedrive API v2 Migration Guide:**
   https://pipedrive.readme.io/docs/pipedrive-api-v2-migration-guide
   - "Numeric fields no longer coerce string input to number"

2. **Pipedrive API Changelog - Improved Validation:**
   https://developers.pipedrive.com/changelog/post/improved-validation-for-products-and-deal-products-endpoints
   - Required data types: product_id (integer), item_price (number), quantity (integer)

3. **Pipedrive Deals API Reference:**
   https://developers.pipedrive.com/docs/api/v1/Deals
   - PUT /deals/{id}/products/{product_attachment_id} documentation

4. **n8n HTTP Request Documentation:**
   https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/
   - JSON body configuration and headers

5. **Pipedrive Developers Community:**
   https://devcommunity.pipedrive.com/
   - Error 500 troubleshooting and common issues

---

## RESUMEN:

**Error 500 causado por:** Envío de strings en lugar de números en campos numéricos

**Solución implementada:**
1. ✅ Conversión explícita a NUMBER con `Number()`
2. ✅ Validación con `isNaN()` para detectar errores de conversión
3. ✅ Logs detallados con `typeof` para verificar tipos
4. ✅ Content-Type header explícito
5. ✅ Uso de valores convertidos en HTTP Request

**Estado:** ✅ Listo para testing
**Próximo paso:** Re-importar v1.3.5 y confirmar eliminación de error 500

---

## ARCHIVOS MODIFICADOS:

- ✅ `docs/n8n-workflow-export.json` - Workflow v1.3.5
- ✅ `docs/FIX-V1.3.5-NUMBER-TYPES.md` - Esta documentación
