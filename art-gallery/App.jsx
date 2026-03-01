import { useState } from 'react'
import Gallery from './pages/Gallery'
import Register from './auth/register'
import Login from './auth/login'
import Navbar from './component/Navbar'
import Footer from './component/Footer'

function App() {
  const [currentPage, setCurrentPage] = useState('gallery')

  return (
    <div className="app flex flex-col min-h-screen">
      <Navbar onNavigate={setCurrentPage} />
      <main className="app-main flex-1">
        {currentPage === 'gallery' && <Gallery onNavigateToRegister={() => setCurrentPage('register')} />}
        {currentPage === 'register' && <Register onNavigateToGallery={() => setCurrentPage('gallery')} />}
        {currentPage === 'login' && <Login onNavigateToGallery={() => setCurrentPage('gallery')} onNavigateToRegister={() => setCurrentPage('register')} />}
      </main>
      <Footer onNavigate={setCurrentPage} />
    </div>
  )
}

export default App
