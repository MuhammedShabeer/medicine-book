import React from 'react';
import { BookOpen } from 'lucide-react';

const References = () => {
    const medicalReferences = [
        "UpToDate. Waltham (MA): Wolters Kluwer.",
        "Micromedex. Ann Arbor (MI): Merative.",
        "National Health Service. NHS medicines information. London: NHS.",
        "Cambridge University Hospitals NHS Foundation Trust. Cambridge: CUH.",
        "Royal Papworth Hospital NHS Foundation Trust. Cambridge: Papworth Hospital.",
        "Sanford Guide. The Sanford Guide to Antimicrobial Therapy. Sperryville (VA): Antimicrobial Therapy, Inc.",
        "TOXBASE. London: National Poisons Information Service.",
        "U.S. Food and Drug Administration. Drugs@FDA: FDA-approved drugs. Silver Spring (MD): FDA.",
        "National Library of Medicine. PubMed. Bethesda (MD): National Library of Medicine.",
        "Wolters Kluwer. Lexicomp. Philadelphia (PA): Wolters Kluwer.",
        "Pharmaceutical manufacturers. Product information and prescribing information.",
        "Electronic Medicines Compendium (emc). Medicines information and Summary of Product Characteristics. Datapharm Communications Ltd."
    ];

    const aiReferences = [
        "OpenAI. ChatGPT. San Francisco (CA): OpenAI.",
        "Anthropic. Claude. San Francisco (CA): Anthropic.",
        "Google. Gemini. Mountain View (CA): Google.",
        "Google. Google Antigravity. Mountain View (CA): Google.",
        "GitHub. GitHub Copilot. San Francisco (CA): GitHub.",
        "Cursor. Cursor AI Code Editor. San Francisco (CA): Anysphere, Inc.",
        "Lovable. Lovable AI software development platform. Stockholm: Lovable.",
        "Replit. Replit AI software development platform. San Francisco (CA): Replit.",
        "FlutterFlow. FlutterFlow AI application development platform. Austin (TX): FlutterFlow.",
        "StackBlitz. Bolt.new: AI-powered application development platform. San Francisco (CA): StackBlitz."
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
            <div className="max-w-5xl w-full bg-white dark:bg-slate-800 rounded-3xl shadow-sm p-8 sm:p-16 text-center border border-slate-100 dark:border-slate-700">

                {/* Top Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-[#1a5f54] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#1a5f54]/20 transform rotate-3">
                        <div className="-rotate-3">
                            <BookOpen size={28} />
                        </div>
                    </div>
                </div>

                <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                    References
                </h1>

                <p className="text-[#1a5f54] dark:text-[#2a9d8f] font-medium text-lg mb-8">
                    Foundational Resources & Technologies
                </p>

                <div className="space-y-4 text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                    <p className="font-bold text-slate-900 dark:text-slate-100">
                        Built upon authoritative intelligence and modern innovation.
                    </p>
                    <p>
                        The comprehensive data and robust architecture of this application stand as a testament to the rigorous <span className="font-bold text-slate-900 dark:text-slate-100">clinical databases, medical literature, and advanced AI platforms</span> that guided its development.
                    </p>
                </div>

                {/* Highlight Box */}
                <div className="bg-[#edf6f2] dark:bg-[#1a5f54]/10 rounded-2xl p-8 mb-12">
                    <p className="font-bold text-slate-900 dark:text-white mb-2 text-lg">
                        A Synthesis of Medicine and Technology
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                        By bridging evidence-based pharmacological resources with state-of-the-art artificial intelligence models, this endeavour achieves a new standard of accessible medical information.
                    </p>
                </div>

                {/* Medical References Section */}
                <div className="mb-14">
                    <h3 className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-6">
                        Clinical & Pharmaceutical References
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                        {medicalReferences.map((ref, index) => (
                            <div
                                key={index}
                                className="px-5 py-3 bg-[#fdf3e7] dark:bg-[#d49a5b]/20 text-[#965d22] dark:text-[#f3ca7e] rounded-2xl text-sm font-semibold shadow-sm leading-snug"
                            >
                                {ref}
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI & Dev References Section */}
                <div className="mb-12">
                    <h3 className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-6">
                        AI & Application Development Platforms
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left max-w-5xl mx-auto">
                        {aiReferences.map((ref, index) => (
                            <div
                                key={index}
                                className="px-5 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl text-sm font-medium shadow-sm leading-snug"
                            >
                                {ref}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="pt-10 border-t border-dashed border-slate-200 dark:border-slate-700 mt-12 max-w-2xl mx-auto">
                    <p className="italic text-slate-800 dark:text-slate-200 font-medium mb-10 leading-relaxed text-lg">
                        Ensuring accuracy and cutting-edge functionality through rigorous source validation and modern development practices.
                    </p>
                    <p className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                        HGH Pharmacy
                    </p>
                </div>

            </div>
        </div>
    );
};

export default References;