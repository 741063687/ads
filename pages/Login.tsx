import React, { useState } from 'react';
import { loginUser } from '../services/mockTikTokService';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('demo@tiktok-business.com');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await loginUser(email);
      onLogin(user);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col md:flex-row">
         <div className="w-full p-8 md:p-10">
            <div className="flex items-center gap-2 mb-8">
               <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#25F4EE] via-transparent to-[#FE2C55] opacity-50"></div>
                    <span className="text-white font-bold text-xl relative z-10">T</span>
               </div>
               <span className="font-bold text-xl tracking-tight text-gray-900">AdsManager Pro</span>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-500 text-sm mb-8">Please enter your details to sign in.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                  required
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-black text-white font-semibold py-2.5 rounded-lg hover:bg-gray-800 transition shadow-lg shadow-gray-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : 'Sign in'}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-gray-400">
              <p>Demo Account: demo@tiktok-business.com</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Login;