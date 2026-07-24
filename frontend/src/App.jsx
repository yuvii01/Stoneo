import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import axios from 'axios';

// Global Axios configuration to seamlessly support Ngrok for temporary live reviews
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';

import GetQuote from './pages/GetQuote';
import './styles/globals.css';
import './App.css';
import ScrollToTop from './pages/ScrollToTop';

import Sandstone from './pages/categories/Sandstone';
import MarbleImported from './pages/categories/Marble_Imported';
import MarbleIndian from './pages/categories/Marble_Indian';
import Granite from './pages/categories/Granite';
import Marble from './pages/categories/Marble';
import Quartz from './pages/categories/Quartz';
import Onyx from './pages/categories/Onyx';
import PavingAndLandscape from './pages/categories/PavingAndLandscape';
import House from './pages/applications/House';
import TilePage from './pages/applications/TilePage';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import ProductDetail from './pages/ProductDetail';
import RoyalGemStones from './pages/RoyalGemStones';
import RoyalCollection from './pages/RoyalCollection';

// Context
import { DemandProvider } from './context/DemandContext';
import BlogPopup from './components/BlogPopup';
import ExpertAdviceButton from './components/ExpertAdviceButton';

// Admin Imports
import AdminLogin from './pages/admin/AdminLogin';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBlogs from './pages/admin/AdminBlogs';
import AdminProducts from './pages/admin/AdminProducts';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app">
      <ScrollToTop />
      {!isAdminRoute && <Header />}

      <main className={!isAdminRoute ? "main-content" : ""}>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Categories */}
          <Route path="/category/granite" element={<Granite />} />
          <Route path="/category/marble" element={<Marble />} />
          <Route path="/category/Imported_Marble" element={<MarbleImported />} />
          <Route path="/category/Indian_Marble" element={<MarbleIndian />} />
          <Route path="/category/sandstone" element={<Sandstone />} />
          <Route path="/category/quartz" element={<Quartz />} />
          <Route path="/category/onyx" element={<Onyx />} />
          <Route path="/category/paving-landscape" element={<PavingAndLandscape />} />

          <Route path="/application/interior" element={<House />} />
          <Route path="/application/exterior" element={<House />} />
          <Route path="/application/interior/:tileName" element={<TilePage />} />
          <Route path="/application/exterior/:tileName" element={<TilePage />} />

          {/* Other Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/get-quote" element={<GetQuote />} />
          <Route path="/royal-gem-stones" element={<RoyalGemStones />} />
          <Route path="/royal-gem-stones/application/:collectionId" element={<RoyalCollection showFilters={true} />} />
          <Route path="/royal-gem-stones/stone/:collectionId" element={<RoyalCollection showFilters={false} />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminProtectedRoute />}>
            <Route element={<AdminDashboard />}>
              <Route index element={<Navigate to="blogs" replace />} />
              <Route path="dashboard" element={<Navigate to="../blogs" replace />} />
              <Route path="blogs" element={<AdminBlogs />} />
              <Route path="products" element={<AdminProducts />} />
            </Route>
          </Route>

          {/* Catch-all route (must be LAST) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <ExpertAdviceButton />}
      {!isAdminRoute && <BlogPopup />}
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <DemandProvider>
        <Router>
          <AppContent />
        </Router>
      </DemandProvider>
    </HelmetProvider>
  );
}

export default App;