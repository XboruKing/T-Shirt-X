import {create} from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

 export const useProductStore = create((set , get) => ({
    products: [],
    loading: false,

    setProducts: (products) => set({products}),

    createProduct : async (productData) => {
        set({loading: true});

        try {
            
            const res = await axios.post("/products", productData);
            set((prevState) => ({
                products: [...prevState.products, res.data],
                loading: false
            }));

        } catch (error) {
            toast.error(error.response.data.error);
            set({loading: false});
            
        }

    },

    fetchAllProduct: async () => {
        set({loading: true});
        try {
            const res = await axios.get("/products");
            
            // Validate products before setting them in state
            const validatedProducts = res.data.products.map(product => {
                if (!product.name) {
                    console.warn('Product missing name:', product);
                    product.name = 'Unnamed Product'; // Provide default name
                }
                return product;
            });
            
            set({products: validatedProducts, loading: false});
        } catch (error) {
            set({ error: "Failed to fetch products", loading: false });
            toast.error(error.response?.data?.error || "Failed to fetch products");
        }
    },
    fetchAllProductsByCategory: async (category) => {
        set({loading: true});
        try {
            
            const res = await axios.get(`/products/category/${category}`);
            set({products: res.data.products, loading: false});

        } catch (error) {
            set({ error: "Failed to fetch products", loading: false });
            toast.error(error.response.data.error || "Failed to fetch products");
        }
    },
    fetchAllProduct: async () => {
        set({loading: true});
        try {
            
            const res = await axios.get("/products");
            set({products: res.data.products, loading: false});

        } catch (error) {
            set({ error: "Failed to fetch products", loading: false });
            toast.error(error.response.data.error || "Failed to fetch products");
        }
    },
    deleteProduct: async (productId) => {
        set({loading: true});
        try {
            await axios.delete(`/products/${productId}`);
            set((prevProducts)=>({
                products: prevProducts.products.filter((product) => product._id !== productId),
                loading: false,
            }))
            
        } catch (error) {
            set({loading: false});
            toast.error(error.response.data.error || "Failed to delete product" );
            
        }
    },
    toggleFeaturedProduct: async (productId) => {
        set({loading: true});
        try {
            const res = await axios.patch(`/products/${productId}`);
            set((prevProducts)=>({
                products: prevProducts.products.map((product) => 
                    product._id === productId ? {...product, isFeatured: res.data.isFeatured} : product
                ),
                loading: false,
            }))
            
        } catch (error) {

            set({loading: false});
            toast.error(error.response.data.error || "Failed to update product" );
            
        }
    },
    
    

}));