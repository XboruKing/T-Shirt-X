import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useUserStore } from '../stores/useUserStore';

const AuthModal = ({ isLoginModalOpen, setIsLoginModalOpen }) => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const { login , signup , loading } = useUserStore();

  const handleAuth = (e) => {
    e.preventDefault();
    // Handle authentication logic here
    if(isSignUpMode){
        signup(authData);
        setIsSignUpMode(!isSignUpMode)
    }else{
        login(authData);
        setIsLoginModalOpen(false)
    }
   
  };

  return (
    <>
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button 
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute right-4 top-4 hover:bg-gray-100 rounded-full p-1"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-2xl font-bold mb-6">
              {isSignUpMode ? 'Create Account' : 'Login'}
            </h2>
            
            <form onSubmit={handleAuth} className="space-y-4">
              {isSignUpMode && (
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={authData.name}
                    onChange={(e) => setAuthData(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Enter your name"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={authData.email}
                  onChange={(e) => setAuthData(prev => ({
                    ...prev,
                    email: e.target.value
                  }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={authData.password}
                    onChange={(e) => setAuthData(prev => ({
                      ...prev,
                      password: e.target.value
                    }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black pr-10"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isSignUpMode && (
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={authData.confirmPassword}
                      onChange={(e) => setAuthData(prev => ({
                        ...prev,
                        confirmPassword: e.target.value
                      }))}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black pr-10"
                      placeholder="Confirm your password"
                      required={isSignUpMode}
                    />
                  </div>
                </div>
              )}

              {!isSignUpMode && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-gray-600 hover:underline">
                    Forgot password?
                  </a>
                </div>
              )}
              
              <button 
                type="submit"
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
              disabled={loading}
              >
                 {loading?'loading....':isSignUpMode ? 'Sign Up' : 'Login'}
              
              </button>
              
              <div className="text-center text-sm">
                <span className="text-gray-600">
                  {isSignUpMode ? 'Already have an account?' : "Don't have an account?"}
                </span>
                {' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUpMode(!isSignUpMode);
                    setAuthData({
                      email: '',
                      password: '',
                      confirmPassword: '',
                      name: ''
                    });
                  }}
                  className="text-black font-medium hover:underline"
                >
                    
                  {isSignUpMode ? 'Login here' : 'Sign up here'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthModal;