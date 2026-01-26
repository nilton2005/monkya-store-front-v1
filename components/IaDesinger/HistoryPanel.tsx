import { History, Image as ImageIcon, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { startTransition } from "react";
import { useAppStore } from "storeIA/useAppStore";
import { cn } from "utils/cn";
import { ImagePreviewModal } from "./ImagePreviewModal";
import { Button } from "./ui/Button";

export const HistoryPanel: React.FC = () => {
  const router = useRouter();
  const {
    currentProject,
    canvasImage,
    selectedGenerationId,
    selectedEditId,
    selectGeneration,
    selectEdit,
    showHistory,
    setShowHistory,
    setCanvasImage,
    selectedTool,
    setFinalProductImage,
    setFinalProductTitle,
    currentPrompt,
  } = useAppStore();

  const [previewModal, setPreviewModal] = React.useState<{
    open: boolean;
    imageUrl: string;
    title: string;
    description?: string;
  }>({
    open: false,
    imageUrl: "",
    title: "",
    description: "",
  });

  const handleBuy = () => {
    if (canvasImage) {
      try {
        // 1. Guardamos la imagen generada en el Store Global
        setFinalProductImage(canvasImage);

        // 2. Guardamos el título genérico para productos IA
        const title = "Producto diseñado con IA";
        setFinalProductTitle(title);

        // 3. Navegamos al producto "Base" (Template)
        // Usamos startTransition para evitar conflictos con el estado de Next.js
        startTransition(() => {
          // Usamos 'ia-generated-camiseta' que es el handle correcto para el producto generado por IA
          router.push("/product/ia-generated-camiseta");
        });
      } catch (error) {
        console.error("Error al procesar la compra:", error);
        alert(
          "Hubo un error al guardar tu diseño. Por favor intenta de nuevo o usa una imagen más pequeña.",
        );
      }
    } else {
      alert("Primero genera o edita una imagen");
    }
  };

  const generations = currentProject?.generations || [];
  const edits = currentProject?.edits || [];

  // Get current image dimensions
  const [imageDimensions, setImageDimensions] = React.useState<{
    width: number;
    height: number;
  } | null>(null);

  React.useEffect(() => {
    if (canvasImage) {
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
      img.src = canvasImage;
    } else {
      setImageDimensions(null);
    }
  }, [canvasImage]);

  if (!showHistory) {
    return (
      <div className="w-8 bg-gray-950 border-l border-gray-800 flex flex-col items-center justify-center">
        <button
          onClick={() => setShowHistory(true)}
          className="w-6 h-16 bg-gray-800 hover:bg-gray-700 rounded-l-lg border border-r-0 border-gray-700 flex items-center justify-center transition-colors group"
          title="Mostrar Panel de Historial"
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

  return (
    <div className="w-64 md:w-72 lg:w-80 bg-gray-950 border-l border-gray-800 p-3 md:p-4 lg:p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 md:mb-6">
        <div className="flex items-center space-x-2">
          <History className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
          <h3 className="text-xs md:text-sm font-medium text-gray-300">
            Historial
          </h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowHistory(!showHistory)}
          className="h-6 w-6"
          title="Ocultar Panel de Historial"
        >
          ×
        </Button>
      </div>

      {/* Variants Grid */}
      <div className="mb-3 md:mb-6 flex-shrink-0">
        <h4 className="text-xs font-medium text-gray-400 mb-2 md:mb-3">
          Variantes
        </h4>
        {generations.length === 0 && edits.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🖼️</div>
            <p className="text-sm text-gray-500">Aún no hay generaciones</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {/* Show generations */}
            {generations.slice(-2).map((generation, index) => (
              <div
                key={generation.id}
                className={cn(
                  "relative aspect-square rounded-lg border-2 cursor-pointer transition-all duration-200 overflow-hidden",
                  selectedGenerationId === generation.id
                    ? "border-yellow-400"
                    : "border-gray-700 hover:border-gray-600",
                )}
                onClick={() => {
                  selectGeneration(generation.id);
                  if (generation.outputAssets[0]) {
                    setCanvasImage(generation.outputAssets[0].url);
                  }
                }}
              >
                {generation.outputAssets[0] ? (
                  <>
                    <img
                      src={generation.outputAssets[0].url}
                      alt="Variante generada"
                      className="w-full h-full object-cover"
                    />
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400" />
                  </div>
                )}

                {/* Variant Number */}
                <div className="absolute top-2 left-2 bg-gray-900/80 text-xs px-2 py-1 rounded">
                  #{index + 1}
                </div>
              </div>
            ))}

            {/* Show edits */}
            {edits.slice(-2).map((edit, index) => (
              <div
                key={edit.id}
                className={cn(
                  "relative aspect-square rounded-lg border-2 cursor-pointer transition-all duration-200 overflow-hidden",
                  selectedEditId === edit.id
                    ? "border-yellow-400"
                    : "border-gray-700 hover:border-gray-600",
                )}
                onClick={() => {
                  if (edit.outputAssets[0]) {
                    setCanvasImage(edit.outputAssets[0].url);
                    selectEdit(edit.id);
                    selectGeneration(null);
                  }
                }}
              >
                {edit.outputAssets[0] ? (
                  <img
                    src={edit.outputAssets[0].url}
                    alt="Variante editada"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400" />
                  </div>
                )}

                {/* Etiqueta de Edición */}
                <div className="absolute top-2 left-2 bg-purple-900/80 text-xs px-2 py-1 rounded">
                  Edición #{index + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Información de Imagen Actual */}
      {(canvasImage || imageDimensions) && (
        <div className="mb-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
          <h4 className="text-xs font-medium text-gray-400 mb-2">
            Imagen Actual
          </h4>
          <div className="space-y-1 text-xs text-gray-500">
            {imageDimensions && (
              <div className="flex justify-between">
                <span>Dimensiones:</span>
                <span className="text-gray-300">
                  {imageDimensions.width} × {imageDimensions.height}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Modo:</span>
              <span className="text-gray-300 capitalize">{selectedTool}</span>
            </div>
          </div>
        </div>
      )}

      {/* Generation Details - Altura reducida para que el botón Comprar sea visible */}
      <div className="mb-4 p-3 bg-gray-900 rounded-lg border border-gray-700 overflow-y-auto max-h-40">
        <h4 className="text-xs font-medium text-gray-400 mb-2">
          Detalles de Generación
        </h4>
        {(() => {
          const gen = generations.find((g) => g.id === selectedGenerationId);
          const selectedEdit = edits.find((e) => e.id === selectedEditId);

          if (gen) {
            return (
              <div className="space-y-3">
                <div className="space-y-2 text-xs text-gray-500">
                  <div>
                    <span className="text-gray-400">Prompt:</span>
                    <p className="text-gray-300 mt-1">{gen.prompt}</p>
                  </div>
                  <div className="flex justify-between">
                    <span>Modelo:</span>
                    <span>{gen.modelVersion}</span>
                  </div>
                  {gen.parameters.seed && (
                    <div className="flex justify-between">
                      <span>Semilla:</span>
                      <span>{gen.parameters.seed}</span>
                    </div>
                  )}
                </div>

                {/* Imágenes de Referencia */}
                {gen.sourceAssets.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-gray-400 mb-2">
                      Imágenes de Referencia
                    </h5>
                    <div className="grid grid-cols-2 gap-2">
                      {gen.sourceAssets.map((asset, index) => (
                        <button
                          key={asset.id}
                          onClick={() =>
                            setPreviewModal({
                              open: true,
                              imageUrl: asset.url,
                              title: `Imagen de Referencia ${index + 1}`,
                              description:
                                "Esta imagen de referencia fue usada para guiar la generación",
                            })
                          }
                          className="relative aspect-square rounded border border-gray-700 hover:border-gray-600 transition-colors overflow-hidden group"
                        >
                          <img
                            src={asset.url}
                            alt={`Referencia ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <ImageIcon className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="absolute bottom-1 left-1 bg-gray-900/80 text-xs px-1 py-0.5 rounded text-gray-300">
                            Ref {index + 1}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          } else if (selectedEdit) {
            const parentGen = generations.find(
              (g) => g.id === selectedEdit.parentGenerationId,
            );
            return (
              <div className="space-y-3">
                <div className="space-y-2 text-xs text-gray-500">
                  <div>
                    <span className="text-gray-400">
                      Instrucción de Edición:
                    </span>
                    <p className="text-gray-300 mt-1">
                      {selectedEdit.instruction}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <span>Tipo:</span>
                    <span>Edición de Imagen</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Creado:</span>
                    <span>
                      {new Date(selectedEdit.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  {selectedEdit.maskAssetId && (
                    <div className="flex justify-between">
                      <span>Máscara:</span>
                      <span className="text-purple-400">Aplicada</span>
                    </div>
                  )}
                </div>

                {/* Referencia de Generación Original */}
                {parentGen && (
                  <div>
                    <h5 className="text-xs font-medium text-gray-400 mb-2">
                      Imagen Original
                    </h5>
                    <button
                      onClick={() =>
                        setPreviewModal({
                          open: true,
                          imageUrl: parentGen.outputAssets[0]?.url || "",
                          title: "Imagen Original",
                          description: "La imagen base que fue editada",
                        })
                      }
                      className="relative aspect-square w-16 rounded border border-gray-700 hover:border-gray-600 transition-colors overflow-hidden group"
                    >
                      <img
                        src={parentGen.outputAssets[0]?.url}
                        alt="Original"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <ImageIcon className="h-3 w-3 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  </div>
                )}

                {/* Visualización de Máscara */}
                {selectedEdit.maskReferenceAsset && (
                  <div>
                    <h5 className="text-xs font-medium text-gray-400 mb-2">
                      Referencia con Máscara
                    </h5>
                    <button
                      onClick={() =>
                        setPreviewModal({
                          open: true,
                          imageUrl: selectedEdit.maskReferenceAsset!.url,
                          title: "Imagen de Referencia con Máscara",
                          description:
                            "Esta imagen con superposición de máscara fue enviada al modelo de IA para guiar la edición",
                        })
                      }
                      className="relative aspect-square w-16 rounded border border-gray-700 hover:border-gray-600 transition-colors overflow-hidden group"
                    >
                      <img
                        src={selectedEdit.maskReferenceAsset.url}
                        alt="Referencia con máscara"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <ImageIcon className="h-3 w-3 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="absolute bottom-1 left-1 bg-purple-900/80 text-xs px-1 py-0.5 rounded text-purple-300">
                        Máscara
                      </div>
                    </button>
                  </div>
                )}
              </div>
            );
          } else {
            return (
              <div className="space-y-2 text-xs text-gray-500">
                <p className="text-gray-400">
                  Selecciona una generación o edición para ver detalles
                </p>
              </div>
            );
          }
        })()}
      </div>

      {/* Actions - Botón siempre visible */}
      <div className="mt-auto pt-3 flex-shrink-0 border-t border-gray-800">
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-blue-600 hover:bg-blue-700 py-4 md:py-6 text-sm md:text-base font-semibold shadow-lg"
          onClick={handleBuy}
          disabled={
            !selectedGenerationId && !useAppStore.getState().canvasImage
          }
        >
          <ShoppingBag className="h-4 w-4 md:h-5 md:w-5 mr-2" />
          <span>Comprar</span>
        </Button>
      </div>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        open={previewModal.open}
        onOpenChange={(open) => setPreviewModal((prev) => ({ ...prev, open }))}
        imageUrl={previewModal.imageUrl}
        title={previewModal.title}
        description={previewModal.description}
      />
    </div>
  );
};
