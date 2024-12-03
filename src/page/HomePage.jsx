import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, X, Search, User, Eye, EyeOff , Lock } from 'lucide-react';
import { AdminPage } from './AdminPage';
import { useProductStore } from '../stores/useProductStore';
import { Toaster } from "react-hot-toast";
import toast from 'react-hot-toast';
import AuthModal from '../components/AuthModale';
import { useUserStore } from '../stores/useUserStore';
import { useCartStore } from '../stores/useCartStore';
import { UserPage } from './UserPage';
import HorizontalScroll from '../components/HorizontalScroll';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { CartDrawer } from '../components/CartDrawer';
import { Header } from '../components/Header';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Facebook, 
  Instagram, 
  Twitter,
  Youtube,
  Shield,
  HeartHandshake 
} from 'lucide-react';


const NarutoShop = () => {
  // États de base
  const [isCartOpen, setIsCartOpen] = useState(false);
  // const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const [moreText, setMoreText] = useState(false);
  
  // États d'authentification
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  const { products, fetchAllProduct, loading } = useProductStore();
  const {checkingAuth ,checkAuth , user } = useUserStore();


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Effet pour charger les produits
  useEffect(() => {
    fetchAllProduct();
  }, [fetchAllProduct]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Effet pour vérifier l'authentification au chargement
  useEffect(() => {
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      setIsLoggedIn(true);
      const userData = JSON.parse(savedAuth);
      setAuthData(prevData => ({
        ...prevData,
        email: userData.email,
        name: userData.name
      }));
    }
  }, []);

  // Gestionnaire de validation du formulaire
  const validateForm = () => {
    if (!authData.email || !authData.password) {
      toast.error('Please fill in all required fields');
      return false;
    }

    if (!authData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (authData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }

    if (isSignUpMode && authData.password !== authData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    return true;
  };

  const {getCartItems, addToCart , removeFromCart , updateQuantity , cart } = useCartStore();


  useEffect(() => {
    getCartItems();
  }, [getCartItems]);

  // Gestionnaire de connexion
  const handleAuth = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      // Simulation d'une requête d'authentification
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (rememberMe) {
        localStorage.setItem('auth', JSON.stringify({
          email: authData.email,
          name: authData.name || authData.email.split('@')[0]
        }));
      }

      setIsLoggedIn(true);
      setIsLoginModalOpen(false);
      toast.success(isSignUpMode ? 'Account created successfully!' : 'Welcome back!');
      
      // Reset form
      setAuthData({
        email: '',
        password: '',
        confirmPassword: '',
        name: ''
      });
    } catch (error) {
      toast.error('Authentication failed. Please try again.');
    }
  };

  // Gestionnaire de déconnexion
  const handleLogout = () => {
    // setIsLoggedIn(false);
    // localStorage.removeItem('auth');
    // toast.success('Logged out successfully');
if(user?.role === "admin"){
  setIsAdminModalOpen(!isAdminModalOpen)
}else{
  setIsUserModalOpen(!isUserModalOpen)
}
    
  };


 




  const filteredProducts = products.filter(product => {
    // Check if product and product.name exist
    if (!product || typeof product.name !== 'string') {
      console.warn('Invalid product found:', product);
      return false;
    }
    
    // Safe comparison with searchTerm
    return product.name.toLowerCase().includes(
      (searchTerm || '').toLowerCase()
    );
  });

  // Pagination logic
  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  
  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Logique de pagination
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if(loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Header setIsLoginModalOpen={setIsLoginModalOpen} handleLogout={handleLogout} setIsCartOpen={setIsCartOpen} />

        {/* Hero Section */}
        <div className="relative h-[80vh] container mx-auto">
          <img 
            src="/1686273830257.png" 
            alt="Naruto Banner"
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-4">Welcome to Anime Website</h1>
              <button 
                onClick={() => {
                  const productsSection = document.getElementById('products');
                  productsSection.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Description */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">
              Welcome to Anime Website T-Shirts!
            </h2>
            <p className="text-gray-600">
              Discover our unique collection of t-shirts inspired by your favorite anime! 
              Designed for true enthusiasts, our t-shirts offer modern style, comfort, 
              and exceptional quality. Whether you're a fan of timeless classics or 
              trending new anime, find your perfect match in our selection.
            </p>
          </div>

          <HorizontalScroll />
          

          {/* Products Section */}
          <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="products">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            All Products
          </h2>
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white shadow-sm"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <p className="text-lg text-gray-500">
              No products found matching your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 pb-14 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => (
              <>
              <ProductCard product={product}  onOpenModal={handleOpenModal} />

              {selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-10 z-50 flex items-center justify-center p-4">
                  <ProductModal
                    product={selectedProduct}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    
                  />
                </div>
                
              )}
              </>
             
            ))}
          </div>
        )}
      </div>
    </section>

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="flex justify-center items-center gap-4">
              <button 
                className="p-2 border rounded disabled:opacity-50 hover:bg-gray-100"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center
                      ${currentPage === index + 1 
                        ? 'bg-black text-white' 
                        : 'border hover:bg-gray-50'
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button 
                className="p-2 border rounded disabled:opacity-50 hover:bg-gray-100"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
          
        </main>

        {/* Footer */}
        <footer className="bg-white py-8 mt-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <img 
            src="/logo-anime.png" 
            alt="Naruto Banner"
            className="w-12 h-12 object-cover rounded-full"
          />
              {/* <div className="flex items-center gap-6">
                <a href="#" className="hover:text-gray-600 transition-colors">About</a>
                <a href="#" className="hover:text-gray-600 transition-colors">Contact</a>
                <a href="#" className="hover:text-gray-600 transition-colors">Terms</a>
                <a href="#" className="hover:text-gray-600 transition-colors">Privacy</a>
              </div> */}
              <div className="flex items-center gap-4">
                <button className="hover:bg-gray-100 p-2 rounded-full">
                  <Facebook size={22}  />
                </button>
                <button className="hover:bg-gray-100 p-2 rounded-full">
                   <Instagram size={22} />
                </button>
                <button className="hover:bg-gray-100 p-2 rounded-full">
                   <Twitter size={22} />
                </button>
              </div>
            </div>
            <div className="text-center mt-4 text-gray-600">
              <p>Copyright © {new Date().getFullYear()} Anime Website. All rights reserved.</p>
            </div>
          </div>
        </footer>

        {/* Cart Drawer */}
        <CartDrawer isCartOpen={isCartOpen}  setIsCartOpen={setIsCartOpen} />

        
        {/* Auth Modal */}
        {/* <AuthModal /> */}
        <AuthModal 
  isLoginModalOpen={isLoginModalOpen}
  setIsLoginModalOpen={setIsLoginModalOpen}
/>
<AdminPage setIsAdminModalOpen={setIsAdminModalOpen} isAdminModalOpen={isAdminModalOpen} />
<UserPage setIsUserModalOpen={setIsUserModalOpen} isUserModalOpen={isUserModalOpen} />
        
        {/* Overlay when cart is open */}
        {isCartOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsCartOpen(false)}
          />
        )}
      </div>
      {/* <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={!user ?  <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" /> } />
        <Route path="/secret-dashboard" element={user?.role === "admin" ? <AdminPage /> : <Navigate to="/login" /> } />
        <Route path="/category/:category" element={<CategotyPage />} />
        <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/" />} />
        <Route
						path='/purchase-success'
						element={user ? <PurchaseSuccessPage /> : <Navigate to='/login' />}
					/>
					<Route path='/purchase-cancel' element={user ? <PurchaseCancelPage /> : <Navigate to='/login' />} />
      </Routes> */}
      <Toaster />
     
    </>
  );
};

export default NarutoShop;