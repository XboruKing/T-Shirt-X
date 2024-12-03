import React, { useState } from 'react';
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from 'lucide-react';

const UpdatePassword = () => {
  // État pour gérer les mots de passe
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // État pour gérer le chargement
  const [loading, setLoading] = useState(false);

  // État pour gérer les erreurs
  const [errors, setErrors] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fonction de validation du formulaire
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    // Validation du mot de passe actuel
    if (passwords.oldPassword.length < 6) {
      newErrors.oldPassword = 'Le mot de passe doit contenir au moins 6 caractères';
      isValid = false;
    }

    // Validation du nouveau mot de passe
    if (passwords.newPassword.length < 6) {
      newErrors.newPassword = 'Le nouveau mot de passe doit contenir au moins 6 caractères';
      isValid = false;
    }

    // Validation de la confirmation du mot de passe
    if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Gestion du changement des champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
    // Réinitialiser l'erreur lors de la modification
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Ici, vous ajouteriez votre logique d'appel API réelle
      // await updatePassword(passwords);
      
      // Réinitialiser le formulaire après succès
      setPasswords({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Afficher un message de succès (vous pourriez utiliser un toast)
      alert('Mot de passe mis à jour avec succès');
      
    } catch (error) {
      // Gérer les erreurs (vous pourriez utiliser un toast)
      alert('Erreur lors de la mise à jour du mot de passe');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className='text-2xl font-semibold mb-6 text-emerald-300'>Update Password</h2>

      <form className='space-y-4' onSubmit={handleSubmit}>
        <div>
          <label htmlFor='oldPassword' className='block text-sm font-medium text-gray-300'>
            Old Password
          </label>
          <input
            type='password'
            id='oldPassword'
            name='oldPassword'
            value={passwords.oldPassword}
            onChange={handleChange}
            className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
            px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
            required
          />
          {errors.oldPassword && (
            <p className="mt-1 text-sm text-red-500">{errors.oldPassword}</p>
          )}
        </div>

        <div>
          <label htmlFor='newPassword' className='block text-sm font-medium text-gray-300'>
            New Password
          </label>
          <input
            type='password'
            id='newPassword'
            name='newPassword'
            value={passwords.newPassword}
            onChange={handleChange}
            className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
            px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
            required
          />
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
          )}
        </div>

        <div>
          <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-300'>
            Confirm New Password
          </label>
          <input
            type='password'
            id='confirmPassword'
            name='confirmPassword'
            value={passwords.confirmPassword}
            onChange={handleChange}
            className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
            px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
            required
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type='submit'
          className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
          shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
              Loading...
            </>
          ) : (
            <>
              <PlusCircle className='mr-2 h-5 w-5' />
              Update Password
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default UpdatePassword;