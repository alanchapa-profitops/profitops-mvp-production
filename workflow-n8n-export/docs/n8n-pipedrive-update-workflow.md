# Workflow n8n: Actualización de Pipedrive desde ProfitOps

## Información General

**Webhook URL**: `https://profitops.app.n8n.cloud/webhook/7f477b94-4cb6-4f41-938a-5e987e7f1254`
**Método**: POST
**API Token Pipedrive**: `6875ccdf045b5c77ffaf0e442ed393c6d492bbcc`
**Deal ID de prueba**: 958 (Datatechnic México)

## Mapeo de Etapas

```json
{
  "1": 104,  // Prospección
  "2": 22,   // Discovery
  "3": 23,   // Propuesta
  "4": 24,   // Negociación
  "5": 25,   // Cierre
  "6": 26    // Ganado/Perdido
}
```

---

## Arquitectura del Workflow

### Flujo Principal

```
Webhook Trigger
    ↓
Validar Entrada
    ↓
Buscar Deal por Nombre
    ↓
Verificar Productos del Deal
    ↓
┌─────────────────┬─────────────────┐
│                 │                 │
Actualizar        Actualizar
Deal Directo      Productos
│                 │
└────────┬────────┘
         ↓
Actualizar Etapa (si aplica)
         ↓
Agregar Nota (si aplica)
         ↓
Crear Actividad (si aplica)
         ↓
Completar Actividades (si aplica)
         ↓
Construir Respuesta de Éxito
```

---

## Configuración Detallada de Nodos

### 1. Webhook Trigger

**Nombre**: `Recibir Actualización`
**Tipo**: Webhook
**Método**: POST, GET
**Path**: `/webhook/7f477b94-4cb6-4f41-938a-5e987e7f1254`

**Configuración**:
- Authentication: None
- Respond: Immediately
- Response Code: 200
- Response Mode: On Received

---

### 2. Validar Entrada

**Nombre**: `Validar Entrada`
**Tipo**: Code (JavaScript)

```javascript
// Validar y estructurar datos de entrada
const input = $input.all()[0].json;

// Extraer datos con valores por defecto
const dealName = input.deal || input.body?.deal;
const updates = input.updates || input.body?.updates || {};
const actividad = input.actividad || input.body?.actividad;
const completarActividad = input.completar_actividad || input.body?.completar_actividad || false;

// Validación básica
if (!dealName) {
  throw new Error('El campo "deal" es obligatorio');
}

// Preparar datos validados
const validated = {
  deal_name: dealName,
  mrr: updates.mrr || null,
  stage_id: updates.stage_id || null,
  probabilidad: updates.probabilidad || null,
  fecha_cierre: updates.fecha_cierre || null,
  nota: updates.nota || null,
  actividad: actividad || null,
  completar_actividad: completarActividad,
  // Mapeo de etapas
  stage_mapping: {
    "1": 104, "2": 22, "3": 23, "4": 24, "5": 25, "6": 26
  }
};

return [validated];
```

---

### 3. Buscar Deal por Nombre

**Nombre**: `Buscar Deal`
**Tipo**: HTTP Request

**Configuración**:
- Method: GET
- URL: `https://api.pipedrive.com/v1/deals/search`
- Authentication: Generic Credential Type
  - Generic Auth Type: Query Auth
  - Name: api_token
  - Value: `6875ccdf045b5c77ffaf0e442ed393c6d492bbcc`

**Query Parameters**:
- `term`: `={{ $json.deal_name }}`
- `fields`: `title`
- `exact_match`: `true`

**Options**:
- Split Into Items: Yes
- Response Format: JSON

---

### 4. Verificar si Deal Existe

**Nombre**: `Deal Encontrado?`
**Tipo**: IF

**Condiciones**:
- `{{ $json.data }}` (exists)
- `{{ $json.data.length }}` (greater than) `0`

**Ramas**:
- **TRUE**: Continuar con actualización
- **FALSE**: Error - Deal no encontrado

---

### 5. Extraer Deal ID

**Nombre**: `Extraer Deal ID`
**Tipo**: Code (JavaScript)

