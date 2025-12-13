import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { FaHome, FaPaw, FaSearch } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        
        <div className="relative mb-8">
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 360, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-4 -left-4"
          >
            <FaPaw className="text-4xl text-orange-300 opacity-50" />
          </motion.div>
          
          <div className="text-9xl font-bold text-gray-800 mb-4">
            4
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block text-orange-500"
            >
              0
            </motion.span>
            4
          </div>
          
          <motion.div
            animate={{
              y: [0, 10, 0],
              rotate: [0, -360, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            className="absolute -bottom-4 -right-4"
          >
            <FaPaw className="text-4xl text-orange-300 opacity-50" />
          </motion.div>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Oops! Page Not Found
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          The page you're looking for seems to have wandered off like a curious puppy. 
          Don't worry, we'll help you find your way back!
        </p>

       
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-md mx-auto mb-8"
        >
          <div className="join w-full">
            <input
              type="text"
              placeholder="Search for pets or supplies..."
              className="input input-bordered join-item flex-grow"
            />
            <button className="btn btn-primary join-item">
              <FaSearch />
            </button>
          </div>
        </motion.div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link to="/" className="card bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="card-body items-center text-center">
              <FaHome className="text-3xl text-primary mb-2" />
              <h3 className="card-title">Home Page</h3>
              <p className="text-gray-600">Return to the main page</p>
            </div>
          </Link>
          
          <Link to="/pets-supplies" className="card bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="card-body items-center text-center">
              <FaPaw className="text-3xl text-secondary mb-2" />
              <h3 className="card-title">Browse Listings</h3>
              <p className="text-gray-600">Find pets and supplies</p>
            </div>
          </Link>
          
          <Link to="/add-listing" className="card bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="card-body items-center text-center">
              <FaSearch className="text-3xl text-accent mb-2" />
              <h3 className="card-title">Add Listing</h3>
              <p className="text-gray-600">List your pet or product</p>
            </div>
          </Link>
        </div>

     
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/" className="btn btn-primary btn-lg">
            <FaHome className="mr-2" />
            Back to Home
          </Link>
        </motion.div>

       
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 bg-orange-50 rounded-xl border border-orange-200"
        >
          <h4 className="font-bold text-orange-800 mb-2">🐾 Did You Know?</h4>
          <p className="text-orange-700">
            While you were looking for this page, somewhere a pet found their forever home through PawMart!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;