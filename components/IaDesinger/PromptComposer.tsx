import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Edit3,
    HelpCircle,
    MousePointer,
    RotateCcw,
    Store,
    Upload,
    Wand2,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { useAppStore } from "storeIA/useAppStore";
import {
    useImageEditing,
    useImageGeneration,
} from "../../hooks/useImageGeneration";
import { cn } from "../../utils/cn";
import { blobToBase64 } from "../../utils/imageUtils";
import { DesignPositionSelector } from "./DesignPositionSelector";
import { ProductConfigurator } from "./ProductConfigurator";
import { buildDesignPrompt, validateDesignPrompt } from "./promptBuilder";
import { PromptHints } from "./PromptHints";
import { StoreProductModal } from "./StoreProductModal";
import { StyleSelector } from "./StyleSelector";
import { Button } from "./ui/Button";
import { Textarea } from "./ui/Textarea";

const TOTAL_STEPS = 3;

export const PromptComposer: React.FC = () => {
  const {
    currentPrompt,
    setCurrentPrompt,
    selectedTool,
    setSelectedTool,
    temperature,
    setTemperature,
    seed,
    setSeed,
    isGenerating,
    uploadedImages,
    addUploadedImage,
    removeUploadedImage,
    clearUploadedImages,
    editReferenceImages,
    addEditReferenceImage,
    removeEditReferenceImage,
    clearEditReferenceImages,
    canvasImage,
    setCanvasImage,
    showPromptPanel,
    setShowPromptPanel,
    clearBrushStrokes,
    productConfig,
    designConfig,
    resetProductConfig,
  } = useAppStore();

  const { generate } = useImageGeneration();
  const { edit } = useImageEditing();
  const [currentStep, setCurrentStep] = useState(1); // 1: Producto, 2: Estilo/Ubicación, 3: Diseño
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showHintsModal, setShowHintsModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const TOTAL_STEPS = 3;

  const handleGenerate = () => {
    if (!currentPrompt.trim()) return;

    // Validar el prompt
    const validation = validateDesignPrompt(currentPrompt);
    if (!validation.valid) {
      setValidationError(validation.reason || "Prompt no válido");
      return;
    }
    setValidationError(null);

    if (selectedTool === "generate") {
      // Construir el prompt final con todas las configuraciones
      const finalPrompt = buildDesignPrompt({
        productConfig,
        designConfig,
        userPrompt: currentPrompt,
        hasReferenceImage: uploadedImages.length > 0,
      });

      console.log("🎨 Prompt final construido:", finalPrompt);

      const referenceImages = uploadedImages
        .filter((img) => img.includes("base64,"))
        .map((img) => img.split("base64,")[1])
        .filter((img): img is string => img !== undefined);

      generate({
        prompt: finalPrompt,
        referenceImages:
          referenceImages.length > 0 ? referenceImages : undefined,
        temperature,
        seed: seed || undefined,
      });
    } else if (selectedTool === "edit" || selectedTool === "mask") {
      edit(currentPrompt);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      try {
        const base64 = await blobToBase64(file);
        const dataUrl = `data:${file.type};base64,${base64}`;

        if (selectedTool === "generate") {
          // Add to reference images (max 2)
          if (uploadedImages.length < 2) {
            addUploadedImage(dataUrl);
          }
        } else if (selectedTool === "edit") {
          // For edit mode, add to separate edit reference images (max 2)
          if (editReferenceImages.length < 2) {
            addEditReferenceImage(dataUrl);
          }
          // Set as canvas image if none exists
          if (!canvasImage) {
            setCanvasImage(dataUrl);
          }
        } else if (selectedTool === "mask") {
          // For mask mode, set as canvas image immediately
          clearUploadedImages();
          addUploadedImage(dataUrl);
          setCanvasImage(dataUrl);
        }
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    }
  };

  const handleStoreImageSelect = async (imageUrl: string) => {
    try {
      // Convertir la URL de la imagen a base64 para que funcione como referencia
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const base64 = await blobToBase64(blob);
      const dataUrl = `data:${blob.type};base64,${base64}`;

      if (selectedTool === "generate") {
        if (uploadedImages.length < 2) {
          addUploadedImage(dataUrl);
        }
      } else if (selectedTool === "edit") {
        if (editReferenceImages.length < 2) {
          addEditReferenceImage(dataUrl);
        }
        if (!canvasImage) {
          setCanvasImage(dataUrl);
        }
      } else if (selectedTool === "mask") {
        clearUploadedImages();
        addUploadedImage(dataUrl);
        setCanvasImage(dataUrl);
      }
    } catch (error) {
      console.error("Error al procesar imagen de la tienda:", error);
    }
  };

  const handleClearSession = () => {
    setCurrentPrompt("");
    clearUploadedImages();
    clearEditReferenceImages();
    clearBrushStrokes();
    setCanvasImage(null);
    setSeed(null);
    setTemperature(0.7);
    setShowClearConfirm(false);
    resetProductConfig();
    setCurrentStep(1);
  };

  const tools = [
    {
      id: "generate",
      icon: Wand2,
      label: "Generar",
      description: "Crear desde texto",
    },
    {
      id: "edit",
      icon: Edit3,
      label: "Editar",
      description: "Modificar existente",
    },
    {
      id: "mask",
      icon: MousePointer,
      label: "Seleccionar",
      description: "Clic para seleccionar",
    },
  ] as const;

  if (!showPromptPanel) {
    return (
      <div className="w-8 bg-gray-950 border-r border-gray-800 flex flex-col items-center justify-center">
        <button
          onClick={() => setShowPromptPanel(true)}
          className="w-6 h-16 bg-gray-800 hover:bg-gray-700 rounded-r-lg border border-l-0 border-gray-700 flex items-center justify-center transition-colors group"
          title="Mostrar Panel"
        >
          <div className="flex flex-col space-y-1">
            <div className="w-1 h-1 bg-gray-500 group-hover:bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-500 group-hover:bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-500 group-hover:bg-gray-400 rounded-full"></div>
          </div>
        </button>
      </div>
    );
  }

  // Render para modos de edición (edit/mask) - Mantiene UI original
  if (selectedTool !== "generate") {
    return (
      <>
        <div className="w-[85vw] max-w-80 md:w-72 lg:w-80 h-full bg-gray-950 border-r border-gray-800 p-3 md:p-4 lg:p-6 flex flex-col space-y-3 md:space-y-4 overflow-y-auto">
          {/* Mode Selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-300">Modo</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPromptPanel(false)}
                className="h-6 w-6"
                title="Ocultar Panel"
              >
                ×
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => {
                    setSelectedTool(tool.id);
                    if (tool.id === "generate") setCurrentStep(1);
                  }}
                  className={cn(
                    "flex flex-col items-center p-3 rounded-lg border transition-all duration-200",
                    selectedTool === tool.id
                      ? "bg-yellow-400/10 border-yellow-400/50 text-yellow-400"
                      : "bg-gray-900 border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-gray-300",
                  )}
                >
                  <tool.icon className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">{tool.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* File Upload para Edit/Mask */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-1 block">
              {selectedTool === "edit"
                ? "Referencias de estilo"
                : "Subir imagen"}
            </label>
            <p className="text-xs text-gray-500 mb-3">
              {selectedTool === "mask"
                ? "Edita una imagen con máscaras"
                : "Sube una imagen para editar"}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" /> Subir
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowStoreModal(true)}
                className="w-full"
              >
                <Store className="h-4 w-4 mr-2" /> Tienda
              </Button>
            </div>
          </div>

          {/* Prompt para edición */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Describe tus cambios
            </label>
            <Textarea
              value={currentPrompt}
              onChange={(e) => setCurrentPrompt(e.target.value)}
              placeholder="Haz el cielo más dramático, agrega nubes de tormenta..."
              className="min-h-[80px] resize-none text-sm"
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !currentPrompt.trim()}
            className="w-full h-12"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2" />{" "}
                Procesando...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" /> Aplicar Edición
              </>
            )}
          </Button>
        </div>
        <PromptHints open={showHintsModal} onOpenChange={setShowHintsModal} />
        <StoreProductModal
          open={showStoreModal}
          onOpenChange={setShowStoreModal}
          onSelectImage={handleStoreImageSelect}
        />
      </>
    );
  }

  // Render principal para modo GENERATE con pasos
  return (
    <>
      <div className="w-[85vw] max-w-96 md:w-80 lg:w-96 h-full bg-gray-950 border-r border-gray-800 flex flex-col overflow-hidden">
        {/* Header con pasos */}
        <div className="p-3 border-b border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-300">Crear Diseño</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowPromptPanel(false)}
              className="h-6 w-6"
            >
              ×
            </Button>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <button
                  onClick={() => setCurrentStep(step)}
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-all",
                    currentStep === step
                      ? "bg-yellow-400 text-gray-900"
                      : currentStep > step
                        ? "bg-green-500 text-white"
                        : "bg-gray-800 text-gray-500",
                  )}
                >
                  {currentStep > step ? "✓" : step}
                </button>
                {step < 3 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-2",
                      currentStep > step ? "bg-green-500" : "bg-gray-800",
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-1 text-[10px] text-gray-500">
            <span>Producto</span>
            <span>Estilo</span>
            <span>Diseño</span>
          </div>
        </div>

        {/* Content por paso */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* PASO 1: Configuración del Producto */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <ProductConfigurator />
            </div>
          )}

          {/* PASO 2: Estilo y Ubicación */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <StyleSelector />
              <div className="border-t border-gray-800 pt-4">
                <DesignPositionSelector />
              </div>
            </div>
          )}

          {/* PASO 3: Descripción y Generación */}
          {currentStep === 3 && (
            <div className="space-y-4">
              {/* Resumen de configuración */}
              <div className="p-3 bg-gray-900 rounded-lg border border-gray-800">
                <h4 className="text-xs font-medium text-gray-400 mb-2">
                  Tu configuración:
                </h4>
                <div className="space-y-1 text-xs">
                  <p className="text-gray-300">
                    <span className="text-gray-500">Prenda:</span>{" "}
                    {productConfig.type === "polo" ? "Polo" : "Polera"}{" "}
                    {productConfig.color}
                  </p>
                  {productConfig.type === "polo" && (
                    <p className="text-gray-300">
                      <span className="text-gray-500">Manga:</span>{" "}
                      {productConfig.sleeveType === "manga-corta"
                        ? "Corta"
                        : "Larga"}
                    </p>
                  )}
                  {productConfig.type === "polera" && (
                    <p className="text-gray-300">
                      <span className="text-gray-500">Capucha:</span>{" "}
                      {productConfig.hoodType === "con-gorro"
                        ? "Con gorro"
                        : "Sin gorro"}
                    </p>
                  )}
                  <p className="text-gray-300">
                    <span className="text-gray-500">Cuello:</span>{" "}
                    {productConfig.neckType === "v" ? "V" : "Circular"}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-500">Material:</span>{" "}
                    {productConfig.material === "pima"
                      ? "Algodón Pima"
                      : "Algodón 100%"}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-500">Ubicaciones:</span>{" "}
                    {designConfig.positions.length}
                  </p>
                  <p className="text-yellow-400/80 text-[10px] mt-1">
                    🐵 Logo Monkya incluido
                  </p>
                </div>
              </div>

              {/* Imagen de referencia */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Imagen de referencia (opcional)
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Solo se extraerá el diseño, no los colores
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadedImages.length >= 2}
                  >
                    <Upload className="h-3 w-3 mr-1" /> Subir
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowStoreModal(true)}
                    disabled={uploadedImages.length >= 2}
                  >
                    <Store className="h-3 w-3 mr-1" /> Tienda
                  </Button>
                </div>
                {uploadedImages.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {uploadedImages.map((img, i) => (
                      <div key={i} className="relative">
                        <img
                          src={img}
                          alt={`Ref ${i + 1}`}
                          className="w-full h-16 object-cover rounded border border-gray-700"
                        />
                        <button
                          onClick={() => removeUploadedImage(i)}
                          className="absolute top-1 right-1 bg-gray-900/80 text-gray-400 hover:text-white rounded-full p-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Prompt del usuario */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">
                    Describe tu diseño
                  </label>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowHintsModal(true)}
                    className="h-5 w-5"
                  >
                    <HelpCircle className="h-3 w-3" />
                  </Button>
                </div>
                <Textarea
                  value={currentPrompt}
                  onChange={(e) => {
                    setCurrentPrompt(e.target.value);
                    setValidationError(null);
                  }}
                  placeholder="Ej: Un mono astronauta con estilo cartoon, un logo de montañas minimalista, un dragón japonés..."
                  className="min-h-[100px] resize-none text-sm"
                />
                {validationError && (
                  <p className="text-xs text-red-400 mt-1">{validationError}</p>
                )}
                <div className="mt-1 flex items-center text-xs text-gray-500">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full mr-2",
                      currentPrompt.length < 10
                        ? "bg-red-500"
                        : currentPrompt.length < 30
                          ? "bg-yellow-500"
                          : "bg-green-500",
                    )}
                  />
                  {currentPrompt.length < 10
                    ? "Describe tu idea"
                    : currentPrompt.length < 30
                      ? "Añade más detalles"
                      : "¡Buen detalle!"}
                </div>
              </div>

              {/* Controles avanzados */}
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center text-xs text-gray-500 hover:text-gray-400"
              >
                {showAdvanced ? (
                  <ChevronDown className="h-3 w-3 mr-1" />
                ) : (
                  <ChevronRight className="h-3 w-3 mr-1" />
                )}
                Opciones avanzadas
              </button>
              {showAdvanced && (
                <div className="space-y-3 p-3 bg-gray-900 rounded-lg">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">
                      Creatividad: {temperature}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={temperature}
                      onChange={(e) =>
                        setTemperature(parseFloat(e.target.value))
                      }
                      className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">
                      Semilla (opcional)
                    </label>
                    <input
                      type="number"
                      value={seed || ""}
                      onChange={(e) =>
                        setSeed(
                          e.target.value ? parseInt(e.target.value) : null,
                        )
                      }
                      placeholder="Aleatorio"
                      className="w-full h-7 px-2 bg-gray-800 border border-gray-700 rounded text-xs text-gray-100"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer con navegación */}
        <div className="p-3 border-t border-gray-800 space-y-2">
          {/* Botones de navegación */}
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Atrás
              </Button>
            )}
            {currentStep < TOTAL_STEPS ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex-1"
              >
                Siguiente <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleGenerate}
                disabled={
                  isGenerating ||
                  !currentPrompt.trim() ||
                  designConfig.positions.length === 0
                }
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2" />{" "}
                    Generando...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" /> Generar Diseño
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Limpiar sesión */}
          <button
            onClick={() => setShowClearConfirm(!showClearConfirm)}
            className="w-full text-xs text-gray-500 hover:text-red-400 flex items-center justify-center py-1"
          >
            <RotateCcw className="h-3 w-3 mr-1" /> Reiniciar configuración
          </button>
          {showClearConfirm && (
            <div className="p-2 bg-red-900/20 border border-red-800 rounded-lg">
              <p className="text-xs text-gray-300 mb-2">¿Reiniciar todo?</p>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleClearSession}
                  className="flex-1 text-xs"
                >
                  Sí
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 text-xs"
                >
                  No
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <PromptHints open={showHintsModal} onOpenChange={setShowHintsModal} />
      <StoreProductModal
        open={showStoreModal}
        onOpenChange={setShowStoreModal}
        onSelectImage={handleStoreImageSelect}
      />
    </>
  );
};
