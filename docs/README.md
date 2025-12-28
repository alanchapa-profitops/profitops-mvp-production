# Documentación del Workflow n8n - ProfitOps ↔ Pipedrive

Esta carpeta contiene toda la documentación necesaria para implementar y mantener el workflow de n8n que conecta ProfitOps con Pipedrive.

## 📁 Archivos Incluidos

### 1. `n8n-pipedrive-update-workflow.md`
**Documentación técnica completa del workflow**

- Arquitectura detallada del flujo
- Configuración de cada nodo (27 nodos en total)
- Mapeo de etapas de Pipedrive
- Manejo de errores
- Casos de uso con ejemplos
- Checklist de implementación

**Úsalo cuando**: Necesites entender la arquitectura completa o configurar cada nodo manualmente.

---

### 2. `n8n-workflow-export.json`
**Archivo JSON exportable para n8n**

Workflow completo listo para importar en n8n con:
- 27 nodos configurados
- Todas las conexiones
- Validación de datos
- Manejo de errores

**Úsalo cuando**: Quieras importar el workflow directamente en n8n sin configurar cada nodo manualmente.

**Cómo importar**:
1. Abre n8n: https://profitops.app.n8n.cloud
2. Click en **Add workflow** → **Import from File**
3. Selecciona `n8n-workflow-export.json`
4. Click en **Import**
5. Activa el workflow

---

### 3. `n8n-quick-start-guide.md`
**Guía de implementación rápida (10 minutos)**

- Implementación paso a paso
- Casos de uso para el demo
- Troubleshooting común
- Ejemplos de testing con curl
- Checklist pre-demo
- Tips de monitoreo

**Úsalo cuando**: Necesites implementar rápidamente antes del demo o resolver problemas comunes.

---

### 4. `coach-integration-examples.md`
**Integración del Coach AI con Pipedrive**

- Ejemplos de detección de intenciones
- System prompts mejorados
- Código TypeScript para integración
- Casos de uso del coach actualizando deals
- Testing y validación

**Úsalo cuando**: Necesites integrar el coach AI para que actualice deals automáticamente.

---

## 🚀 Quick Start - Implementación en 3 Pasos

### Paso 1: Importar el Workflow
```bash
# Abre n8n y selecciona "Import from File"
# Archivo: docs/n8n-workflow-export.json
```

### Paso 2: Activar el Workflow
```bash
# Click en el toggle "Active" en n8n
```

### Paso 3: Probar
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

---

## 📊 Arquitectura del Sistema

```
┌─────────────────┐
│  ProfitOps UI   │
│  (React)        │
└────────┬────────┘
         │
         │ HTTP POST
         ↓
┌─────────────────────────┐
│  n8n Webhook            │
│  7f477b94-4cb6-...      │
└────────┬────────────────┘
         │
         │ Procesa datos
         ↓
┌─────────────────────────┐
│  Buscar Deal            │
│  (Pipedrive Search API) │
└────────┬────────────────┘
         │
         ↓
┌──────────────────────────┐
│  ¿Tiene productos?       │
│  (IF condition)          │
└──┬───────────────────┬───┘
   │                   │
   │ SÍ                │ NO
   ↓                   ↓
┌──────────────┐  ┌──────────────┐
│ Actualizar   │  │ Actualizar   │
│ Producto     │  │ Deal Directo │
└──────┬───────┘  └──────┬───────┘
       │                 │
       └────────┬────────┘
                ↓
       ┌─────────────────┐
       │ Merge & Continuar│
       └────────┬─────────┘
                │
                ↓
       ┌─────────────────┐
       │ Actualizar Etapa │
       │ Agregar Nota     │
       │ Crear Actividad  │
       │ Completar Acts   │
       └────────┬─────────┘
                │
                ↓
       ┌─────────────────┐
       │ Respuesta Final  │
       │ (JSON)           │
       └─────────────────┘
```

---

## 📋 Casos de Uso Principales

### 1. Actualizar Valor del Deal
```json
{
  "deal": "Datatechnic México",
  "updates": { "mrr": 40000 }
}
```

### 2. Cambiar Etapa + Nota
```json
{
  "deal": "Datatechnic México",
  "updates": {
    "stage_id": 4,
    "nota": "Cliente listo para propuesta"
  }
}
```

### 3. Actualización Completa
```json
{
  "deal": "Datatechnic México",
  "updates": {
    "mrr": 45000,
    "stage_id": 4,
    "probabilidad": 75,
    "fecha_cierre": "2025-02-15",
    "nota": "Negociación avanzada"
  },
  "actividad": {
    "titulo": "Seguimiento",
    "tipo": "call",
    "fecha": "2025-01-15"
  },
  "completar_actividad": true
}
```

