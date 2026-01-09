import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Predict from './pages/Predict';
import Results from './pages/Results';

function App() {
    return (
        <Router>
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/predict" element={<Predict />} />
                        <Route path="/results" element={<Results />} />
                    </Routes>
                </main>
                <footer className="bg-secondary text-white py-4 text-center mt-auto">
                    <p>&copy; 2024 AI Veterinary Support. Helping Farmers & Animals.</p>
                </footer>
            </div>
        </Router>
    );
}

export default App;
