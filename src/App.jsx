import { BrowserRouter as Router, Routes, Route } from 'react-router';
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

function App() {
  return (
    <Router>
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
              <Route path="/listing/:id" element={
                <PrivateRoute>
                  <ListingDetails />
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
    </Router>
  );
}

export default App;