```javascript
// Extraer el primer resultado
const searchResults = $input.all()[0].json;
const validatedData = $('Validar Entrada').all()[0].json;

if (!searchResults.data || searchResults.data.length === 0) {
  throw new Error(`Deal "${validatedData.deal_name}" no encontrado en Pipedrive`);
}

const deal = searchResults.data[0].item;

return [{
  json: {
    deal_id: deal.id,
    deal_title: deal.title,
    ...validatedData
  }
}];
```

---

### 6. Obtener Productos del Deal

**Nombre**: `Obtener Productos`
**Tipo**: HTTP Request

**Configuración**:
- Method: GET
- URL: `https://api.pipedrive.com/v1/deals/{{ $json.deal_id }}/products`
- Authentication: Query Auth
  - Name: api_token
  - Value: `6875ccdf045b5c77ffaf0e442ed393c6d492bbcc`

**Options**:
- Response Format: JSON
- Ignore SSL Issues: No

---

### 7. Decidir Estrategia de Actualización

**Nombre**: `Tiene Productos?`
**Tipo**: IF

**Condiciones**:
- `{{ $json.data }}` (exists)
- `{{ $json.data.length }}` (greater than) `0`

**Ramas**:
- **TRUE**: Actualizar vía productos
- **FALSE**: Actualizar deal directo

---

### 8A. Actualizar Deal Directo (Sin Productos)

**Nombre**: `Actualizar Deal Directo`
**Tipo**: HTTP Request

**Configuración**:
- Method: PUT
- URL: `https://api.pipedrive.com/v1/deals/{{ $json.deal_id }}`
- Authentication: Query Auth
  - Name: api_token
  - Value: `6875ccdf045b5c77ffaf0e442ed393c6d492bbcc`

**Body (JSON)**:
```javascript
{
  "value": "={{ $json.mrr }}",
  "probability": "={{ $json.probabilidad }}",
  "expected_close_date": "={{ $json.fecha_cierre }}"
}
```

**Pre-send Code**:
```javascript
// Solo incluir campos que no sean null
const body = {};
if ($json.mrr !== null) body.value = $json.mrr;
if ($json.probabilidad !== null) body.probability = $json.probabilidad;
if ($json.fecha_cierre !== null) body.expected_close_date = $json.fecha_cierre;

return { json: body };
```

---

### 8B. Actualizar Primer Producto

**Nombre**: `Actualizar Producto`
**Tipo**: HTTP Request

**Configuración**:
- Method: PUT
- URL: `https://api.pipedrive.com/v1/deals/{{ $json.deal_id }}/products/{{ $json.data[0].id }}`
- Authentication: Query Auth
  - Name: api_token
  - Value: `6875ccdf045b5c77ffaf0e442ed393c6d492bbcc`

**Body (JSON)**:
```javascript
{
  "item_price": "={{ $json.mrr }}",
  "quantity": 1
}
```

**Note**: Esto actualizará el valor del deal automáticamente.

---

### 9. Merge de Flujos

**Nombre**: `Merge Actualización`
**Tipo**: Merge

**Configuración**:
- Mode: Merge By Position
- Input 1: Actualizar Deal Directo
- Input 2: Actualizar Producto

---

### 10. Actualizar Etapa del Deal

**Nombre**: `Cambiar Etapa?`
**Tipo**: IF

**Condiciones**:
- `{{ $json.stage_id }}` (is not null)

**Rama TRUE**:

**Nombre**: `Actualizar Etapa`
**Tipo**: HTTP Request

**Configuración**:
- Method: PUT
- URL: `https://api.pipedrive.com/v1/deals/{{ $json.deal_id }}`
- Authentication: Query Auth

**Body (JSON)**:
```javascript
{
  "stage_id": "={{ $json.stage_mapping[$json.stage_id.toString()] }}"
}
```

---

### 11. Agregar Nota al Deal

**Nombre**: `Agregar Nota?`
**Tipo**: IF

**Condiciones**:
- `{{ $json.nota }}` (is not empty)

**Rama TRUE**:

**Nombre**: `Crear Nota`
**Tipo**: HTTP Request

**Configuración**:
- Method: POST
- URL: `https://api.pipedrive.com/v1/notes`
- Authentication: Query Auth

