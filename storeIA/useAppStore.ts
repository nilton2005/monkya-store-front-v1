import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { BrushStroke, Edit, Generation, Project } from "../types";

// Safe storage for SSR - only uses localStorage on the client
const safeStorage = {
  getItem: (name: string) => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(name, value);
    } catch {
      // Ignore quota errors
    }
  },
  removeItem: (name: string) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(name);
    } catch {
      // Ignore errors
    }
  },
};

// Tipos para configuración de producto
export type ProductType = "polo" | "polera";
export type ProductColor = "verde-petroleo" | "negro" | "rojo" | "blanco";
export type NeckType = "v" | "circular";
export type MaterialType = "algodon-100" | "pima";
export type SleeveType = "manga-corta" | "manga-larga";
export type HoodType = "con-gorro" | "sin-gorro";
export type DesignPosition =
  | "espalda-superior"
  | "espalda-centro"
  | "espalda-inferior"
  | "espalda-completo"
  | "frente-superior"
  | "frente-centro"
  | "frente-inferior"
  | "frente-completo"
  | "hombro-izquierdo"
  | "hombro-derecho";

export interface ProductConfig {
  type: ProductType;
  color: ProductColor;
  neckType: NeckType;
  material: MaterialType;
  sleeveType: SleeveType;
  hoodType: HoodType;
}

export interface DesignConfig {
  style: string;
  positions: DesignPosition[];
  sameDesignForAll: boolean; // Si tiene múltiples posiciones, ¿usar el mismo diseño?
}

interface AppState {
  // Current project
  currentProject: Project | null;

  // Canvas state
  canvasImage: string | null;
  canvasZoom: number;
  canvasPan: { x: number; y: number };

  // Upload state
  uploadedImages: string[];
  editReferenceImages: string[];

  // Brush strokes for painting masks
  brushStrokes: BrushStroke[];
  brushSize: number;
  showMasks: boolean;

  // Generation state
  isGenerating: boolean;
  currentPrompt: string;
  temperature: number;
  seed: number | null;

  // History and variants
  selectedGenerationId: string | null;
  selectedEditId: string | null;
  showHistory: boolean;

  // Panel visibility
  showPromptPanel: boolean;

  // UI state
  selectedTool: "generate" | "edit" | "mask";

  // Product configuration
  productConfig: ProductConfig;
  designConfig: DesignConfig;

  // Actions for product config
  setProductConfig: (config: Partial<ProductConfig>) => void;
  setDesignConfig: (config: Partial<DesignConfig>) => void;
  toggleDesignPosition: (position: DesignPosition) => void;
  resetProductConfig: () => void;

  // Actions
  setCurrentProject: (project: Project | null) => void;
  setCanvasImage: (url: string | null) => void;
  setCanvasZoom: (zoom: number) => void;
  setCanvasPan: (pan: { x: number; y: number }) => void;

  addUploadedImage: (url: string) => void;
  removeUploadedImage: (index: number) => void;
  clearUploadedImages: () => void;

  addEditReferenceImage: (url: string) => void;
  removeEditReferenceImage: (index: number) => void;
  clearEditReferenceImages: () => void;

  addBrushStroke: (stroke: BrushStroke) => void;
  clearBrushStrokes: () => void;
  setBrushSize: (size: number) => void;
  setShowMasks: (show: boolean) => void;

  setIsGenerating: (generating: boolean) => void;
  setCurrentPrompt: (prompt: string) => void;
  setTemperature: (temp: number) => void;
  setSeed: (seed: number | null) => void;

  addGeneration: (generation: Generation) => void;
  addEdit: (edit: Edit) => void;
  selectGeneration: (id: string | null) => void;
  selectEdit: (id: string | null) => void;
  setShowHistory: (show: boolean) => void;

  setShowPromptPanel: (show: boolean) => void;

  setSelectedTool: (tool: "generate" | "edit" | "mask") => void;

  finalProductImage: string | null;
  finalProductTitle: string | null;
  setFinalProductImage: (url: string | null) => void;
  setFinalProductTitle: (title: string | null) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        currentProject: null,
        canvasImage: null,
        canvasZoom: 1,
        canvasPan: { x: 0, y: 0 },

        uploadedImages: [],
        editReferenceImages: [],

        brushStrokes: [],
        brushSize: 20,
        showMasks: true,

        isGenerating: false,
        currentPrompt: "",
        temperature: 0.7,
        seed: null,

        selectedGenerationId: null,
        selectedEditId: null,
        showHistory: true,

        showPromptPanel: true,

        selectedTool: "generate",

        finalProductImage: null,
        finalProductTitle: null,

