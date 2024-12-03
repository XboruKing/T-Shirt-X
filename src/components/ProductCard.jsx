import React, { useState, useEffect } from 'react';

import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';
import { useProductStore } from '../stores/useProductStore';
import { useCartStore } from '../stores/useCartStore';
import { useUserStore } from '../stores/useUserStore';

const ProductCard = ({ product , onOpenModal  }) => {
    const [selectedSize, setSelectedSize] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const {getCartItems, addToCart , removeFromCart , updateQuantity , cart } = useCartStore();
  const{ user } = useUserStore();

  const handleAddToCart = () =>{
	
	if (selectedSize) {
		if(!user){
			toast.error("Please login to add product to cart",{ id: "login" });
			return;
		}else{
			addToCart({product , size: selectedSize});
		}
	  } else {
		toast.error('Please select a size');
	  }
	
	
}
  
  const { 
    loading,
    deleteProduct,
    toggleFeaturedProduct
  } = useProductStore();

  const handleDeleteProduct = async () => {
    try {
      await deleteProduct(product._id);
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleToggleFeatured = async () => {
    try {
      await toggleFeaturedProduct(product._id);
      toast.success(`Product ${product.isFeatured ? 'unfeatured' : 'featured'} successfully`);
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  if (loading) {
    return (
      <div className="max-w-[280px] h-[400px] bg-white rounded-3xl p-4 shadow-lg flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[280px] bg-white rounded-3xl p-4 shadow-lg relative group">
      {/* Featured Badge */}
      {/* {product.isFeatured && (
        <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full">
          Featured
        </div>
      )} */}

      {/* Admin Controls - Visible on Hover */}
      {/* <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <button
          onClick={handleToggleFeatured}
          className="p-2 bg-yellow-400 rounded-full hover:bg-yellow-500 transition-colors"
          title={product.isFeatured ? "Remove from featured" : "Add to featured"}
        >
          ⭐
        </button>
        <button
          onClick={handleDeleteProduct}
          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          title="Delete product"
        >
          🗑️
        </button>
      </div> */}

      {/* Image Container */}
      <div 
        className="rounded-2xl overflow-hidden mb-3 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <img 
          src={product.image}
          alt={product.name}
          className="w-full  h-48 object-cover transform hover:scale-105 transition-transform"
        />
      </div>
      
      {/* Product Info */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-xl line-clamp-1 font-bold">{product.name}</h3>
          <span className="text-xl font-bold">${product.price}</span>
        </div>
        
        {/* Category Tag */}
        {/* <div className="text-sm bg-gray-100 px-2 py-1 rounded-full inline-block">
          {product.category}
        </div> */}
        
        {/* <div className="relative">
          <p className={`text-gray-600 text-sm ${!showFullDescription ? 'line-clamp-1' : ''}`}>
            {product.description}
          </p>
          <button 
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-blue-500 text-sm hover:underline"
          >
            {showFullDescription ? 'Show less' : 'Show more'}
          </button>
        </div> */}
        
        {/* Size Selector */}
        <div className="flex gap-2 py-2">
          {product.sizes?.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`
                h-8 w-8 rounded-full text-sm flex items-center justify-center
                ${selectedSize === size 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-black hover:bg-gray-200'
                }
              `}
            >
              {size}
            </button>
          ))}
        </div>
        
        {/* Action Buttons */}
        <div className='flex flex-row items-center justify-between gap-2'>
          <button 
            onClick={() => onOpenModal(product)}
            className="flex-1 bg-gray-800 text-white py-3 rounded-xl font-medium 
              hover:bg-gray-700 transition-colors"
          >
            Show Detail
          </button>

          <button 
            onClick={handleAddToCart}
            className={`flex-1 py-3 rounded-xl font-medium transition-colors
              ${selectedSize 
                ? 'bg-black text-white hover:bg-gray-800' 
                : 'bg-gray-300 cursor-not-allowed'}`
            }
          >
            Add To cart
          </button>
        </div>

        {/* Stock Status */}
        {product.stock <= 5 && product.stock > 0 && (
          <p className="text-orange-500 text-sm">
            Only {product.stock} left in stock!
          </p>
        )}
        {product.stock === 0 && (
          <p className="text-red-500 text-sm">Out of stock</p>
        )}
      </div>

      {/* <ProductModal
        product={product}
        selectedSize={selectedSize}
        onSizeSelect={setSelectedSize}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      /> */}
    </div>
  );
};

// Composant Liste des Produits
// export const ProductList = () => {
//   const { products, loading, fetchAllProduct, fetchAllProductsByCategory } = useProductStore();

//   useEffect(() => {
//     fetchAllProduct();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Loader className="animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
//       {products.map((product) => (
//         <ProductCard key={product._id} product={product} />
//       ))}
//     </div>
//   );
// };

export default ProductCard;