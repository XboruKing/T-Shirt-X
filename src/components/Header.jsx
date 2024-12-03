import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import { ShoppingCart, User, Lock } from 'lucide-react';

export const Header = ({ setIsLoginModalOpen , handleLogout , setIsCartOpen }) => {
    const { user } = useUserStore();
    const { cart } = useCartStore();
    const isAdmin = user?.role === "admin";
    return(
        <header className="bg-white/70 p-4 shadow-sm sticky top-0 z-40 backdrop-blur-sm">
          <div className="container mx-auto flex justify-between items-center">
          <img 
            src="/logo-anime.png" 
            alt="Naruto Banner"
            className="w-12 h-12 object-cover rounded-full"
          />
            {/* <span className="font-bold text-xl">Logo</span> */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => user ? handleLogout() : setIsLoginModalOpen(true)}
                className="relative p-2 flex items-center gap-2 hover:bg-gray-100 rounded-full"
              >  {!user?(
                <User className="w-6 h-6" />
              ):(
                <>
                {isAdmin && (
                            <p
                            className='bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium
                             transition duration-300 ease-in-out flex items-center'
                        >
                            <Lock className='inline-block mr-1' size={18} />
                            <span className='hidden sm:inline'>Dashboard</span>
                        </p>
                        )}
                {!isAdmin && (
                           user?.image?(
                            <div className=' h-10 w-10 rounded-full' ><img src={user?.image} className=' object-cover h-full w-full rounded-full' alt="" /></div>
                           ):(
                           <User className="w-6 h-6" />
                           )
                        )}
                </>
              )}
                
                {/* {user && <span className="text-sm">Logout</span>} */}
                
              </button>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:bg-gray-100 rounded-full"
              >
                <ShoppingCart className="w-6 h-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>
      );
    
}