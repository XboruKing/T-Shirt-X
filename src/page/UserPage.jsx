import { BarChart, PlusCircle, ShoppingBasket, X , LogOut } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CreateProductForm from "../components/CreateProductForm";
import { ProductsList } from "../components/ProductsList";
import { AnalyticsTab } from "../components/AnalyticsTab";
import { useProductStore } from "../stores/useProductStore";
import Account from "../components/Account";
import UpdatePassword from "../components/UpdatePassword";
import { useUserStore } from "../stores/useUserStore";
import OrderList from "../components/OrderList"

const tabs = [
  { id: "account", label: "Account", icon: PlusCircle },
  { id: "order", label: "Order", icon: ShoppingBasket },
  { id: "password", label: "Update Password", icon: BarChart },
];

export const UserPage = ({ isUserModalOpen, setIsUserModalOpen }) => {
  const [activeTab, setActiveTab] = useState("account");
//   const { fetchAllProduct } = useProductStore();

//   useEffect(() => {
//     fetchAllProduct();
//   }, [fetchAllProduct])

const { logout } = useUserStore();

const handleLogout = () => {
  logout()
  setIsUserModalOpen(!isUserModalOpen) 
}

  return (
    <>
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white  rounded-lg p-6 w-full max-w-4xl  relative">
            <button 
              onClick={() => setIsUserModalOpen(!isUserModalOpen)}
              className="absolute right-4 top-4 hover:bg-gray-100 z-50 rounded-full p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <button 
              onClick={handleLogout}
              className="absolute left-4 top-4 flex flex-row items-center bg-red-300 py-2 px-3 hover:bg-red-400 rounded-full p-1"
            >
              <LogOut className="w-5 h-5" />Logout
            </button>
         
            
            <div className=' relative  z-10  ' >
              <div className=' relative overflow-auto  h-[500px] ' >
                <motion.h1
                  className=' text-4xl font-bold mb-4 text-emerald-400 text-center'
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  User Account
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
				{activeTab === "account" && <Account />}
                {activeTab === "order" && <OrderList />}
                {activeTab === "password" && <UpdatePassword />}
				</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}