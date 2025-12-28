import * as Dialog from '@radix-ui/react-dialog';
import { Check, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Button } from './ui/Button';

interface Product {
  id: string;
  handle: string;
  title: string;
  featuredImage: {
    url: string;
    altText: string;
  };
}

interface StoreProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectImage: (imageUrl: string) => void;
}

export const StoreProductModal: React.FC<StoreProductModalProps> = ({
  open,
  onOpenChange,
  onSelectImage,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchProducts();
    }
  }, [open]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const productsData = await response.json();
      setProducts(productsData);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleConfirmSelection = () => {
    if (selectedImage) {
      onSelectImage(selectedImage);
      onOpenChange(false);
      setSelectedImage(null);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-4xl max-h-[85vh] bg-gray-900 rounded-lg shadow-2xl border border-gray-800 overflow-hidden flex flex-col z-50">
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div>
              <Dialog.Title className="text-xl font-bold text-white">
                Escoger de la tienda
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-400 mt-1">
                Selecciona un diseño de la tienda como referencia
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-400">Cargando productos...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelectImage(product.featuredImage.url)}
                    className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === product.featuredImage.url
                        ? 'border-blue-500 ring-2 ring-blue-500/50'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="aspect-square relative">
                      <img
                        src={product.featuredImage.url}
                        alt={product.featuredImage.altText}
                        className="w-full h-full object-cover"
                      />
                      {selectedImage === product.featuredImage.url && (
                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                          <div className="bg-blue-500 rounded-full p-2">
                            <Check className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-2 bg-gray-800/90 backdrop-blur">
                      <p className="text-xs text-gray-300 truncate">{product.title}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-800">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmSelection}
              disabled={!selectedImage}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Usar imagen seleccionada
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
