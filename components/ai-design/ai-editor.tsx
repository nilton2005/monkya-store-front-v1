"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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

  // Set mobile defaults on mount
  React.useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setShowPromptPanel(false);
        setShowHistory(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [setShowPromptPanel, setShowHistory]);

  return (
    <div className="h-full bg-gray-900 text-gray-100 flex flex-col font-sans">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <div
          className={cn(
            "flex-shrink-0 transition-all duration-300",
            !showPromptPanel && "w-8",
          )}
        >
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
