import React, { useState } from 'react';
import { CLASSROOM_DATA } from '../data/teacherViewData.ts';
import { Student } from '../data/teacherViewData.ts';
import Timer from './Timer.tsx';
import StudentPod from './StudentPod.tsx';
import ProjectorView from './ProjectorView.tsx';
import EyesOnMeOverlay from './EyesOnMeOverlay.tsx';
import ReflectionsViewer from './ReflectionsViewer.tsx';

const TeacherControlPanel: React.FC = () => {
  const [students] = useState<Student[]>(CLASSROOM_DATA);
  const [projectingStudent, setProjectingStudent] = useState<Student | null>(null);
  const [isEyesOnMeActive, setIsEyesOnMeActive] = useState(false);
  const [isReflectionsOpen, setIsReflectionsOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-blue-600 mb-2">Teacher Control Panel</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">Manage your classroom's creative session.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Session Tools</h3>
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <Timer />
          <div className="flex gap-2 flex-wrap">
             <button
                onClick={() => setIsReflectionsOpen(true)}
                className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
             >
                View AI Lab Journals
             </button>
             <button
                onClick={() => setIsEyesOnMeActive(true)}
                className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors"
             >
                Eyes on Me
             </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Student Creations</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {students.map(student => (
            <StudentPod
              key={student.id}
              student={student}
              onProject={() => setProjectingStudent(student)}
            />
          ))}
        </div>
      </div>

      {projectingStudent && (
        <ProjectorView
          student={projectingStudent}
          onClose={() => setProjectingStudent(null)}
        />
      )}
      
      {isReflectionsOpen && (
        <ReflectionsViewer
          students={students}
          onClose={() => setIsReflectionsOpen(false)}
        />
      )}

      <EyesOnMeOverlay
        isActive={isEyesOnMeActive}
        onDismiss={() => setIsEyesOnMeActive(false)}
      />
    </div>
  );
};

export default TeacherControlPanel;