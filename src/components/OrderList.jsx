import React, { useEffect } from 'react';
import { motion } from "framer-motion";
import { useUserStore } from '../stores/useUserStore';

const OrderList = () => {
  const { orders, getOrders } = useUserStore();
  
  useEffect(() => {
    getOrders();
  }, [getOrders]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Order ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Items
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {orders?.map((order, index) => (
            <tr key={order._id || index} className="hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-white">
                  {order._id ? order._id.slice(-6) : `Order ${index + 1}`}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">
                  {formatDate(order.createdAt)}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-300">
                  {order.products.map((item, idx) => (
                    <div key={item._id || idx} className="mb-1">
                      <span className="font-medium">
                        {item.quantity}x
                      </span>
                      <span className="ml-2">
                        ${item.price.toFixed(2)}
                      </span>
                      {idx < order.products.length - 1 && <hr className="my-1 border-gray-700" />}
                    </div>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-green-400">
                  ${order.totalAmount.toFixed(2)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default OrderList;