**Body (JSON)**:
```json
{
  "deal_id": "={{ $json.deal_id }}",
  "content": "={{ $json.nota }}",
  "pinned_to_deal_flag": 1
}
```

---

### 12. Crear Actividad de Seguimiento

**Nombre**: `Crear Actividad?`
**Tipo**: IF

**Condiciones**:
- `{{ $json.actividad }}` (exists)

**Rama TRUE**:

**Nombre**: `Preparar Actividad`
**Tipo**: Code (JavaScript)

```javascript
// Mapear tipos de actividad
const activityTypes = {
  "call": "call",
  "meeting": "meeting",
  "task": "task",
  "deadline": "deadline",
  "email": "email",
  "lunch": "lunch"
};

const actividad = $json.actividad;
const activityType = activityTypes[actividad.tipo] || "task";

return [{
  json: {
    ...$json,
    activity_subject: actividad.titulo,
    activity_type: activityType,
    activity_due_date: actividad.fecha
  }
}];
```

**Nombre**: `Crear Actividad en Pipedrive`
**Tipo**: HTTP Request

**Configuración**:
- Method: POST
- URL: `https://api.pipedrive.com/v1/activities`
- Authentication: Query Auth

**Body (JSON)**:
```json
{
  "deal_id": "={{ $json.deal_id }}",
  "subject": "={{ $json.activity_subject }}",
  "type": "={{ $json.activity_type }}",
  "due_date": "={{ $json.activity_due_date }}",
  "due_time": "09:00"
}
```

---

### 13. Completar Actividades Pendientes

**Nombre**: `Completar Actividades?`
**Tipo**: IF

**Condiciones**:
- `{{ $json.completar_actividad }}` (is true)

**Rama TRUE**:

**Nombre**: `Obtener Actividades Pendientes`
**Tipo**: HTTP Request

**Configuración**:
- Method: GET
- URL: `https://api.pipedrive.com/v1/deals/{{ $json.deal_id }}/activities`
- Authentication: Query Auth

**Query Parameters**:
- `done`: `0` (solo pendientes)

---

**Nombre**: `Marcar como Completadas`
**Tipo**: Loop Over Items

**Items**: `{{ $json.data }}`

**Dentro del Loop**:

**Nombre**: `Completar Actividad`
**Tipo**: HTTP Request

**Configuración**:
- Method: PUT
- URL: `https://api.pipedrive.com/v1/activities/{{ $item.id }}`
- Authentication: Query Auth

**Body (JSON)**:
```json
{
  "done": 1
}
```

---

### 14. Construir Respuesta de Éxito

**Nombre**: `Respuesta Final`
**Tipo**: Code (JavaScript)

```javascript
const deal = $json;

return [{
  json: {
    success: true,
    message: "Deal actualizado exitosamente",
    deal: {
      id: deal.deal_id,
      title: deal.deal_title,
      actualizaciones_aplicadas: {
        mrr: deal.mrr !== null,
        etapa: deal.stage_id !== null,
        probabilidad: deal.probabilidad !== null,
        fecha_cierre: deal.fecha_cierre !== null,
        nota_agregada: deal.nota !== null,
        actividad_creada: deal.actividad !== null,
        actividades_completadas: deal.completar_actividad
      }
    },
    timestamp: new Date().toISOString()
  }
}];
```

---

### 15. Manejo de Errores

**Para CADA nodo HTTP Request**, agregar:

**Error Workflow**: Yes

**En el Error Handler**:

**Nombre**: `Registrar Error`
**Tipo**: Code (JavaScript)

```javascript
const error = $json.error;
const node = $json.node;

console.error(`Error en ${node.name}:`, error);

return [{
  json: {
    success: false,
    error: error.message || "Error desconocido",
    node: node.name,
    timestamp: new Date().toISOString(),
    // No fallar el workflow, solo registrar
    continued: true
  }
}];
```

**Respuesta de Error Global**:

**Nombre**: `Respuesta Error`
**Tipo**: Respond to Webhook

**Response Body**:
```json
{
  "success": false,
  "error": "={{ $json.error }}",
  "message": "No se pudo completar la actualización, pero el workflow continuó",
  "timestamp": "={{ $json.timestamp }}"
}
```

