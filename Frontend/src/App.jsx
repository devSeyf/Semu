import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Scanner from "./components/ui/Scanner";
import AddProduct from "./components/sections/AddProduct";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Scanner />} />
        <Route path="/add-product" element={<AddProduct />} />
      </Routes>
    </Router>
  );
}
export default App; 