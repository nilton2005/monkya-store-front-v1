# 🎨 Integración AI Design Editor

## ✅ Lo que ya está listo:

1. **Botón AI en el Navbar** ✨
   - Ubicación: Al lado del carrito de compras
   - Ícono: Sparkles (✨) con animación de pulso
   - Click: Abre modal fullscreen

2. **Modal AI Design** 🖼️
   - Fullscreen en móvil
   - 95% del viewport en desktop
   - Cierra con: ESC, X, o click fuera
   - Previene scroll del body

3. **Estructura de componentes** 📁
   ```
   components/ai-design/
   ├── ai-button.tsx      ← Botón en navbar
   ├── ai-modal.tsx       ← Modal container
   └── ai-editor.tsx      ← Editor placeholder
   ```

## 🚀 Próximos pasos - Integrar NanoBananaEditor:

### Paso 1: Copiar componentes del NanoBananaEditor

Copia estos archivos desde `NanoBananaEditor/src/` a tu proyecto:

```bash
# Componentes principales
NanoBananaEditor/src/components/Header.tsx
  → components/ai-design/nano-components/Header.tsx

NanoBananaEditor/src/components/PromptComposer.tsx
  → components/ai-design/nano-components/PromptComposer.tsx

NanoBananaEditor/src/components/ImageCanvas.tsx
  → components/ai-design/nano-components/ImageCanvas.tsx

NanoBananaEditor/src/components/HistoryPanel.tsx
  → components/ai-design/nano-components/HistoryPanel.tsx

NanoBananaEditor/src/components/MaskOverlay.tsx
  → components/ai-design/nano-components/MaskOverlay.tsx

# UI Components
NanoBananaEditor/src/components/ui/
  → components/ai-design/nano-components/ui/

# Hooks
NanoBananaEditor/src/hooks/
  → components/ai-design/hooks/

# Services
NanoBananaEditor/src/services/
  → components/ai-design/services/

# Store
NanoBananaEditor/src/store/
  → components/ai-design/store/

# Utils
NanoBananaEditor/src/utils/
  → components/ai-design/utils/

# Types
NanoBananaEditor/src/types/
  → components/ai-design/types/
```

### Paso 2: Actualizar ai-editor.tsx

Reemplaza el contenido de `components/ai-design/ai-editor.tsx`:

```typescript
'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './nano-components/Header';
import { PromptComposer } from './nano-components/PromptComposer';
import { ImageCanvas } from './nano-components/ImageCanvas';
import { HistoryPanel } from './nano-components/HistoryPanel';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAppStore } from './store/useAppStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
  },
});

function AIEditorContent() {
  useKeyboardShortcuts();
  
  const { showPromptPanel, setShowPromptPanel, showHistory, setShowHistory } = useAppStore();
  
  React.useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setShowPromptPanel(false);
        setShowHistory(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setShowPromptPanel, setShowHistory]);

  return (
    <div className="h-full bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <div className={`flex-shrink-0 transition-all duration-300 ${!showPromptPanel && "w-8"}`}>
          <PromptComposer />
        </div>
        <div className="flex-1 min-w-0">
          <ImageCanvas />
        </div>
        <div className="flex-shrink-0">
          <HistoryPanel />
        </div>
      </div>
    </div>
  );
}

export default function AIDesignEditor() {
  return (
    <QueryClientProvider client={queryClient}>
      <AIEditorContent />
    </QueryClientProvider>
  );
}
```

### Paso 3: Configurar variables de entorno

Agrega a tu `.env.local`:

```bash
# Gemini API para generación de imágenes
NEXT_PUBLIC_GEMINI_API_KEY=tu_api_key_aqui
```

### Paso 4: Instalar dependencias adicionales (si faltan)

```bash
pnpm install zustand konva react-konva
```

## 🎯 Funcionalidades del AI Design Editor:

1. **Generación de imágenes con IA** 🤖
   - Powered by Google Gemini
   - Prompts en lenguaje natural
   - Historial de generaciones

2. **Editor de máscaras** 🎭
   - Edición de áreas específicas
   - Inpainting para modificaciones locales
   - Outpainting para expandir imágenes

3. **Historial** 📚
   - Guarda todas las generaciones
   - Cache en localStorage
   - Navegación fácil entre versiones

4. **Atajos de teclado** ⌨️
   - `Ctrl+Enter`: Generar
   - `Ctrl+Z`: Deshacer
   - `Ctrl+Shift+Z`: Rehacer
   - `Escape`: Cerrar

## 🔧 Personalización:

### Cambiar colores del modal:

En `ai-modal.tsx`:
```typescript
// Cambiar tema oscuro
className="bg-gray-900"  → className="bg-black"

// Cambiar color del header
className="from-blue-500 to-purple-600"  → className="from-teal-500 to-green-600"
```

### Ajustar tamaño del modal:

```typescript
// Desktop
className="md:h-[90vh] md:w-[95vw]"
// Cambiar a:
className="md:h-[80vh] md:w-[90vw]"  // Más pequeño
className="md:h-full md:w-full"      // Fullscreen
```

## 🎨 Uso en la tienda:

1. Usuario hace click en el botón ✨ AI en el navbar
2. Se abre el modal con el editor
3. Usuario crea su diseño personalizado
4. (Próximo): Puede agregar el diseño al producto
5. (Próximo): El diseño se aplica a la camiseta/hoodie

## 🚧 TODOs futuros:

- [ ] Integrar diseño generado con productos
- [ ] Guardar diseños en cuenta de usuario
- [ ] Preview del diseño en productos
- [ ] Exportar diseño a diferentes formatos
- [ ] Galería de diseños comunitarios

## 📝 Notas:

- El modal es completamente responsive
- Los componentes están aislados del resto de la app
- QueryClient está scoped solo al AI Editor
- No afecta el performance de la tienda

¡Disfruta creando diseños únicos con IA! 🎉
