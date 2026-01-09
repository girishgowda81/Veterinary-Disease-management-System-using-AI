import { Link } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="bg-primary shadow-lg text-white">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
                    <Stethoscope size={28} />
                    <span>VetAI Predict</span>
                </Link>
                <div className="space-x-6 hidden md:flex">
                    <Link to="/" className="hover:text-green-100 transition">Home</Link>
                    <Link to="/predict" className="hover:text-green-100 transition">Analyze Symptom</Link>
                    <Link to="/about" className="hover:text-green-100 transition">About</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
