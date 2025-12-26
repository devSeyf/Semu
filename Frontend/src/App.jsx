import './App.css'

import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import Hero from "./components/sections/Hero"

function App() {
  return (
    
    <div className="min-h-screen  bg-white ">
    <Navbar />
    <main>
      <Hero />
    </main>
    <Footer />
    
    </div>
    
  )
}

export default App
