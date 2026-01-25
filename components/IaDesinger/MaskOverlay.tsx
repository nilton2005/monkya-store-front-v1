import React from 'react';
import { useAppStore } from 'storeIA/useAppStore';


export const MaskOverlay: React.FC = () => {
  const { showMasks } = useAppStore();

  // TODO: Re-implement mask overlay when selectedMask is added back to store
  if (!showMasks) return null;

  return null;
};