---

## 🔧 Integración con Frontend

El servicio TypeScript está listo en: `src/lib/pipedrive-update-service.ts`

**Ejemplo de uso**:

```typescript
import { PipedriveUpdateService } from '@/lib/pipedrive-update-service';

// Actualizar MRR
await PipedriveUpdateService.updateMRR("Datatechnic México", 40000);

// Cambiar etapa
await PipedriveUpdateService.updateStage("Datatechnic México", 4);

// Agregar nota
await PipedriveUpdateService.addNote("Datatechnic México", "Cliente interesado");

// Actualización completa
await PipedriveUpdateService.updateDeal(
  "Datatechnic México",
  {
    mrr: 45000,
    stage_id: 4,
    probabilidad: 75,
    nota: "Negociación avanzada"
  },
  {
    titulo: "Reunión de cierre",
    tipo: "meeting",
    fecha: "2025-02-01"
  }
);
```

---

## 🎯 Datos del Demo

**Deal de Prueba**:
- Nombre: "Datatechnic México"
- ID: 958
- Pipeline: Principal

**Webhook URL**:
```
https://profitops.app.n8n.cloud/webhook/7f477b94-4cb6-4f41-938a-5e987e7f1254
```

**API Token Pipedrive**:
```
6875ccdf045b5c77ffaf0e442ed393c6d492bbcc
```

**Mapeo de Etapas**:
```
1 → 104 (Prospección)
2 → 22  (Discovery)
3 → 23  (Propuesta)
4 → 24  (Negociación)
5 → 25  (Cierre)
6 → 26  (Ganado/Perdido)
```

---

## ✅ Checklist Pre-Demo

- [ ] Workflow importado en n8n
- [ ] Workflow activado (toggle verde)
- [ ] Webhook responde correctamente
- [ ] Probado con curl
- [ ] Deal de prueba (958) existe
- [ ] API token válido
- [ ] Frontend integrado
- [ ] Coach AI configurado
- [ ] Casos de uso probados:
  - [ ] Actualizar MRR
  - [ ] Cambiar etapa
  - [ ] Agregar nota
  - [ ] Crear actividad
  - [ ] Completar actividades

---

## 🐛 Troubleshooting Rápido

**Deal no encontrado**:
- Verifica el nombre exacto en Pipedrive
- Respeta mayúsculas y minúsculas

**Error 401**:
- Verifica el API token de Pipedrive
- Token actual: `6875ccdf045b5c77ffaf0e442ed393c6d492bbcc`

**Workflow no actualiza**:
- Verifica que esté activado (toggle verde)
- Revisa los logs en n8n → Executions
- Asegúrate de enviar datos válidos

**Más detalles**: Ver `n8n-quick-start-guide.md`

---

## 📞 Soporte

**Documentación**:
- n8n: https://docs.n8n.io
- Pipedrive API: https://developers.pipedrive.com/docs/api/v1

**Issues**:
- Para problemas técnicos, crear un issue en el repo
- Para el demo, contactar al equipo de ProfitOps

---

## 🎓 Recursos Adicionales

### Tutoriales de n8n
- [n8n Basics](https://docs.n8n.io/getting-started/)
- [HTTP Request Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/)
- [Webhooks](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)

### API de Pipedrive
- [Deals API](https://developers.pipedrive.com/docs/api/v1/Deals)
- [Activities API](https://developers.pipedrive.com/docs/api/v1/Activities)
- [Notes API](https://developers.pipedrive.com/docs/api/v1/Notes)

---

## 📝 Notas de Versión

### v1.0 - Versión Demo BLK (Enero 2025)

**Features**:
- ✅ Actualización de deals (MRR, etapa, probabilidad, fecha cierre)
- ✅ Soporte para deals con y sin productos
- ✅ Agregar notas a deals
- ✅ Crear actividades de seguimiento
- ✅ Completar actividades pendientes
- ✅ Manejo robusto de errores
- ✅ Validación de datos de entrada
- ✅ Logging completo

**Próximas Features** (Post-Demo):
- Crear deals nuevos
- Actualizar contactos y organizaciones
- Webhooks de Pipedrive → ProfitOps
- Sincronización bidireccional
- Dashboard de métricas

---

## 🚀 ¡Listo para el Demo!

Todo está configurado y documentado. El workflow es robusto, profesional y está listo para impresionar a BLK.

**¡Buena suerte con el demo! 🎯**
