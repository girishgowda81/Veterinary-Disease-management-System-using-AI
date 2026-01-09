import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Phone, Home as House, Pill } from 'lucide-react';

const Results = () => {
    const location = useLocation();
    const result = location.state?.result;

    if (!result) {
        return (
            <div className="text-center mt-20">
                <h2 className="text-2xl font-bold text-slate-700">No result data found.</h2>
                <Link to="/predict" className="text-primary hover:underline mt-4 inline-block">Go back to diagnosis</Link>
            </div>
        );
    }

    const { disease, confidence, treatments } = result;

    // Determine color based on severity
    // We didn't send 'severity' explicitly in the JSON structure in previous steps?
    // Wait, the aiService.js sends 'disease' object which has 'severity'.
    const isSevere = disease.severity?.toLowerCase() === 'high';
    const severityColor = isSevere ? 'text-red-600 bg-red-50' : (disease.severity === 'Medium' ? 'text-orange-600 bg-orange-50' : 'text-green-600 bg-green-50');

    return (
        <div className="max-w-4xl mx-auto space-y-8 fade-in">
            {/* Disease Header */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Diagnosis Result</span>
                    <h1 className="text-3xl font-extrabold text-slate-900 mt-1">{disease.name}</h1>
                    <p className="text-slate-500 mt-2 max-w-xl">{disease.description}</p>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                    <div className={`px-4 py-2 rounded-lg font-bold inline-block mb-2 ${severityColor}`}>
                        Severity: {disease.severity}
                    </div>
                    <div className="text-sm text-slate-500">
                        Confidence: <span className="font-semibold text-slate-800">{(confidence * 100).toFixed(1)}%</span>
                    </div>
                </div>
            </div>

            {/* Warning for high severity */}
            {isSevere && (
                <div className="bg-red-600 text-white p-6 rounded-xl shadow-lg flex items-start">
                    <AlertTriangle className="mr-4 flex-shrink-0" size={32} />
                    <div>
                        <h3 className="font-bold text-xl">Vet Attention Required</h3>
                        <p className="opacity-90 mt-1">This condition is classified as high severity. Immediate professional veterinary intervention is recommended.</p>
                        <button className="mt-4 bg-white text-red-600 px-6 py-2 rounded-lg font-bold hover:bg-red-50 transition">
                            Connect with Vet Now
                        </button>
                    </div>
                </div>
            )}

            {/* Treatments */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Recommended Treatments</h2>
                <div className="space-y-4">
                    {treatments.map((t, idx) => (
                        <div key={idx} className="flex items-start p-4 rounded-xl border border-slate-100 hover:border-primary/30 transition">
                            <div className="mr-4 mt-1">
                                {t.type === 'Home Care' && <House className="text-green-500" />}
                                {t.type === 'Medication' && <Pill className="text-blue-500" />}
                                {t.type === 'Vet Required' && <Phone className="text-red-500" />}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-lg">{t.type}</h4>
                                <p className="text-slate-600">{t.treatment_text}</p>
                            </div>
                        </div>
                    ))}
                    {treatments.length === 0 && <p>No specific treatments found.</p>}
                </div>
            </div>

            <div className="text-center pt-8 border-t border-slate-200">
                <Link to="/predict" className="text-slate-500 hover:text-primary font-semibold transition">
                    &larr; Start New Diagnosis
                </Link>
            </div>
        </div>
    );
};

export default Results;
