import { useState } from 'react';
import { ShoppingCart, Package } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size: string) => void;
  onBuyNow: (product: Product, size: string) => void;
}

export function ProductCard({ product, onAddToCart, onBuyNow }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);

  const handleAddToCart = () => {
    if (selectedSize) {
      onAddToCart(product, selectedSize);
    }
  };

  const handleBuyNow = () => {
    if (selectedSize) {
      onBuyNow(product, selectedSize);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="relative h-64 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        <Package className="w-24 h-24 text-slate-400" />
        {product.stock < 5 && product.stock > 0 && (
          <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            Solo {product.stock} disponibles
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            Agotado
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
        <div className="flex items-center justify-between mb-4">
          <span className="text-3xl font-extrabold text-emerald-600">${product.price}</span>
          <span className="text-sm text-gray-500">{product.stock} en stock</span>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Talla
          </label>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            disabled={product.stock === 0}
          >
            {product.sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-slate-800 text-white py-3 rounded-lg font-semibold hover:bg-slate-900 transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-5 h-5" />
            Agregar al Carrito
          </button>

          <button
            onClick={handleBuyNow}
            disabled={product.stock === 0}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Comprar Ahora
          </button>
        </div>
      </div>
    </div>
  );
}
