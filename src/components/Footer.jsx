import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { FaPaw, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <Link to="/" className="flex items-center space-x-2">
              <FaPaw className="text-3xl text-orange-500" />
              <span className="text-2xl font-bold">
                Paw<span className="text-orange-500">Mart</span>
              </span>
            </Link>
            <p className="text-gray-400">
              PawMart connects local pet owners and buyers for adoption and pet care products.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-orange-500 transition-colors">Home</Link></li>
              <li><Link to="/pets-supplies" className="text-gray-400 hover:text-orange-500 transition-colors">Pets & Supplies</Link></li>
              <li><Link to="/add-listing" className="text-gray-400 hover:text-orange-500 transition-colors">Add Listing</Link></li>
            </ul>
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/category/Pets" className="text-gray-400 hover:text-orange-500 transition-colors">Pets for Adoption</Link></li>
              <li><Link to="/category/Food" className="text-gray-400 hover:text-orange-500 transition-colors">Pet Food</Link></li>
              <li><Link to="/category/Accessories" className="text-gray-400 hover:text-orange-500 transition-colors">Accessories</Link></li>
              <li><Link to="/category/Care Products" className="text-gray-400 hover:text-orange-500 transition-colors">Care Products</Link></li>
            </ul>
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: support@pawmart.com</li>
              <li>Phone: +880 1234 567890</li>
              <li>Address: Dhaka, Bangladesh</li>
            </ul>
          </motion.div>
        </div>

        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500"
        >
          <p>&copy; {currentYear} PawMart. All rights reserved.</p>
          <p className="text-sm mt-2">
            <Link to="/terms" className="hover:text-orange-500 transition-colors">Terms of Service</Link> | 
            <Link to="/privacy" className="hover:text-orange-500 transition-colors ml-2">Privacy Policy</Link>
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;