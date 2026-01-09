import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Activity } from 'lucide-react';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
            <h1 className="text-5xl font-extrabold text-slate-800 leading-tight">
                Protect Your Livestock <br />
                <span className="text-primary">With AI-Powered Diagnostics</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl">
                Immediate disease prediction and vet-verified treatment recommendations for farmers and veterinarians.
                Identify symptoms early and ensure the health of your animals.
            </p>

            <div className="flex space-x-4">
                <Link to="/predict" className="bg-primary hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold shadow-md flex items-center transition transform hover:-translate-y-1">
                    Start Diagnosis <ArrowRight className="ml-2" size={20} />
                </Link>
                <button className="bg-white border md:border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-3 rounded-full font-semibold shadow-sm transition">
                    Learn More
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-12 w-full max-w-4xl text-left">
                <FeatureCard
                    icon={<Activity className="text-primary" size={32} />}
                    title="Real-time Analysis"
                    desc="Upload specific symptoms or images to get an instant potential diagnosis."
                />
                <FeatureCard
                    icon={<ShieldCheck className="text-primary" size={32} />}
                    title="Verified Treatments"
                    desc="Access a database of treatments and home care advice verified by experts."
                />
                <FeatureCard
                    icon={<ArrowRight className="text-primary" size={32} />} // Placeholder icon
                    title="Expert Connect"
                    desc="Escalate complex cases to virtual veterinary consultations immediately."
                />
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-500">{desc}</p>
    </div>
);

export default Home;
