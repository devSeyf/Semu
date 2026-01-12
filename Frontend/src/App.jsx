import './App.css'
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import Hero from "./components/sections/Hero"

function App() {
  return (
    <div className="text-7xl text-emerald-600 ">
    <Navbar />
    <main>
      <Hero />
    </main>
    <Footer />
    </div>
    
  )
}

export default App