---

## Casos de Uso - Ejemplos de Entrada

### 1. Actualizar solo el valor (MRR)

```json
{
  "deal": "Datatechnic México",
  "updates": {
    "mrr": 40000
  }
}
```

### 2. Cambiar etapa y agregar nota

```json
{
  "deal": "Datatechnic México",
  "updates": {
    "stage_id": 4,
    "nota": "Cliente confirmó interés. Programar demo técnico."
  }
}
```

### 3. Actualización completa

```json
{
  "deal": "Datatechnic México",
  "updates": {
    "mrr": 45000,
    "stage_id": 4,
    "probabilidad": 75,
    "fecha_cierre": "2025-02-15",
    "nota": "Negociación avanzada. Cliente pidió descuento del 10%."
  },
  "actividad": {
    "titulo": "Seguimiento post-propuesta",
    "tipo": "call",
    "fecha": "2025-01-15"
  },
  "completar_actividad": true
}
```

### 4. Solo crear actividad

```json
{
  "deal": "Datatechnic México",
  "actividad": {
    "titulo": "Reunión de cierre",
    "tipo": "meeting",
    "fecha": "2025-02-01"
  }
}
```

---

## Características de Robustez

### 1. Manejo de Errores
- Cada nodo HTTP tiene error handler
- Los errores no detienen el workflow completo
- Se registran todos los errores para debugging
- Respuesta siempre exitosa cuando es posible

### 2. Validación de Datos
- Validación inicial de campos obligatorios
- Valores por defecto para campos opcionales
- Normalización de datos de entrada

### 3. Flexibilidad
- Funciona con o sin productos
- Actualiza solo los campos proporcionados
- No requiere todos los campos simultáneamente

### 4. Logging
- Logs en cada paso importante
- Información detallada en respuestas
- Timestamp en todas las operaciones

### 5. Idempotencia
- Búsqueda exacta de deals por nombre
- Actualizaciones seguras con PUT
- Sin duplicación de actividades/notas

---

## Testing del Workflow

### Probar con curl:

```bash
# Actualización simple
curl -X POST https://profitops.app.n8n.cloud/webhook/7f477b94-4cb6-4f41-938a-5e987e7f1254 \
  -H "Content-Type: application/json" \
  -d '{
    "deal": "Datatechnic México",
    "updates": {
      "mrr": 40000,
      "stage_id": 4,
      "probabilidad": 75
    }
  }'

# Con actividad
curl -X POST https://profitops.app.n8n.cloud/webhook/7f477b94-4cb6-4f41-938a-5e987e7f1254 \
  -H "Content-Type: application/json" \
  -d '{
    "deal": "Datatechnic México",
    "updates": {
      "nota": "Demo exitoso. Cliente muy interesado."
    },
    "actividad": {
      "titulo": "Follow-up post-demo",
      "tipo": "call",
      "fecha": "2025-01-10"
    }
  }'
```

---

## Checklist de Implementación

- [ ] Crear nuevo workflow en n8n
- [ ] Configurar webhook trigger con URL correcta
- [ ] Agregar credencial de Pipedrive con API token
- [ ] Implementar todos los nodos en orden
- [ ] Configurar error handlers en cada nodo HTTP
- [ ] Probar cada caso de uso individualmente
- [ ] Validar con deal real (ID 958)
- [ ] Probar manejo de errores (deal inexistente)
- [ ] Verificar logging en n8n
- [ ] Activar el workflow
- [ ] Integrar con frontend ProfitOps

---

## Próximos Pasos

1. **Importar el workflow** usando el JSON exportable (ver archivo adjunto)
2. **Configurar credenciales** de Pipedrive
3. **Probar con datos reales** del deal 958
4. **Integrar con el coach AI** para que pueda actualizar deals
5. **Monitorear** durante el demo con BLK

---

## Soporte

Para debugging:
- Revisar logs de ejecución en n8n
- Verificar respuestas en la tab de "Executions"
- Todos los errores se registran en la consola
- La respuesta siempre incluye campo `success` y `timestamp`

**Diseñado para el demo con BLK - Enero 2025**
