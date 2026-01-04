import { Routes, Route } from 'react-router';
import { Toaster } from 'react-hot-toast';
import AuthProvider from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PetsSupplies from './pages/PetsSupplies';
import AddListing from './pages/AddListing';
import MyListings from './pages/MyListings';
import MyOrders from './pages/MyOrders';
import ListingDetails from './pages/ListingDetails';
import CategoryFiltered from './pages/CategoryFiltered';
import NotFound from './pages/NotFound';

// নতুন page components import
import Services from './pages/Services';
import Testimonials from './pages/Testimonials';
import Pricing from './pages/Pricing';
import FAQ from './pages/FAQ';
import Events from './pages/Events';
import Community from './pages/Community';
import HelpCenter from './pages/HelpCenter';

import Favorites from './pages/Favorites';
import DashboardHome from './components/dashboard/DashboardHome';
import Profile from './components/dashboard/Profile';
import DashboardLayout from './components/dashboard/DashboardLayout';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import About from './pages/About';
import Cart from './pages/Cart';
import Notifications from './pages/Notifications';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/category-filtered-product/:categoryName" element={<CategoryFiltered />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pets-supplies" element={<PetsSupplies />} />
            <Route path="/category/:categoryName" element={<CategoryFiltered />} />
            
            {/* নতুন Public Routes */}
            <Route path="/services" element={<Services />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/faqs" element={<FAQ />} />
            <Route path="/events" element={<Events />} />
            <Route path="/community" element={<Community />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/blog" element={<Blog />} />
<Route path="/contact" element={<Contact />} />
<Route path="/about" element={<About />} />
<Route path="/cart" element={<Cart />} />
<Route path="/listing/:id" element={<ListingDetails />} />
<Route path="/notifications" element={<Notifications />} />

            {/* Private Routes */}
            <Route path="/add-listing" element={
              <PrivateRoute>
                <AddListing />
              </PrivateRoute>
            } />
            <Route path="/my-listings" element={
              <PrivateRoute>
                <MyListings />
              </PrivateRoute>
            } />
            <Route path="/my-orders" element={
              <PrivateRoute>
                <MyOrders />
              </PrivateRoute>
            } />
            
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }>
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<Profile />} />
            {/* Add other routes as needed */}
          </Route>
            
            <Route path="/favorites" element={
              <PrivateRoute>
                <Favorites />
              </PrivateRoute>
            } />

            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </AuthProvider>
  );
}

export default App;