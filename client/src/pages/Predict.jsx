import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Upload, Loader2, AlertCircle, Mic, StopCircle } from 'lucide-react';

const LANGUAGES = [
    { code: 'en-US', name: 'English' },
    { code: 'hi-IN', name: 'Hindi (हिंदी)' },
    { code: 'kn-IN', name: 'Kannada (ಕನ್ನಡ)' },
    { code: 'ta-IN', name: 'Tamil (தமிழ்)' },
    { code: 'te-IN', name: 'Telugu (తెలుగు)' },
    { code: 'mr-IN', name: 'Marathi (मराठी)' },
    { code: 'bn-IN', name: 'Bengali (বাংলা)' },
    { code: 'gu-IN', name: 'Gujarati (ગુજરાતી)' },
];

const Predict = () => {
    const [symptoms, setSymptoms] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [language, setLanguage] = useState('en-US');

    // Voice Recognition Ref
    const recognitionRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
        }
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            setError('Voice recognition not supported in this browser. Try Chrome/Edge.');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            setError('');
            recognitionRef.current.lang = language;
            recognitionRef.current.start();
            setIsListening(true);

            recognitionRef.current.onresult = (event) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    setSymptoms(prev => prev + (prev ? ' ' : '') + finalTranscript);
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                if (event.error === 'not-allowed') {
                    setError('Microphone permission denied.');
                }
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!symptoms && !image) {
            setError('Please provide at least symptoms or an image.');
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('symptoms', symptoms);
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await axios.post('/api/predict', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/results', { state: { result: response.data } });
        } catch (err) {
            console.error(err);
            setError('Failed to process prediction. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-800">Analyze Symptoms</h1>

                {/* Language Selector */}
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="p-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary outline-none"
                    disabled={isListening}
                >
                    {LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                </select>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Symptoms Input */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="block text-sm font-semibold text-slate-700">Describe Symptoms</label>

                            {/* Mic Button */}
                            <button
                                type="button"
                                onClick={toggleListening}
                                className={`flex items-center space-x-1 text-sm font-semibold px-3 py-1 rounded-full transition ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                {isListening ? <><StopCircle size={16} /> <span>Stop Listening</span></> : <><Mic size={16} /> <span>Voice Input</span></>}
                            </button>
                        </div>

                        <textarea
                            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition h-32 resize-none bg-slate-50"
                            placeholder={isListening ? "Listening..." : "Type here or use voice input (e.g. 'High fever, blisters')..."}
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                        />
                        <p className="text-xs text-slate-400 mt-1">* Voice input supports multiple Indian languages. Select from top right.</p>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Image/Video (Optional)</label>
                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition relative cursor-pointer">
                            <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                accept="image/*,video/*"
                                onChange={handleImageChange}
                            />
                            {preview ? (
                                <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                            ) : (
                                <div className="flex flex-col items-center text-slate-500">
                                    <Upload size={32} className="mb-2" />
                                    <p>Click or drag to upload</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center text-red-600 bg-red-50 p-4 rounded-lg">
                            <AlertCircle size={20} className="mr-2" />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition flex justify-center items-center ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-emerald-600'}`}
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" /> : 'Run Diagnosis'}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default Predict;
