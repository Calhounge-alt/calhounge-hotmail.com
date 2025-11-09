import React from 'react';
import { Student } from '../data/teacherViewData';
import { ProgressStep } from '../types';

interface StudentPodProps {
  student: Student;
  onProject: () => void;
}

const ALL_STEPS: ProgressStep[] = ['story', 'art', 'music', 'reflection'];

const StudentPod: React.FC<StudentPodProps> = ({ student, onProject }) => {
  const progressPercent = (student.progress.size / ALL_STEPS.length) * 100;

  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 space-y-3 flex flex-col">
      <div className="flex-grow space-y-3">
        <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100 truncate">{student.name}</h4>
        <div className="aspect-square w-full bg-gray-200 dark:bg-gray-600 rounded-md overflow-hidden">
          {student.imageUrl ? (
            <img src={student.imageUrl} alt={`Artwork by ${student.name}`} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image Yet</div>
          )}
        </div>
        <div>
           <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Progress</span>
           <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-2 w-full mt-1">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
        </div>
      </div>
      <button
        onClick={onProject}
        className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors mt-2"
      >
        Project
      </button>
    </div>
  );
};

export default StudentPod;
