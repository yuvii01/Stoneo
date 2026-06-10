import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
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
import Interior from './pages/applications/interior';
import Exterior from './pages/applications/exterior';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="app">
          <ScrollToTop />
          <Header />

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />

              {/* Categories */}
              <Route path="/category/granite" element={<Granite />} />
              <Route path="/category/Imported_Marble" element={<MarbleImported />} />
              <Route path="/category/Indian_Marble" element={<MarbleIndian />} />
              <Route path="/category/sandstone" element={<Sandstone />} />


              <Route path="/application/interior" element={<Interior />} />
              <Route path="/application/exterior" element={<Exterior />} />


              {/* Other Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:id" element={<BlogDetail />} />
              <Route path="/get-quote" element={<GetQuote />} />

              {/* Optional (you already imported these, so including them makes sense) */}

              {/* ✅ Catch-all route (must be LAST) */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;