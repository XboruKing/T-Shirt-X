import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ children, isOpen=true, onClose }) => {
  return (
    
      
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg p-6 max-w-md w-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              &times;
            </button>
            klnfadlkfn,madnmfna,mdsnf,masn,mfna,mdsfn
          </motion.div>
        </motion.div>
 
  );
};

export default Modal;