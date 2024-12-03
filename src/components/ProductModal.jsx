import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useProductStore } from '../stores/useProductStore';
import { useCartStore } from '../stores/useCartStore';
import { useUserStore } from '../stores/useUserStore';
import toast from 'react-hot-toast';


const ProductModal = ({ isOpen, onClose, product }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  const { addToCart } = useCartStore();
  const { user } = useUserStore();
  const { loading, deleteProduct, toggleFeaturedProduct } = useProductStore();

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    if (!user) {
      toast.error("Please login to add product to cart", { id: "login" });
      return;
    }

    addToCart({ product, size: selectedSize });
    toast.success('Added to cart successfully');
  };

  const handleDeleteProduct = async () => {
    try {
      await deleteProduct(product._id);
      toast.success('Product deleted successfully');
      onClose();
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Left Side - Image */}
          <div className="aspect-square relative overflow-hidden rounded-lg">
            <img
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Right Side - Content */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">{product.name}</h2>

            {/* Size Selector */}
            <div className="space-y-2">
              <p className="font-medium">Select Size</p>
              <div className="flex gap-2">
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
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800"
              disabled={loading}
            >
              Add To Cart
            </button>

            {/* Admin Actions */}
            {user?.isAdmin && (
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteProduct}
                  variant="destructive"
                  disabled={loading}
                >
                  Delete Product
                </button>
                <button
                  onClick={handleToggleFeatured}
                  variant="outline"
                  disabled={loading}
                >
                  {product.isFeatured ? 'Unfeature' : 'Feature'} Product
                </button>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <p className="font-medium">Description</p>
              <p className={!showFullDescription ? 'line-clamp-3' : undefined}>
                {product.description}
              </p>
              {product.description?.length > 150 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  {showFullDescription ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;