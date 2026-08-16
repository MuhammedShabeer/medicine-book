import React from 'react';
import { Users } from 'lucide-react';

const Acknowledgements = () => {
  const doctors = [
    "Dr. Sheeba", "Dr. Asral", "Dr. Hasna", "Dr. Jamshad", "Dr. Anju", 
    "Dr. Ola", "Dr. Oday", "Dr. Reem", "Dr. Sayed Hammad", "Dr. Mostafa"
  ];

  const colleagues = [
    "Aboobaker", "Ali", "Arif", "Asif", "Azeez", "Divakar Sigh", "Fatima", 
    "Haneef", "Irshad", "Kuriakose", "Mahsheed", "Moinudeen", "Mujeeb", 
    "Mustafa", "Navas", "Raleena", "Safeer", "Sanjay Salunke", "Shaheen", 
    "Shanavas", "Soniya", "Verappu"
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      <div className="max-w-4xl w-full bg-white dark:bg-slate-800 rounded-3xl shadow-sm p-8 sm:p-16 text-center border border-slate-100 dark:border-slate-700">
        
        {/* Top Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#1a5f54] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#1a5f54]/20 transform rotate-3">
            <div className="-rotate-3">
              <Users size={28} />
            </div>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
          Acknowledgment
        </h1>

        <p className="text-[#1a5f54] dark:text-[#2a9d8f] font-medium text-lg mb-8">
          Quintessentially conceived and sculpted by Sayyid Muhummed S.
        </p>

        <div className="space-y-4 text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          <p className="font-bold text-slate-900 dark:text-slate-100">
            With gratitude to the Almighty and to my family.
          </p>
          <p>
            By His clemency, although my name graces this application as its creator, its fruition stands as a testament to the collective <span className="font-bold text-slate-900 dark:text-slate-100">erudition, dedication, and benevolence</span> of many distinguished team members.
          </p>
        </div>

        {/* Highlight Box */}
        <div className="bg-[#edf6f2] dark:bg-[#1a5f54]/10 rounded-2xl p-8 mb-12">
          <p className="font-bold text-slate-900 dark:text-white mb-2 text-lg">
            Grateful to, Dr. Mona Abdulla Alkhater,
          </p>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Executive Director of HGH Pharmacy, whose visionary leadership and openness to innovation provided the impetus for this endeavour.
          </p>
        </div>

        {/* Special Thanks Section */}
        <div className="mb-12">
          <h3 className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-4">
            Special Thanks To
          </h3>
          <p className="font-bold text-slate-900 dark:text-white mb-6">
            Dr. Ayman Mohd Hassan Abou Juaiter, Dr.Emad Omaer Abu Nahla, and colleagues:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {doctors.map((doctor, index) => (
              <span 
                key={index}
                className="px-5 py-2 bg-[#fdf3e7] dark:bg-[#d49a5b]/20 text-[#965d22] dark:text-[#f3ca7e] rounded-full text-sm font-semibold shadow-sm"
              >
                {doctor}
              </span>
            ))}
          </div>
        </div>

        {/* Appreciation Section */}
        <div className="mb-12">
          <h3 className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-6">
            With Appreciation To:
          </h3>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {colleagues.map((colleague, index) => (
              <span 
                key={index}
                className="px-5 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-full text-sm font-medium shadow-sm"
              >
                {colleague}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-10 border-t border-dashed border-slate-200 dark:border-slate-700 mt-12 max-w-2xl mx-auto">
          <p className="italic text-slate-800 dark:text-slate-200 font-medium mb-10 leading-relaxed text-lg">
            This work embodies not merely an individual pursuit, but a confluence of shared intellect, innovation, and dedication to excellence.
          </p>
          <p className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
            HGH Pharmacy
          </p>
        </div>

      </div>
    </div>
  );
};

export default Acknowledgements;
