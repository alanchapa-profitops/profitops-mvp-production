# 🚀 ProfitOps n8n Workflow - Actualización de Pipedrive

Workflow completo para actualizar deals en Pipedrive desde ProfitOps AI Coach.

---

## 📁 Archivos Incluidos

### 1. `docs/n8n-workflow-export.json`
**JSON listo para importar en n8n**

- 27 nodos preconfigurados
- Todas las conexiones establecidas
- Validación y manejo de errores incluido

**Cómo usar**:
1. Abre n8n: https://profitops.app.n8n.cloud
2. Click en **Add workflow** → **Import from File**
3. Selecciona este archivo
4. Activa el workflow (toggle verde)

---

### 2. `docs/n8n-quick-start-guide.md`
**Guía de implementación rápida (10 minutos)**

- Instrucciones paso a paso
- Ejemplos de testing con curl
- Troubleshooting de problemas comunes
- Checklist pre-demo
- Casos de uso para BLK

---

### 3. `docs/n8n-pipedrive-update-workflow.md`
**Documentación técnica completa**

- Arquitectura detallada del workflow
- Configuración de cada uno de los 27 nodos
- Código JavaScript completo
- Manejo de errores
- Casos de uso avanzados

---

### 4. `src/lib/pipedrive-update-service.ts`
**Servicio TypeScript para el frontend**

- Interfaces TypeScript completas
- Métodos helper para cada operación
- Validación de datos
- Documentación con ejemplos

**Cómo usar**:
```typescript
import { PipedriveUpdateService } from './pipedrive-update-service';

// Actualizar MRR
await PipedriveUpdateService.updateMRR("Datatechnic México", 40000);

// Cambiar etapa
await PipedriveUpdateService.updateStage("Datatechnic México", 4);

// Actualización completa
await PipedriveUpdateService.updateDeal(
  "Datatechnic México",
  {
    mrr: 45000,
    stage_id: 4,
    probabilidad: 75
  }
);
```

---

## ⚡ Quick Start (3 Pasos)

### Paso 1: Importar el Workflow
1. Abre `docs/n8n-workflow-export.json`
2. Copia todo el contenido
3. Ve a n8n → **Import from File**
4. Pega o selecciona el archivo

### Paso 2: Activar
- Click en el toggle **Active** (esquina superior derecha)
- Debe quedar en verde ✅

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

**Respuesta esperada**:
```json
{
  "success": true,
  "message": "Deal actualizado exitosamente",
  "deal": {
    "id": 958,
    "title": "Datatechnic México"
  }
}
```

---

## 📊 Datos del Demo

**Webhook URL**:
```
https://profitops.app.n8n.cloud/webhook/7f477b94-4cb6-4f41-938a-5e987e7f1254
```

**Deal de Prueba**:
- Nombre: "Datatechnic México"
- ID: 958

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

## 🎯 Casos de Uso para el Demo

### 1. Actualizar Valor del Deal
```json
{
  "deal": "Datatechnic México",
  "updates": { "mrr": 40000 }
}
```

### 2. Cambiar Etapa + Agregar Nota
```json
{
  "deal": "Datatechnic México",
  "updates": {
    "stage_id": 4,
    "nota": "Cliente listo para propuesta formal"
  }
}
```

### 3. Actualización Completa con Actividad
```json
{
  "deal": "Datatechnic México",
  "updates": {
    "mrr": 45000,
    "stage_id": 4,
    "probabilidad": 75,
    "fecha_cierre": "2025-02-15",
    "nota": "Negociación avanzada. Cliente muy interesado."
  },
  "actividad": {
    "titulo": "Reunión de cierre",
    "tipo": "meeting",
    "fecha": "2025-02-01"
  },
  "completar_actividad": true
}
```

---

## ✅ Checklist Pre-Demo BLK

- [ ] Workflow importado en n8n
- [ ] Workflow activado (toggle verde)
- [ ] Webhook responde correctamente
- [ ] Probado con curl
- [ ] Deal 958 existe en Pipedrive
- [ ] API token válido
- [ ] Servicio TypeScript integrado en frontend
- [ ] Casos de uso probados

---

## 🔧 Integración con Frontend

Copia el archivo `src/lib/pipedrive-update-service.ts` a tu proyecto React:

```bash
cp src/lib/pipedrive-update-service.ts /ruta/a/tu/proyecto/src/lib/
```

Luego úsalo en tu código:

```typescript
import { PipedriveUpdateService } from '@/lib/pipedrive-update-service';

// En tu componente o servicio
const handleUpdateDeal = async () => {
  const result = await PipedriveUpdateService.updateDeal(
    "Datatechnic México",
    { mrr: 40000, stage_id: 4 }
  );

  if (result.success) {
    console.log('✅ Deal actualizado:', result.deal?.title);
  }
};
```

---

## 📖 Documentación Completa

Para más detalles, abre:

- **Guía Rápida**: `docs/n8n-quick-start-guide.md`
- **Documentación Técnica**: `docs/n8n-pipedrive-update-workflow.md`

---

## 🐛 Troubleshooting

**Deal no encontrado**:
- Verifica el nombre exacto en Pipedrive
- Respeta mayúsculas y minúsculas

**Error 401**:
- Verifica el API token de Pipedrive
- Token actual: `6875ccdf045b5c77ffaf0e442ed393c6d492bbcc`

**Workflow no actualiza**:
- Verifica que esté activado (toggle verde)
- Revisa logs en n8n → Executions

Ver más en: `docs/n8n-quick-start-guide.md` (sección Troubleshooting)

---

## 🎓 Características del Workflow

✅ **7 Casos de Uso Soportados**:
1. Actualizar valor (MRR) del deal
2. Cambiar etapa del deal
3. Agregar notas
4. Cambiar fecha de cierre
5. Cambiar probabilidad
6. Crear actividades de seguimiento
7. Completar actividades pendientes

✅ **Arquitectura Robusta**:
- Funciona con deals con y sin productos
- Manejo de errores en cada paso
- Validación de datos de entrada
- Logging completo
- Respuestas siempre exitosas cuando es posible

---

## 🚀 ¡Listo para el Demo!

Todo está configurado y listo para usar. El workflow es profesional, robusto y está diseñado para no fallar durante el demo con BLK.

**¡Buena suerte! 🎯**

---

## 📞 Soporte

**Documentación de referencia**:
- n8n: https://docs.n8n.io
- Pipedrive API: https://developers.pipedrive.com/docs/api/v1

**Demo**: BLK - Enero 2025
**Versión**: 1.0
