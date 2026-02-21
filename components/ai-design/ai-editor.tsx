"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Menu, ShoppingBag, X } from "lucide-react";
import React from "react";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { useAppStore } from "../../storeIA/useAppStore";
import { cn } from "../../utils/cn";
import { Header } from "../IaDesinger/Header";
import { HistoryPanel } from "../IaDesinger/HistoryPanel";
import { ImageCanvas } from "../IaDesinger/ImageCanvas";
import { PromptComposer } from "../IaDesinger/PromptComposer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    },
  },
});

function AIEditorContent() {
  useKeyboardShortcuts();

  const { showPromptPanel, setShowPromptPanel, showHistory, setShowHistory } =
    useAppStore();

  const [isMobile, setIsMobile] = React.useState(false);

  // Set mobile defaults on mount
  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setShowPromptPanel(false);
        setShowHistory(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [setShowPromptPanel, setShowHistory]);

  return (
    <div className="h-full bg-gray-900 text-gray-100 flex flex-col font-sans relative">
      <Header />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Panel izquierdo - Prompt Composer */}
        {/* En móvil: overlay absoluto. En desktop: lateral normal */}
        <div
          className={cn(
            "flex-shrink-0 transition-all duration-300 z-20",
            isMobile &&
              showPromptPanel &&
              "absolute inset-y-0 left-0 shadow-2xl",
            isMobile && !showPromptPanel && "hidden",
            !isMobile && !showPromptPanel && "w-8",
          )}
        >
          <PromptComposer />
        </div>

        {/* Overlay oscuro en móvil cuando hay panel abierto */}
        {isMobile && (showPromptPanel || showHistory) && (
          <div
            className="absolute inset-0 bg-black/50 z-10"
            onClick={() => {
              setShowPromptPanel(false);
              setShowHistory(false);
            }}
          />
        )}

        {/* Canvas central */}
        <div className="flex-1 min-w-0">
          <ImageCanvas />
        </div>

        {/* Panel derecho - History */}
        {/* En móvil: overlay absoluto. En desktop: lateral normal */}
        <div
          className={cn(
            "flex-shrink-0 transition-all duration-300 z-20",
            isMobile && showHistory && "absolute inset-y-0 right-0 shadow-2xl",
            isMobile && !showHistory && "hidden",
          )}
        >
          <HistoryPanel />
        </div>
      </div>

      {/* Botones flotantes para móvil */}
      {isMobile && (
        <div className="absolute bottom-24 left-0 right-0 flex justify-between px-4 z-30 pointer-events-none">
          {/* Botón para abrir Prompt - Monkya branded */}
          <button
            onClick={() => {
              setShowHistory(false);
              setShowPromptPanel(!showPromptPanel);
            }}
            className={cn(
              "pointer-events-auto flex items-center gap-2 rounded-full shadow-lg transition-all",
              showPromptPanel
                ? "bg-[#f2cd4e] text-[#272512] px-4 py-3"
                : "bg-[#f2cd4e] text-[#272512] px-4 py-3 animate-pulse",
            )}
          >
            {showPromptPanel ? (
              <X className="h-5 w-5" />
            ) : (
              <>
                <Menu className="h-5 w-5" />
                <span className="text-xs font-bold">Crear</span>
              </>
            )}
          </button>

          {/* Botón para abrir Historial/Comprar */}
          <button
            onClick={() => {
              setShowPromptPanel(false);
              setShowHistory(!showHistory);
            }}
            className={cn(
              "pointer-events-auto flex items-center gap-2 rounded-full shadow-lg transition-all px-4 py-3",
              showHistory
                ? "bg-[#f2cd4e] text-[#272512]"
                : "bg-green-600 text-white",
            )}
          >
            {showHistory ? (
              <X className="h-5 w-5" />
            ) : (
              <>
                <ShoppingBag className="h-5 w-5" />
                <span className="text-xs font-bold">Comprar</span>
              </>
            )}
          </button>
        </div>
      )}
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
