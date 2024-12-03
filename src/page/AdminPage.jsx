import { BarChart, PlusCircle, ShoppingBasket, X , LogOut } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CreateProductForm from "../components/CreateProductForm";
import { ProductsList } from "../components/ProductsList";
import { AnalyticsTab } from "../components/AnalyticsTab";
import { useProductStore } from "../stores/useProductStore";
import { useUserStore } from "../stores/useUserStore";

const tabs = [
  { id: "create", label: "Create Product", icon: PlusCircle },
  { id: "products", label: "Products", icon: ShoppingBasket },
  { id: "analytics", label: "Analytics", icon: BarChart },
];

export const AdminPage = ({ isAdminModalOpen, setIsAdminModalOpen }) => {
  const [activeTab, setActiveTab] = useState("create");
  const { logout } = useUserStore();
//   const { fetchAllProduct } = useProductStore();

//   useEffect(() => {
//     fetchAllProduct();
//   }, [fetchAllProduct])
const handleLogout = () => {
  logout()
  setIsAdminModalOpen(!isAdminModalOpen) 
}

  return (
    <>
      {isAdminModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl  relative">
            <div className=" flex flex-row justify-between items-center" >
            <button 
              onClick={() => setIsAdminModalOpen(!isAdminModalOpen)}
              className="absolute right-4 top-4 z-50 hover:bg-gray-100 rounded-full p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <button 
              onClick={handleLogout}
              className="absolute z-50 left-4 top-4 flex flex-row items-center bg-red-300 py-2 px-3 hover:bg-red-400 rounded-full p-1"
            >
              <LogOut className="w-5 h-5" />Logout
            </button>
            </div>
            
            <div className=' relative overflow-hidden' >
              <div className=' relative z-10  overflow-auto  h-[500px]  ' >
                <motion.h1
                  className=' text-4xl font-bold mb-4 text-emerald-400 text-center'
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  Admin Dashboard
                </motion.h1>
                <div className='flex justify-center mb-8'>
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${
                        activeTab === tab.id
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      <tab.icon className='mr-2 h-5 w-5' />
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="overflow-auto " >
				{activeTab === "create" && <CreateProductForm />}
                {activeTab === "products" && <ProductsList />}
                {activeTab === "analytics" && <AnalyticsTab />}
				</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}