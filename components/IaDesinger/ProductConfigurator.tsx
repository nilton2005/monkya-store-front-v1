import React from 'react';
import { useAppStore, ProductColor, ProductType, NeckType, MaterialType } from 'storeIA/useAppStore';
import { cn } from '../../utils/cn';
import { Shirt } from 'lucide-react';

const PRODUCT_TYPES: { value: ProductType; label: string; icon: string }[] = [
  { value: 'polo', label: 'Polo', icon: '👕' },
  { value: 'polera', label: 'Polera', icon: '🧥' },
];

const COLORS: { value: ProductColor; label: string; hex: string; textColor: string }[] = [
  { value: 'blanco', label: 'Blanco', hex: '#FFFFFF', textColor: 'text-gray-800' },
  { value: 'negro', label: 'Negro', hex: '#1a1a1a', textColor: 'text-white' },
  { value: 'verde-petroleo', label: 'Verde Petróleo', hex: '#006D6F', textColor: 'text-white' },
  { value: 'rojo', label: 'Rojo', hex: '#DC2626', textColor: 'text-white' },
];

const NECK_TYPES: { value: NeckType; label: string; description: string }[] = [
  { value: 'circular', label: 'Circular', description: 'Cuello redondo clásico' },
  { value: 'v', label: 'Cuello V', description: 'Cuello en forma de V' },
];

const MATERIALS: { value: MaterialType; label: string; description: string }[] = [
  { value: 'algodon-100', label: 'Algodón 100%', description: 'Suave y transpirable' },
  { value: 'pima', label: 'Algodón Pima', description: 'Premium, extra suave' },
];

export const ProductConfigurator: React.FC = () => {
  const { productConfig, setProductConfig } = useAppStore();

  return (
    <div className="space-y-4">
      {/* Tipo de Producto */}
      <div>
        <label className="text-sm font-medium text-gray-300 mb-2 block">
          Tipo de Prenda
        </label>
        <div className="grid grid-cols-2 gap-2">
          {PRODUCT_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => setProductConfig({ type: type.value })}
              className={cn(
                'flex items-center justify-center gap-2 p-3 rounded-lg border transition-all duration-200',
                productConfig.type === type.value
                  ? 'bg-yellow-400/10 border-yellow-400/50 text-yellow-400'
                  : 'bg-gray-900 border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-gray-300'
              )}
            >
              <span className="text-xl">{type.icon}</span>
              <span className="text-sm font-medium">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="text-sm font-medium text-gray-300 mb-2 block">
          Color
        </label>
        <div className="grid grid-cols-4 gap-2">
          {COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => setProductConfig({ color: color.value })}
              className={cn(
                'relative flex flex-col items-center p-2 rounded-lg border transition-all duration-200',
                productConfig.color === color.value
                  ? 'border-yellow-400 ring-2 ring-yellow-400/30'
                  : 'border-gray-700 hover:border-gray-500'
              )}
            >
              <div
                className="w-8 h-8 rounded-full border-2 border-gray-600 mb-1"
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-xs text-gray-400">{color.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tipo de Cuello */}
      <div>
        <label className="text-sm font-medium text-gray-300 mb-2 block">
          Tipo de Cuello
        </label>
        <div className="grid grid-cols-2 gap-2">
          {NECK_TYPES.map((neck) => (
            <button
              key={neck.value}
              onClick={() => setProductConfig({ neckType: neck.value })}
              className={cn(
                'flex flex-col items-start p-3 rounded-lg border transition-all duration-200 text-left',
                productConfig.neckType === neck.value
                  ? 'bg-yellow-400/10 border-yellow-400/50'
                  : 'bg-gray-900 border-gray-700 hover:bg-gray-800'
              )}
            >
              <span className={cn(
                'text-sm font-medium',
                productConfig.neckType === neck.value ? 'text-yellow-400' : 'text-gray-300'
              )}>
                {neck.label}
              </span>
              <span className="text-xs text-gray-500">{neck.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Material */}
      <div>
        <label className="text-sm font-medium text-gray-300 mb-2 block">
          Material
        </label>
        <div className="grid grid-cols-2 gap-2">
          {MATERIALS.map((material) => (
            <button
              key={material.value}
              onClick={() => setProductConfig({ material: material.value })}
              className={cn(
                'flex flex-col items-start p-3 rounded-lg border transition-all duration-200 text-left',
                productConfig.material === material.value
                  ? 'bg-yellow-400/10 border-yellow-400/50'
                  : 'bg-gray-900 border-gray-700 hover:bg-gray-800'
              )}
            >
              <span className={cn(
                'text-sm font-medium',
                productConfig.material === material.value ? 'text-yellow-400' : 'text-gray-300'
              )}>
                {material.label}
              </span>
              <span className="text-xs text-gray-500">{material.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
