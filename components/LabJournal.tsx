import React from 'react';

interface LabJournalProps {
  icon: string;
  title: string;
  question: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const LabJournal: React.FC<LabJournalProps> = ({ icon, title, question, value, onChange, placeholder }) => {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 space-y-2 animate-fade-in-up">
      <h4 className="text-lg font-bold text-gray-700 dark:text-gray-100 flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        {title}
      </h4>
      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">{question}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg h-28 focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-200"
        aria-label={title}
      />
    </div>
  );
};

export default LabJournal;
