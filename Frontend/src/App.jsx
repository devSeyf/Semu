import './App.css'
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import Hero from "./components/sections/Hero"
import Scanner from "./components/ui/Scanner"

function App() {
  return (
    <div className="font-display">
      <Navbar />
      <main>
        <Hero />
        {/* AI Assistant section integrated into the main flow */}
        <section className="bg-black py-20 border-t border-zinc-800">
           <Scanner />
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default App
