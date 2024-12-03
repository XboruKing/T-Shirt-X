import React,{useEffect} from 'react';
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import NarutoShop from './page/HomePage';
import { useUserStore } from './stores/useUserStore';
import PurchaseCancelPage from "./page/PurchaseCancelPage";
import PurchaseSuccessPage from "./page/PurchaseSuccessPage";
import { useProductStore } from './stores/useProductStore';

const App = () => {
  const { user , checkAuth , getOrders , orders } = useUserStore();
  const { fetchAllProduct } = useProductStore()
  console.log(orders)

  useEffect(() => {
    fetchAllProduct();
  }, [fetchAllProduct]);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  useEffect(() => {
    getOrders();
  }, [getOrders]);
  return (
    <div className="min-h-screen bg-gray-100">
      
      <Routes>
        <Route path="/" element={<NarutoShop />} />
       
        <Route
						path='/purchase-success'
						element={<PurchaseSuccessPage />}
					/>
					<Route path='/purchase-cancel' element={<PurchaseCancelPage />} />
      </Routes>
       <Toaster />
    </div>
  )
}

export default App