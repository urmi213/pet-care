import { motion } from 'framer-motion';
import { FaPaw } from 'react-icons/fa';

const LoadingSpinner = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
        className="relative"
      >
        <div className="w-20 h-20 border-4 border-orange-200 border-t-orange-500 rounded-full" />
        <FaPaw className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orange-500 text-2xl" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 text-gray-600"
      >
        Loading...
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;