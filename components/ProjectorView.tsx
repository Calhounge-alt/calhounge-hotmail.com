import React from 'react';
import { Student } from '../data/teacherViewData';

interface ProjectorViewProps {
  student: Student;
  onClose: () => void;
}

const ProjectorView: React.FC<ProjectorViewProps> = ({ student, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 max-w-4xl w-full h-full max-h-[90vh] flex flex-col md:flex-row gap-6 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute -top-3 -right-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-full h-10 w-10 flex items-center justify-center shadow-lg text-2xl font-bold z-10"
          aria-label="Close projector view"
        >
          &times;
        </button>

        {/* Image Column */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
          {student.imageUrl ? (
            <img src={student.imageUrl} alt={`Artwork by ${student.name}`} className="w-full h-full object-contain rounded-md" />
          ) : (
             <div className="text-gray-500">No Image Created</div>
          )}
        </div>

        {/* Story Column */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col">
           <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex-shrink-0">
                Creation by <span className="underline">{student.name}</span>
           </h2>
          <div className="overflow-y-auto pr-2 flex-grow">
            <p className="text-lg text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {student.storyText || "This student is still writing their story..."}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProjectorView;
