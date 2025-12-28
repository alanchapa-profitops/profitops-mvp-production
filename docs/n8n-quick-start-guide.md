# Guía Rápida de Implementación - Workflow n8n Pipedrive

## Implementación en 10 Minutos

### 1. Importar el Workflow

1. Abre n8n en: https://profitops.app.n8n.cloud
2. Ve a **Workflows** → **Add workflow** → **Import from File**
3. Selecciona el archivo: `docs/n8n-workflow-export.json`
4. Click en **Import**

### 2. Verificar el Webhook

1. Abre el nodo **"Recibir Actualización"**
2. Verifica que la URL sea: `https://profitops.app.n8n.cloud/webhook/7f477b94-4cb6-4f41-938a-5e987e7f1254`
3. Asegúrate que esté configurado para **POST** y **GET**

### 3. Activar el Workflow

1. Click en el toggle **Active** en la esquina superior derecha
2. Verifica que aparezca en verde

### 4. Probar el Workflow

Usa curl para probar:

```bash
curl -X POST https://profitops.app.n8n.cloud/webhook/7f477b94-4cb6-4f41-938a-5e987e7f1254 \
  -H "Content-Type: application/json" \
  -d '{
    "deal": "Datatechnic México",
    "updates": {
      "mrr": 40000
    }
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Deal actualizado exitosamente",
  "deal": {
    "id": 958,
    "title": "Datatechnic México",
    "actualizaciones_aplicadas": {
      "mrr": true,
      "etapa": false,
      "probabilidad": false,
      "fecha_cierre": false,
      "nota_agregada": false,
      "actividad_creada": false,
      "actividades_completadas": false
    }
  },
  "timestamp": "2025-01-08T..."
}
```

---

## Integración con Frontend

### Actualizar la URL en el Frontend

Abre el archivo donde llamas al webhook y usa esta configuración:

```typescript
// Ejemplo de integración en el coach AI
const PIPEDRIVE_UPDATE_WEBHOOK = "https://profitops.app.n8n.cloud/webhook/7f477b94-4cb6-4f41-938a-5e987e7f1254";

async function updatePipedriveDeal(dealName: string, updates: any) {
  try {
    const response = await fetch(PIPEDRIVE_UPDATE_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deal: dealName,
        updates: updates
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Deal actualizado:', result);
    return result;
  } catch (error) {
    console.error('❌ Error actualizando deal:', error);
    throw error;
  }
}
```

### Ejemplo de Uso desde el Coach AI

```typescript
// El coach AI puede actualizar un deal así:
await updatePipedriveDeal("Datatechnic México", {
  mrr: 45000,
  stage_id: 4,
  probabilidad: 75,
  fecha_cierre: "2025-02-15",
  nota: "Cliente confirmó interés en ampliar el proyecto"
});
```

---

## Casos de Uso Reales para el Demo

### 1. Actualizar Valor del Deal

```json
{
  "deal": "Datatechnic México",
  "updates": {
    "mrr": 40000
  }
}
```

### 2. Mover a Negociación y Agregar Nota

```json
{
  "deal": "Datatechnic México",
  "updates": {
    "stage_id": 4,
    "nota": "Demo exitoso. Cliente pidió propuesta formal para el próximo viernes."
  }
}
```

### 3. Cerrar Deal con Alta Probabilidad

```json
{
  "deal": "Datatechnic México",
  "updates": {
    "stage_id": 5,
    "probabilidad": 90,
    "fecha_cierre": "2025-02-01",
    "nota": "Contrato en revisión legal. Firma programada para el 1 de febrero."
  },
  "actividad": {
    "titulo": "Firma de contrato",
    "tipo": "meeting",
    "fecha": "2025-02-01"
  }
}
```

### 4. Reactivar Deal con Seguimiento

```json
{
  "deal": "Datatechnic México",
  "updates": {
    "nota": "Contacto retomado después de 2 semanas. Cliente aún interesado."
  },
  "actividad": {
    "titulo": "Follow-up post vacaciones",
    "tipo": "call",
    "fecha": "2025-01-15"
  },
  "completar_actividad": true
}
```

---

## Troubleshooting

### Error: "Deal no encontrado"

**Causa**: El nombre del deal no coincide exactamente con Pipedrive.

**Solución**:
1. Verifica el nombre exacto en Pipedrive
2. Asegúrate de usar el nombre completo
3. Respeta mayúsculas y minúsculas

**Ejemplo correcto**:
```json
{
  "deal": "Datatechnic México"  // ✅ Correcto
}
```

**Ejemplo incorrecto**:
```json
{
  "deal": "datatechnic mexico"  // ❌ Incorrecto
}
```

---

### Error: "HTTP 401 Unauthorized"

**Causa**: API token de Pipedrive incorrecto o expirado.

**Solución**:
1. Ve a Pipedrive → Settings → Personal preferences → API
2. Copia el token actual
3. Actualiza todos los nodos HTTP Request con el nuevo token
4. El token actual es: `6875ccdf045b5c77ffaf0e442ed393c6d492bbcc`

---

### Error: "Cannot read property 'id' of undefined"

**Causa**: El deal no tiene productos y se intentó actualizar vía productos.

**Solución**:
- Este error NO debería ocurrir porque el workflow tiene un IF que maneja esto
- Si ocurre, verifica que el nodo **"Tiene Productos?"** esté configurado correctamente
- La condición debe ser: `{{ $json.data && $json.data.length > 0 }}`

