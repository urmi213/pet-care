import { Routes, Route } from 'react-router';
import { Toaster } from 'react-hot-toast';
import AuthProvider from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PetsSupplies from './pages/PetsSupplies';
import ListingDetails from './pages/ListingDetails';
import CategoryFiltered from './pages/CategoryFiltered';
import NotFound from './pages/NotFound';

// Dashboard Components
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './components/dashboard/DashboardHome';
import Profile from './components/dashboard/Profile';

// User Dashboard Components
import AddListing from './pages/AddListing';
import MyListings from './pages/MyListings';
import MyOrders from './pages/MyOrders';
import Favorites from './pages/Favorites';
import Support from './pages/Services';

// Admin Dashboard Components
import AllOrders from './components/dashboard/AllOrders';
import AllListings from './components/dashboard/AllListings';
import UserManagement from './components/dashboard/UserManagement';
import Analytics from './components/dashboard/Analytics';
import Settings from './components/dashboard/Settings';
import Reports from './components/dashboard/Reports';

// Public Pages
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import About from './pages/About';
import Cart from './pages/Cart';
import Notifications from './pages/Notifications';
import Services from './pages/Services';
import Testimonials from './pages/Testimonials';
import Pricing from './pages/Pricing';
import FAQ from './pages/FAQ';
import Events from './pages/Events';
import Community from './pages/Community';
import HelpCenter from './pages/HelpCenter';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pets-supplies" element={<PetsSupplies />} />
            <Route path="/category/:categoryName" element={<CategoryFiltered />} />
            <Route path="/listing/:id" element={<ListingDetails />} />
            
            {/* Public Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/services" element={<Services />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/faqs" element={<FAQ />} />
            <Route path="/events" element={<Events />} />
            <Route path="/community" element={<Community />} />
            <Route path="/help-center" element={<HelpCenter />} />

            {/* Dashboard Routes - Protected */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }>
              <Route index element={<DashboardHome />} />
              <Route path="profile" element={<Profile />} />
              
              {/* User Dashboard Routes */}
              <Route path="my-orders" element={<MyOrders />} />
              <Route path="my-listings" element={<MyListings />} />
              <Route path="add-listing" element={<AddListing />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="support" element={<Support />} />
              
              {/* Admin Dashboard Routes - Protected with Admin Role */}
              <Route path="orders" element={
                <AdminRoute>
                  <AllOrders />
                </AdminRoute>
              } />
              <Route path="listings" element={
                <AdminRoute>
                  <AllListings />
                </AdminRoute>
              } />
              <Route path="users" element={
                <AdminRoute>
                  <UserManagement />
                </AdminRoute>
              } />
              <Route path="analytics" element={
                <AdminRoute>
                  <Analytics />
                </AdminRoute>
              } />
              <Route path="settings" element={
                <AdminRoute>
                  <Settings />
                </AdminRoute>
              } />
              <Route path="reports" element={
                <AdminRoute>
                  <Reports />
                </AdminRoute>
              } />
            </Route>

            {/* Old Routes - Redirect to Dashboard */}
            <Route path="/add-listing" element={
              <PrivateRoute>
                <DashboardLayout>
                  <AddListing />
                </DashboardLayout>
              </PrivateRoute>
            } />
            <Route path="/my-listings" element={
              <PrivateRoute>
                <DashboardLayout>
                  <MyListings />
                </DashboardLayout>
              </PrivateRoute>
            } />
            <Route path="/my-orders" element={
              <PrivateRoute>
                <DashboardLayout>
                  <MyOrders />
                </DashboardLayout>
              </PrivateRoute>
            } />
            <Route path="/favorites" element={
              <PrivateRoute>
                <DashboardLayout>
                  <Favorites />
                </DashboardLayout>
              </PrivateRoute>
            } />

            {/* Admin Old Routes - Redirect to Dashboard */}
            <Route path="/orders" element={
              <AdminRoute>
                <DashboardLayout>
                  <AllOrders />
                </DashboardLayout>
              </AdminRoute>
            } />
            <Route path="/listings" element={
              <AdminRoute>
                <DashboardLayout>
                  <AllListings />
                </DashboardLayout>
              </AdminRoute>
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
            success: {
              duration: 3000,
              style: {
                background: '#10b981',
                color: '#fff',
              },
            },
            error: {
              duration: 4000,
              style: {
                background: '#ef4444',
                color: '#fff',
              },
            },
          }}
        />
      </div>
    </AuthProvider>
  );
}

export default App;