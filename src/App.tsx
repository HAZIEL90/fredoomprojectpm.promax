import { useState, useEffect } from 'react';
import { ShoppingCart as CartIcon, Menu, X, Instagram, Facebook, Sparkles } from 'lucide-react';
import { supabase } from './lib/supabase';
import { Product, CartItem } from './types';
import { ProductCard } from './components/ProductCard';
import { ShoppingCart } from './components/ShoppingCart';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('category', { ascending: true });

    if (error) {
      console.error('Error fetching products:', error);
    } else if (data) {
      setProducts(data);
    }
  }

  const addToCart = (product: Product, size: string) => {
    const existingItemIndex = cart.findIndex(
      (item) => item.product.id === product.id && item.size === size
    );

    if (existingItemIndex >= 0) {
      const newCart = [...cart];
      newCart[existingItemIndex].quantity += 1;
      setCart(newCart);
    } else {
      setCart([...cart, { product, size, quantity: 1 }]);
    }
  };

  const buyNow = (product: Product, size: string) => {
    const message = `Hola! Quiero comprar:\n\n📦 Producto: ${product.name}\n💰 Precio: $${product.price}\n📏 Talla: ${size}\n\n¿Está disponible?`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const updateQuantity = (index: number, quantity: number) => {
    const newCart = [...cart];
    newCart[index].quantity = quantity;
    setCart(newCart);
  };

  const checkout = () => {
    let message = '¡Hola! Quiero hacer el siguiente pedido:\n\n';

    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.product.name}\n`;
      message += `   Talla: ${item.size}\n`;
      message += `   Cantidad: ${item.quantity}\n`;
      message += `   Precio: $${item.product.price * item.quantity}\n\n`;
    });

    const total = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    message += `💵 TOTAL: $${total}\n\n`;
    message += '¿Está todo disponible?';

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const categories = [
    { id: 'all', name: 'Todo' },
    { id: 'sneakers', name: 'Zapatillas' },
    { id: 'men', name: 'Ropa Hombre' },
    { id: 'women', name: 'Ropa Mujer' },
    { id: 'caps', name: 'Gorras' },
  ];

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <header className="sticky top-0 z-30 bg-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-emerald-600" />
              <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-slate-800 to-emerald-600 bg-clip-text text-transparent">
                Freedom Projet PM
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative bg-emerald-600 text-white p-3 rounded-full hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl"
              >
                <CartIcon className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-gray-700"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-slate-500 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Sneaker & Streetwear Store
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-gray-300">
              Las mejores marcas al mejor precio. Estilo urbano que define tu personalidad.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <span className="font-semibold">Envío a todo el país</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <span className="font-semibold">Stock actualizado</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <span className="font-semibold">Calidad garantizada</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <nav className="bg-white shadow-md sticky top-[72px] z-20">
        <div className="container mx-auto px-4">
          <div className={`${isMenuOpen ? 'block' : 'hidden'} md:block`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-2 md:gap-4 py-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setIsMenuOpen(false);
                  }}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    selectedCategory === category.id
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-2">
            {categories.find((c) => c.id === selectedCategory)?.name}
          </h3>
          <p className="text-gray-600">
            {filteredProducts.length} productos disponibles
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
              onBuyNow={buyNow}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400">No hay productos en esta categoría</p>
          </div>
        )}
      </main>

      <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h4 className="text-3xl font-bold mb-4">Síguenos en redes sociales</h4>
            <p className="text-gray-300 mb-6">
              Mantente al día con nuestras últimas colecciones y ofertas exclusivas
            </p>
            <div className="flex justify-center gap-6">
              <a
                href="https://www.instagram.com/freedom_project_pm/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-gradient-to-r from-pink-500 to-orange-500 px-8 py-4 rounded-xl font-semibold hover:from-pink-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-2xl transform hover:scale-105"
              >
                <Instagram className="w-6 h-6" />
                Instagram
              </a>
              <a
                href="https://www.facebook.com/Fredoomproject2025/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-2xl transform hover:scale-105"
              >
                <Facebook className="w-6 h-6" />
                Facebook
              </a>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-gray-300">
              &copy; 2024 Freedom Projet PM. Todos los derechos reservados.
            </p>
            <p className="text-gray-400 mt-2">
              Sneaker & Streetwear Store - Estilo que inspira
            </p>
          </div>
        </div>
      </footer>

      <ShoppingCart
        cart={cart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onCheckout={checkout}
      />
    </div>
  );
}

export default App;
