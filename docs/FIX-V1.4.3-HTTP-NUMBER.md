# FIX v1.4.3 - Volver a HTTP Request con Number() en Expressions

**Fecha:** 2025-01-08
**Versión:** 1.4.3
**Estado:** ✅ IMPLEMENTADO

---

## DESCUBRIMIENTO CRÍTICO:

**El nodo nativo Pipedrive de n8n NO soporta `itemPrice` en operación UPDATE**

### Evidencia del Código Fuente:

Según el código fuente de n8n en GitHub ([Pipedrive.node.ts](https://github.com/n8n-io/n8n/blob/master/packages/nodes-base/nodes/Pipedrive/Pipedrive.node.ts)):

> **"both parameters have displayOptions showing them only when the operation is 'add' and resource is 'dealProduct'"**

**Traducción:** Los parámetros `itemPrice` y `quantity` solo están disponibles para la operación **ADD**, NO para **UPDATE**.

### Campos Soportados por Nodo Nativo:

| Operación | Campos Soportados |
|-----------|-------------------|
| `dealProduct.add` | ✅ itemPrice, quantity, product_id, additionalFields |
| `dealProduct.update` | ❌ **NO itemPrice** - Solo comments, discount_percentage |

**Por eso el usuario solo veía "Quantity" en Update Fields** - n8n ignoraba `itemPrice` porque no está en displayOptions para UPDATE.

---

## PROBLEMA IDENTIFICADO:

**Versión v1.4.2:**
```json
{
  "resource": "dealProduct",
  "operation": "update",
  "updateFields": {
    "itemPrice": "={{ $json.item_price }}",  // ❌ n8n IGNORA esto
    "quantity": "={{ $json.quantity }}"       // ✅ n8n acepta esto
  }
}
```

**Resultado:**
- n8n importa el workflow sin errores
- Interfaz solo muestra "quantity" en updateFields
- itemPrice es IGNORADO silenciosamente
- Producto NO se actualiza porque falta el precio

---

## SOLUCIÓN v1.4.3:

**Volver a HTTP Request, PERO con todo lo aprendido:**

### Cambios Clave vs v1.3.5:

**v1.3.5 (fallaba con error 500):**
```json
{
  "url": "https://api.pipedrive.com/v1/deals/{{ $json.deal_id }}/products/{{ $json.attachment_id }}",
  "jsonBody": "={\n  \"product_id\": {{ $json.catalog_product_id }},\n  \"item_price\": {{ $json.item_price }},\n  \"quantity\": {{ $json.quantity }}\n}"
}
```

**v1.4.3 (debería funcionar):**
```json
{
  "url": "=https://api.pipedrive.com/v1/deals/{{ Number($json.deal_id) }}/products/{{ Number($json.attachment_id) }}",
  "jsonBody": "={\n  \"item_price\": {{ Number($json.item_price) }},\n  \"quantity\": {{ Number($json.quantity) }}\n}"
}
```

### Diferencias Críticas:

1. **Number() en URL**: `{{ Number($json.deal_id) }}` en lugar de `{{ $json.deal_id }}`
   - Garantiza que son números, no strings

2. **Number() en JSON Body**: `{{ Number($json.item_price) }}` en lugar de `{{ $json.item_price }}`
   - Conversión DENTRO de las expressions de n8n
   - Pipedrive recibe números nativos de JavaScript

3. **Sin product_id**: Solo `item_price` y `quantity`
   - product_id causaba error 500 en versiones anteriores
   - Pipedrive API solo requiere item_price y quantity para UPDATE

4. **Content-Type header**: Explícitamente `application/json`

---

## POR QUÉ DEBERÍA FUNCIONAR AHORA:

### Lecciones de Todas las Versiones:

| Versión | Problema | Aprendizaje |
|---------|----------|-------------|
| v1.3.3 | Error 500 | product_id en payload causaba error |
| v1.3.4 | Error 500 | Necesitaba extraer de prices[0] |
| v1.3.5 | Error 500 | Conversión manual Number() no funcionó |
| v1.4.0-v1.4.2 | itemPrice ignorado | Nodo nativo NO soporta itemPrice en UPDATE |
| **v1.4.3** | **HTTP + Number() en expressions** | **Solución completa** |

### Configuración Final Completa:

```json
{
  "parameters": {
    "method": "PUT",
    "url": "=https://api.pipedrive.com/v1/deals/{{ Number($json.deal_id) }}/products/{{ Number($json.attachment_id) }}",
    "authentication": "predefinedCredentialType",
    "nodeCredentialType": "pipedriveApi",
    "sendBody": true,
    "specifyBody": "json",
    "jsonBody": "={\n  \"item_price\": {{ Number($json.item_price) }},\n  \"quantity\": {{ Number($json.quantity) }}\n}",
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
  },
  "name": "Actualizar Producto HTTP",
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.2,
  "credentials": {
    "pipedriveApi": {
      "id": "pipedrive-account-2",
      "name": "Pipedrive account 2"
    }
  }
}
```

---

## CAMBIOS REALIZADOS:

### Archivo: `docs/n8n-workflow-export.json`

**Nodo: "Actualizar Producto Nativo" → "Actualizar Producto HTTP"**

**REEMPLAZADO:**
- Type: `n8n-nodes-base.pipedrive` → `n8n-nodes-base.httpRequest`
- Nombre: "Actualizar Producto Nativo" → "Actualizar Producto HTTP"

**CONFIGURACIÓN HTTP REQUEST:**
```json
{
  "method": "PUT",
  "url": "=https://api.pipedrive.com/v1/deals/{{ Number($json.deal_id) }}/products/{{ Number($json.attachment_id) }}",
  "jsonBody": "={\n  \"item_price\": {{ Number($json.item_price) }},\n  \"quantity\": {{ Number($json.quantity) }}\n}"
}
```

**Conexiones actualizadas:**
```
"Preparar Actualización Producto" → "Actualizar Producto HTTP"
"Actualizar Producto HTTP" → "Log Update Producto"
```

**Logging actualizado:**
```javascript
if (response.success === true && response.data) {
  console.log('✅ Producto actualizado exitosamente con HTTP Request + Number()');
  console.log('💰 Nuevo precio confirmado:', response.data.item_price);
  console.log('🎉 v1.4.3 - HTTP Request con Number() en expressions!');
}
```

**Metadata:**
- ✅ Nombre: "ProfitOps - Actualizar Pipedrive v1.4.3 HTTP con Number()"
- ✅ Versión: "1.4.3"

---

## VALIDACIÓN DEL FIX:

### Payload Construido por n8n:

**URL:**
```
PUT https://api.pipedrive.com/v1/deals/958/products/7
```
(958 y 7 como NÚMEROS, no strings)

**Body:**
```json
{
  "item_price": 50000,    // ✅ NUMBER nativo de JavaScript
  "quantity": 1           // ✅ NUMBER nativo de JavaScript
}
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer [API_TOKEN]
```

### Respuesta Esperada de Pipedrive:

```json
{
  "success": true,
  "data": {
    "id": 7,
    "product_id": 7,
    "item_price": 50000,
    "quantity": 1,
    "name": "Producto BLK",
    "deal_id": 958
  }
}
```

---

## TESTING:

### 1. Re-importar Workflow v1.4.3

```
1. Ir a https://profitops.app.n8n.cloud
2. ELIMINAR workflow v1.4.2 anterior
3. Import → docs/n8n-workflow-export.json
4. Verificar nodo "Actualizar Producto HTTP":
   - Type: HTTP Request (NO Pipedrive nativo)
   - Method: PUT
   - URL: https://api.pipedrive.com/v1/deals/{{ Number($json.deal_id) }}/products/{{ Number($json.attachment_id) }}
   - Body: JSON con Number() en expressions
5. Verificar credential "Pipedrive account 2"
6. Activar workflow
```

### 2. Ejecutar Prueba

```bash
curl -X POST https://profitops.app.n8n.cloud/webhook/7f477b94-4cb6-4f41-938a-5e987e7f1254 \
  -H "Content-Type: application/json" \
  -d '{
    "deal": "Datatechnic México",
    "updates": {
      "mrr": 50000,
      "nota": "✅ v1.4.3 - HTTP con Number() - itemPrice soportado"
    }
  }'
```

### 3. Verificaciones CRÍTICAS:

**En n8n Executions:**
- ✅ **NO error 500** (conversión Number() correcta)
- ✅ **NO error 400** (body bien formado)
- ✅ Log muestra: "✅ Producto actualizado exitosamente con HTTP Request + Number()"
- ✅ Log muestra: "💰 Nuevo precio confirmado: 50000"
- ✅ Log muestra: "🎉 v1.4.3 - HTTP Request con Number() en expressions!"

**En Pipedrive: ⭐ VERIFICACIÓN FINAL ⭐**
- ✅ Deal "Datatechnic México" → Producto actualizado de **$40,000 → $50,000**
- ✅ Nota creada: "✅ v1.4.3 - HTTP con Number() - itemPrice soportado"

---

## COMPARACIÓN FINAL:

| Versión | Estrategia | itemPrice Soportado | Estado |
|---------|-----------|---------------------|--------|
| v1.3.1-v1.3.5 | HTTP Request (errores varios) | ✅ Sí | ❌ Error 500 |
| v1.4.0-v1.4.2 | Nodo Nativo Pipedrive | ❌ **NO** (limitación n8n) | ❌ No funciona |
| v1.4.3 | **HTTP Request + Number()** | ✅ **SÍ** | ✅ **Debería funcionar** |

---

## POR QUÉ v1.4.3 DEBERÍA FUNCIONAR:

1. ✅ **HTTP Request** - Control total del payload
2. ✅ **Number() en expressions** - Conversión nativa de n8n (no manual)
3. ✅ **Sin product_id** - Solo campos requeridos (item_price, quantity)
4. ✅ **Content-Type correcto** - application/json
5. ✅ **Autenticación Pipedrive** - Usa credential nativa
6. ✅ **Endpoint correcto** - PUT /deals/{id}/products/{attachment_id}

### Diferencia Crucial con v1.3.5:

**v1.3.5:**
```javascript
// En nodo Code:
const itemPriceNum = Number(dealData.mrr);  // Conversión manual

// En HTTP Request:
"item_price": {{ $json.item_price }}  // Puede seguir siendo string
```

**v1.4.3:**
```javascript
// En HTTP Request DIRECTAMENTE:
"item_price": {{ Number($json.item_price) }}  // n8n convierte en expression
```

**Ventaja:** n8n ejecuta `Number()` DENTRO de la expression antes de construir el JSON, garantizando tipo nativo.

---

## FUENTES DE INFORMACIÓN:

1. **n8n Pipedrive Node Source Code:**
   https://github.com/n8n-io/n8n/blob/master/packages/nodes-base/nodes/Pipedrive/Pipedrive.node.ts
   - Evidencia de displayOptions solo para ADD operation

2. **n8n Pipedrive Node Documentation:**
   https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.pipedrive/
   - Documentación oficial de operaciones

3. **Pipedrive API Documentation:**
   https://developers.pipedrive.com/docs/api/v1/Deals
   - PUT /deals/{id}/products/{attachment_id} endpoint

---

## RESUMEN:

**Descubrimiento:** Nodo nativo n8n NO soporta itemPrice en dealProduct.update

**Solución:** HTTP Request con `Number()` en expressions de n8n para conversión de tipos nativa

**Diferencia clave:** Usar `{{ Number($json.value) }}` en lugar de conversión manual previa

**Estado:** ✅ Listo para testing
**Expectativa:** ✅ Debería funcionar correctamente

---

## ARCHIVOS MODIFICADOS:

- ✅ `docs/n8n-workflow-export.json` - Workflow v1.4.3
- ✅ `docs/FIX-V1.4.3-HTTP-NUMBER.md` - Esta documentación

**Siguiente paso:** Re-importar v1.4.3 y confirmar que el producto se actualiza correctamente.
