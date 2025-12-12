import { Link } from 'react-router';
import { motion } from 'framer-motion';

const CategoryCard = ({ category }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
    >
      <Link to={category.link}>
        <div className={`card-body text-center p-6 bg-gradient-to-br ${category.color}`}>
          <div className="text-5xl mb-4">{category.icon}</div>
          <h3 className={`text-2xl font-bold mb-2 ${category.textColor}`}>{category.name}</h3>
          <p className="text-gray-600 mb-4">{category.description}</p>
          <div className="badge badge-outline">{category.count}</div>
          <div className="card-actions justify-center mt-4">
            <button className="btn btn-sm btn-primary">Browse</button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;