import { useState } from 'react'
import './App.css'
import Gallery from '../pages/Gallery'
import Register from '../auth/register'
import Login from '../auth/login'
import Navbar from '../component/Navbar'

function App() {
  const [currentPage, setCurrentPage] = useState('gallery')

  return (
    <div className="app">
      <Navbar onNavigate={setCurrentPage} />
      <main className="app-main">
        {currentPage === 'gallery' && <Gallery onNavigateToRegister={() => setCurrentPage('register')} />}
        {currentPage === 'register' && <Register onNavigateToGallery={() => setCurrentPage('gallery')} />}
        {currentPage === 'login' && <Login onNavigateToGallery={() => setCurrentPage('gallery')} onNavigateToRegister={() => setCurrentPage('register')} />}
      </main>
    </div>
  )
}

export default App