---

### El workflow ejecuta pero no actualiza nada

**Causa**: Los campos vienen como `null` o no se están enviando.

**Solución**:
1. Verifica el JSON de entrada en el nodo **"Validar Entrada"**
2. Asegúrate de que los campos tengan valores
3. Revisa la ejecución paso a paso en n8n

**Debug en n8n**:
1. Click derecho en cualquier nodo → **Execute Node**
2. Revisa el output en el panel derecho
3. Verifica que los datos fluyan correctamente

---

### Las actividades no se crean

**Causa**: El tipo de actividad no es válido en Pipedrive.

**Solución**:
- Usa solo estos tipos válidos:
  - `call`
  - `meeting`
  - `task`
  - `deadline`
  - `email`
  - `lunch`

**Ejemplo correcto**:
```json
{
  "actividad": {
    "titulo": "Llamada de seguimiento",
    "tipo": "call",  // ✅ Tipo válido
    "fecha": "2025-01-15"
  }
}
```

---

### El workflow es muy lento

**Causa**: Múltiples llamadas HTTP secuenciales.

**Optimización**:
- El workflow ya está optimizado para ser lo más rápido posible
- Las llamadas HTTP son secuenciales porque dependen unas de otras
- Tiempo promedio esperado: **2-4 segundos**

**Mejoras futuras**:
- Cachear el resultado de "Buscar Deal" si se usa frecuentemente
- Usar Pipedrive Webhooks para recibir actualizaciones en lugar de hacer GET

---

## Monitoreo y Debugging

### Ver Ejecuciones Recientes

1. En n8n, ve a **Executions** en el menú lateral
2. Verás todas las ejecuciones recientes
3. Click en cualquiera para ver el flujo completo

### Logs Importantes

Cada nodo Code tiene logs. Para verlos:

1. Abre el nodo Code
2. Click en **Execute Node**
3. Revisa la consola en la pestaña **Output**

### Notificaciones de Error

Para recibir notificaciones cuando falle el workflow:

1. Agrega un nodo **"Send Email"** al final del flujo de error
2. Configúralo para enviar a tu email
3. Incluye el error y el timestamp

---

## Checklist Pre-Demo

Antes del demo con BLK, verifica:

- [ ] Workflow activado (toggle verde)
- [ ] Webhook responde correctamente
- [ ] Deal de prueba (958) existe en Pipedrive
- [ ] API token válido y no expirado
- [ ] Probado con curl exitosamente
- [ ] Probado cada caso de uso:
  - [ ] Actualizar MRR
  - [ ] Cambiar etapa
  - [ ] Agregar nota
  - [ ] Crear actividad
  - [ ] Completar actividades
- [ ] Frontend integrado correctamente
- [ ] Coach AI puede actualizar deals
- [ ] Respuestas se muestran al usuario

---

## Configuración para Múltiples Deals

Si necesitas actualizar múltiples deals en el mismo workflow:

**Opción 1: Enviar array de deals**

```json
{
  "deals": [
    {
      "deal": "Datatechnic México",
      "updates": { "mrr": 40000 }
    },
    {
      "deal": "Acme Corp",
      "updates": { "stage_id": 3 }
    }
  ]
}
```

**Modificación necesaria**:
- Agregar un nodo **"Split In Batches"** después de **"Validar Entrada"**
- Configurar batch size = 1
- El resto del workflow se ejecutará para cada deal

**Opción 2: Llamar el webhook múltiples veces**

```typescript
const deals = [
  { name: "Datatechnic México", updates: { mrr: 40000 } },
  { name: "Acme Corp", updates: { stage_id: 3 } }
];

for (const deal of deals) {
  await updatePipedriveDeal(deal.name, deal.updates);
}
```

---

## Próximos Pasos Después del Demo

1. **Optimización**:
   - Implementar caché para búsqueda de deals
   - Reducir llamadas HTTP usando batch updates de Pipedrive

2. **Features Adicionales**:
   - Crear deals nuevos desde el coach
   - Actualizar contactos y organizaciones
   - Sincronización bidireccional

3. **Monitoreo**:
   - Dashboard de métricas de uso
   - Alertas automáticas de errores
   - Logs centralizados

4. **Seguridad**:
   - Autenticación en el webhook
   - Rate limiting
   - Validación de datos más estricta

---

## Soporte Técnico

**Durante el demo**:
- Tener n8n abierto en otra pestaña
- Monitorear la pestaña **Executions** en tiempo real
- Tener curl listo para testing rápido

**Contactos de emergencia**:
- n8n Support: https://n8n.io/support
- Pipedrive API Docs: https://developers.pipedrive.com/docs/api/v1

**Backup plan**:
- Si el workflow falla, usar actualización manual en Pipedrive
- Tener los datos del deal listos para mostrar
- Demostrar el concepto aunque sea manualmente

---

## Éxito del Demo

El demo será exitoso si puedes mostrar:

1. ✅ Coach AI actualiza deals en tiempo real
2. ✅ Los cambios se reflejan inmediatamente en Pipedrive
3. ✅ El sistema es confiable y no falla
4. ✅ La interfaz es intuitiva y fácil de usar
5. ✅ El valor agregado es claro para el cliente

**¡Mucha suerte con el demo de BLK! 🚀**
