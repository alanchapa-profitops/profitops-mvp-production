# 🚀 Cómo Acceder a Estos Archivos desde tu Mac

## 📍 Ubicación Actual

Estos archivos están en el servidor/contenedor en:
```
/home/user/profitops-mvp-production/workflow-n8n-export/
```

## 💡 Opciones para Acceder

### Opción 1: Desde VS Code (Recomendado) ✅

Si tienes VS Code conectado a este servidor:

1. Abre VS Code
2. Ve al explorador de archivos (sidebar izquierdo)
3. Busca la carpeta: `workflow-n8n-export`
4. Haz clic derecho → **Download** para descargar toda la carpeta a tu Mac

### Opción 2: Desde Terminal (SCP)

Desde tu **Terminal de Mac** (no desde esta sesión SSH):

```bash
# Descarga toda la carpeta a tu Desktop
scp -r [usuario]@[servidor]:/home/user/profitops-mvp-production/workflow-n8n-export ~/Desktop/

# O descarga solo el JSON (el más importante)
scp [usuario]@[servidor]:/home/user/profitops-mvp-production/workflow-n8n-export/docs/n8n-workflow-export.json ~/Desktop/
```

### Opción 3: Ver el Contenido Aquí Mismo

Los archivos también están en la carpeta `docs/` del proyecto:

```bash
# Desde el proyecto actual
cat docs/n8n-workflow-export.json
cat docs/n8n-quick-start-guide.md
cat docs/n8n-pipedrive-update-workflow.md
cat src/lib/pipedrive-update-service.ts
```

### Opción 4: Copiar el JSON Directamente

El archivo más importante es `docs/n8n-workflow-export.json`.

Para verlo y copiarlo:

```bash
cat workflow-n8n-export/docs/n8n-workflow-export.json
```

Luego:
1. Copia el contenido completo
2. Pégalo en un nuevo archivo .json en tu Mac
3. Importa ese archivo en n8n

## 📦 Archivos Incluidos

```
workflow-n8n-export/
├── INICIO-RAPIDO.txt          ⚡ Guía de 5 minutos
├── README.md                   📖 Documentación general
├── ESTRUCTURA.txt              🗺️  Mapa de archivos
├── test-examples.sh            🧪 Script de testing
├── docs/
│   ├── n8n-workflow-export.json       ⭐ IMPORTAR EN N8N
│   ├── n8n-quick-start-guide.md       📘 Guía rápida
│   └── n8n-pipedrive-update-workflow.md  📕 Docs técnica
└── src/lib/
    └── pipedrive-update-service.ts    💻 Servicio TypeScript
```

## 🎯 Siguiente Paso Inmediato

**Para el demo, necesitas principalmente:**

1. **El archivo JSON** → `docs/n8n-workflow-export.json`
   - Importarlo en n8n

2. **La guía rápida** → `INICIO-RAPIDO.txt`
   - Para seguir los pasos

**El resto de archivos son de referencia y documentación.**

## 🚀 Quick Start

Si quieres empezar YA, solo necesitas:

1. Abrir: `workflow-n8n-export/docs/n8n-workflow-export.json`
2. Copiar TODO el contenido
3. Ir a n8n → Import from File
4. Pegar el JSON

**¡Listo! El workflow estará importado.**

## 💡 Tip

Si estás usando Git, estos archivos ya están commiteados en tu rama:
```
claude/n8n-pipedrive-workflow-calKU
```

Puedes hacer pull desde tu Mac y tendrás todos los archivos localmente.

---

**¿Necesitas ayuda para descargar los archivos? Dime qué método prefieres y te ayudo.**
