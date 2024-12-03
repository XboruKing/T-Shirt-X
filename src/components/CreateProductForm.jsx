import React, { useState } from 'react';
import { PlusCircle, Upload, Loader } from 'lucide-react';
import { useProductStore } from '../stores/useProductStore';

const categories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"];
const sizes = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl'];

const CreateProductForm = () => {
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        category: "", // Added back category
        sizes: [], // Changed to array to store multiple sizes
        image: "",
    });
    
    const { createProduct, loading } = useProductStore();

    // Handle size selection with multiple sizes
    const handleSizeToggle = (size) => {
        setNewProduct(prev => {
            const updatedSizes = prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size];
            
            return {
                ...prev,
                sizes: updatedSizes
            };
        });
    };

    // Improved image handling with validation
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            alert('Please upload an image file (JPG, PNG, or GIF)');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size should be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setNewProduct(prev => ({
                ...prev,
                image: reader.result
            }));
        };
        reader.readAsDataURL(file);
    };

    // Form validation before submission
    const validateForm = () => {
        if (!newProduct.name.trim()) return 'Product name is required';
        if (!newProduct.description.trim()) return 'Description is required';
        if (!newProduct.price || newProduct.price <= 0) return 'Valid price is required';
        if (!newProduct.category) return 'Category is required';
        if (newProduct.sizes.length === 0) return 'At least one size must be selected';
        if (!newProduct.image) return 'Product image is required';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const error = validateForm();
        if (error) {
            alert(error);
            return;
        }

        try {
            await createProduct(newProduct);
            // Reset form after successful creation
            setNewProduct({
                name: "",
                description: "",
                price: "",
                category: "",
                sizes: [],
                image: ""
            });
        } catch (error) {
            alert("Error creating product: " + error.message);
        }
    };

    return (
        <div className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-emerald-300">Create New Product</h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Name Input */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                        Product Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                    />
                </div>

                {/* Description Input */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        rows="3"
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                    />
                </div>

                {/* Price Input */}
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-300">
                        Price
                    </label>
                    <input
                        type="number"
                        id="price"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: Math.max(0, Number(e.target.value)) })}
                        step="0.01"
                        min="0"
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                    />
                </div>

                {/* Category Select */}
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-300">
                        Category
                    </label>
                    <select
                        id="category"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sizes Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Sizes (select at least one)
                    </label>
                    <div className="flex gap-2 py-2">
                        {sizes.map((size) => (
                            <button
                                type="button"
                                key={size}
                                onClick={() => handleSizeToggle(size)}
                                className={`
                                    h-8 w-8 rounded-full text-sm flex items-center justify-center
                                    ${newProduct.sizes.includes(size)
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-gray-100 text-black hover:bg-gray-200'
                                    }
                                `}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Image Upload */}
                <div className="mt-1 flex items-center">
                    <input
                        type="file"
                        id="image"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    <label
                        htmlFor="image"
                        className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                        <Upload className="h-5 w-5 inline-block mr-2" />
                        Upload Image
                    </label>
                    {newProduct.image && (
                        <span className="ml-3 text-sm text-gray-400">Image uploaded</span>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                            Loading...
                        </>
                    ) : (
                        <>
                            <PlusCircle className="mr-2 h-5 w-5" />
                            Create Product
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default CreateProductForm;