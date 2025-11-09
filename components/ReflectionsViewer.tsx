import React from 'react';
import { Student } from '../data/teacherViewData';

interface ReflectionsViewerProps {
  students: Student[];
  onClose: () => void;
}

const ReflectionsViewer: React.FC<ReflectionsViewerProps> = ({ students, onClose }) => {

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #print-section, #print-section * {
              visibility: visible;
            }
            #print-section {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .no-print {
              display: none;
            }
          }
        `}
      </style>
      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div 
            id="print-section"
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 max-w-4xl w-full h-full max-h-[90vh] flex flex-col animate-fade-in-up" 
            onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-4 no-print">
            <div>
                 <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400">AI Lab Journals</h2>
                 <p className="text-gray-600 dark:text-gray-300">A collection of student reflections.</p>
            </div>
            <button 
                onClick={onClose} 
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 text-3xl font-bold"
                aria-label="Close reflections viewer"
            >
                &times;
            </button>
          </div>

          <div className="overflow-y-auto flex-grow pr-2">
            <div className="space-y-6">
              {students.map(student => (
                <div key={student.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{student.name}'s Journal</h3>
                  <div className="mt-3 space-y-3 text-sm text-gray-700 dark:text-gray-300">
                    <div>
                      <h4 className="font-semibold text-gray-500 dark:text-gray-400">📓 Story Reflection</h4>
                      <p className="pl-4 italic border-l-2 border-gray-200 dark:border-gray-600 ml-2 mt-1">
                        {student.journalEntries.story || "No entry yet."}
                      </p>
                    </div>
                     <div>
                      <h4 className="font-semibold text-gray-500 dark:text-gray-400">📝 Art Reflection</h4>
                      <p className="pl-4 italic border-l-2 border-gray-200 dark:border-gray-600 ml-2 mt-1">
                        {student.journalEntries.art || "No entry yet."}
                      </p>
                    </div>
                     <div>
                      <h4 className="font-semibold text-gray-500 dark:text-gray-400">🎶 Music Reflection</h4>
                      <p className="pl-4 italic border-l-2 border-gray-200 dark:border-gray-600 ml-2 mt-1">
                        {student.journalEntries.music || "No entry yet."}
                      </p>
                    </div>
                     <div>
                      <h4 className="font-semibold text-gray-500 dark:text-gray-400">🤔 Final Reflection</h4>
                      <p className="pl-4 italic border-l-2 border-gray-200 dark:border-gray-600 ml-2 mt-1">
                        {student.journalEntries.reflection || "No entry yet."}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 text-right border-t border-gray-200 dark:border-gray-700 pt-4 no-print">
            <button
              onClick={handlePrint}
              className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors"
            >
              Export All to PDF
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReflectionsViewer;