        // Product configuration defaults
        productConfig: {
          type: "polo",
          color: "blanco",
          neckType: "circular",
          material: "algodon-100",
          sleeveType: "manga-corta",
          hoodType: "sin-gorro",
        },
        designConfig: {
          style: "custom",
          positions: ["frente-centro"],
          sameDesignForAll: true,
        },

        // Actions
        setCurrentProject: (project) => set({ currentProject: project }),
        setCanvasImage: (url) => set({ canvasImage: url }),
        setCanvasZoom: (zoom) => set({ canvasZoom: zoom }),
        setCanvasPan: (pan) => set({ canvasPan: pan }),

        addUploadedImage: (url) =>
          set((state) => ({
            uploadedImages: [...state.uploadedImages, url],
          })),
        removeUploadedImage: (index) =>
          set((state) => ({
            uploadedImages: state.uploadedImages.filter((_, i) => i !== index),
          })),
        clearUploadedImages: () => set({ uploadedImages: [] }),

        addEditReferenceImage: (url) =>
          set((state) => ({
            editReferenceImages: [...state.editReferenceImages, url],
          })),
        removeEditReferenceImage: (index) =>
          set((state) => ({
            editReferenceImages: state.editReferenceImages.filter(
              (_, i) => i !== index,
            ),
          })),
        clearEditReferenceImages: () => set({ editReferenceImages: [] }),

        addBrushStroke: (stroke) =>
          set((state) => ({
            brushStrokes: [...state.brushStrokes, stroke],
          })),
        clearBrushStrokes: () => set({ brushStrokes: [] }),
        setBrushSize: (size) => set({ brushSize: size }),
        setShowMasks: (show) => set({ showMasks: show }),

        setIsGenerating: (generating) => set({ isGenerating: generating }),
        setCurrentPrompt: (prompt) => set({ currentPrompt: prompt }),
        setTemperature: (temp) => set({ temperature: temp }),
        setSeed: (seed) => set({ seed: seed }),

        addGeneration: (generation) =>
          set((state) => ({
            currentProject: state.currentProject
              ? {
                  ...state.currentProject,
                  generations: [
                    ...state.currentProject.generations,
                    generation,
                  ],
                  updatedAt: Date.now(),
                }
              : null,
          })),

        addEdit: (edit) =>
          set((state) => ({
            currentProject: state.currentProject
              ? {
                  ...state.currentProject,
                  edits: [...state.currentProject.edits, edit],
                  updatedAt: Date.now(),
                }
              : null,
          })),

        selectGeneration: (id) => set({ selectedGenerationId: id }),
        selectEdit: (id) => set({ selectedEditId: id }),
        setShowHistory: (show) => set({ showHistory: show }),

        setShowPromptPanel: (show) => set({ showPromptPanel: show }),

        setSelectedTool: (tool) => set({ selectedTool: tool }),

        setFinalProductImage: (url) => set({ finalProductImage: url }),
        setFinalProductTitle: (title) => set({ finalProductTitle: title }),

        // Product config actions
        setProductConfig: (config) =>
          set((state) => {
            const newConfig = { ...state.productConfig, ...config };
            // Auto-set material to algodon-100 when switching to polera (pima is polo-only)
            if (config.type === "polera" && state.productConfig.material === "pima") {
              newConfig.material = "algodon-100";
            }
            return { productConfig: newConfig };
          }),
        setDesignConfig: (config) =>
          set((state) => ({
            designConfig: { ...state.designConfig, ...config },
          })),
        toggleDesignPosition: (position) =>
          set((state) => {
            const positions = state.designConfig.positions;
            const exists = positions.includes(position);
            const newPositions = exists
              ? positions.filter((p) => p !== position)
              : positions.length < 3
                ? [...positions, position]
                : positions;
            return {
              designConfig: { ...state.designConfig, positions: newPositions },
            };
          }),
        resetProductConfig: () =>
          set({
            productConfig: {
              type: "polo",
              color: "blanco",
              neckType: "circular",
              material: "algodon-100",
              sleeveType: "manga-corta",
              hoodType: "sin-gorro",
            },
            designConfig: {
              style: "custom",
              positions: ["frente-centro"],
              sameDesignForAll: true,
            },
          }),
      }),
      {
        name: "nano-banana-storage",
        storage: createJSONStorage(() => safeStorage),
        partialize: (state) => ({
          // Only persist the final product data needed for the cart/checkout flow
          // We avoid persisting the entire project history (currentProject) or the canvas state
          // because base64 images can easily exceed the 5MB localStorage quota.
          finalProductImage: state.finalProductImage,
          finalProductTitle: state.finalProductTitle,
        }),
      },
    ),
    { name: "nano-banana-store" },
  ),
);
