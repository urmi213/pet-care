// pages/public/Login.jsx - SIMPLIFIED VERSION
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaGoogle, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaInfoCircle } from 'react-icons/fa';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { signIn, googleSignIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const result = await signIn(formData.email, formData.password);
    
    if (result.success) {
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/'), 1000);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    const result = await googleSignIn();
    
    if (result.success) {
      if (result.redirect) {
        setSuccess('Redirecting to Google...');
        // Page will redirect automatically
      } else {
        setSuccess('Google login successful!');
        setTimeout(() => navigate('/'), 1000);
      }
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'demo@pawmart.com',
      password: 'Demo@123'
    });
  };

  const handleAdminLogin = () => {
    setFormData({
      email: 'admin@pawmart.com',
      password: 'Admin@123'
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl"
      >
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Login Form */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
                  <FaEnvelope className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  Welcome Back
                </h1>
                <p className="text-gray-600 text-lg">
                  Sign in to access your PawMart dashboard
                </p>
              </div>

              {/* Error & Success Messages */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm font-medium text-green-800">{success}</p>
                  </div>
                </div>
              )}

              {/* Google Sign In Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center py-4 px-6 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 mb-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaGoogle className="h-5 w-5 text-red-500 mr-3" />
                <span className="text-gray-700 font-medium">
                  Continue with Google
                </span>
              </button>

              <div className="text-center text-sm text-gray-600 mb-8">
                <div className="flex items-center justify-center">
                  <FaInfoCircle className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Uses secure Google redirect method</span>
                </div>
              </div>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with email</span>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="block w-full pl-10 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="block w-full pl-10 pr-12 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <FaArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                    Create account
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Demo Credentials */}
          <div className="lg:w-1/2">
            <div className="h-full flex flex-col gap-6">
              {/* Demo Credentials Card */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl shadow-2xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-6">Quick Access</h2>
                
                <div className="space-y-4">
                  <button
                    onClick={handleDemoLogin}
                    className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center mb-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                          <span className="font-medium">Demo User Account</span>
                        </div>
                        <p className="text-sm text-blue-200">
                          Standard user access
                        </p>
                      </div>
                      <FaArrowRight className="h-5 w-5" />
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-white/10 p-2 rounded-lg">
                        <span className="text-blue-200">Email:</span>
                        <div className="font-mono">demo@pawmart.com</div>
                      </div>
                      <div className="bg-white/10 p-2 rounded-lg">
                        <span className="text-blue-200">Password:</span>
                        <div className="font-mono">Demo@123</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={handleAdminLogin}
                    className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center mb-1">
                          <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                          <span className="font-medium">Admin Account</span>
                        </div>
                        <p className="text-sm text-blue-200">
                          Full admin access
                        </p>
                      </div>
                      <FaArrowRight className="h-5 w-5" />
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-white/10 p-2 rounded-lg">
                        <span className="text-blue-200">Email:</span>
                        <div className="font-mono">admin@pawmart.com</div>
                      </div>
                      <div className="bg-white/10 p-2 rounded-lg">
                        <span className="text-blue-200">Password:</span>
                        <div className="font-mono">Admin@123</div>
                      </div>
                    </div>
                  </button>

                  <div className="w-full bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center mb-2">
                      <FaGoogle className="h-5 w-5 text-yellow-400 mr-2" />
                      <span className="font-medium">Real Google Account</span>
                    </div>
                    <p className="text-sm text-blue-200">
                      Sign in with your real Gmail account using secure Google OAuth
                    </p>
                    <div className="mt-3 text-sm">
                      <div className="bg-white/10 p-2 rounded-lg">
                        <span className="text-blue-200">How it works:</span>
                        <div className="text-blue-100 mt-1">
                          1. Click "Continue with Google"<br/>
                          2. You'll be redirected to Google<br/>
                          3. Choose your account<br/>
                          4. Automatically redirected back
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Card */}
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  About This System
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <FaGoogle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Real Google Sign In</h4>
                      <p className="text-sm text-gray-600">
                        Uses secure Google OAuth redirect method (no popup issues).
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Secure Authentication</h4>
                      <p className="text-sm text-gray-600">
                        Firebase-powered secure authentication system.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Full Dashboard</h4>
                      <p className="text-sm text-gray-600">
                        Complete dashboard with user management and analytics.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;