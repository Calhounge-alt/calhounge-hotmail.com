import React, { useState, useEffect, useRef } from 'react';
import { playSound } from '../utils/soundUtils.ts';

interface AccessRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSoundEnabled: boolean;
}

const AccessRequestModal: React.FC<AccessRequestModalProps> = ({ isOpen, onClose, isSoundEnabled }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('teacher');
  const [organization, setOrganization] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const prevIsOpen = useRef(isOpen);

  useEffect(() => {
    if (isOpen && !prevIsOpen.current) {
        playSound('whoosh', isSoundEnabled);
    }
    prevIsOpen.current = isOpen;
  }, [isOpen, isSoundEnabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim() && message.trim()) {
      playSound('success', isSoundEnabled);
      setIsSubmitted(true);
      // In a real app, you'd send this data to a server.
      setTimeout(() => {
        onClose();
        // Reset state for next time
        setTimeout(() => {
            setIsSubmitted(false);
            setName('');
            setEmail('');
            setRole('teacher');
            setOrganization('');
            setMessage('');
        }, 500);
      }, 3000);
    }
  };

  const handleClose = () => {
    playSound('click', isSoundEnabled);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60] p-4" onClick={handleClose}>
      <div 
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-lg w-full transform transition-all animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {isSubmitted ? (
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">Request Sent!</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Thank you for your interest. We've received your request and will get back to you soon!
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">Request Access</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Please fill out the form below to request access for your class, family, or organization.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="req-name" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Full Name</label>
                  <input id="req-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700" />
                </div>
                <div>
                  <label htmlFor="req-email" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Email Address</label>
                  <input id="req-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="req-role" className="block text-sm font-bold text-gray-700 dark:text-gray-300">I am a...</label>
                  <select id="req-role" value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700">
                    <option value="teacher">Teacher</option>
                    <option value="parent">Parent</option>
                    <option value="student">Student</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="req-org" className="block text-sm font-bold text-gray-700 dark:text-gray-300">School / Organization (Optional)</label>
                  <input id="req-org" type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700" />
                </div>
              </div>
              <div>
                <label htmlFor="req-message" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Message</label>
                <textarea id="req-message" value={message} onChange={(e) => setMessage(e.target.value)} required placeholder="Tell us a bit about how you'd like to use Creativity & Code..." className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg h-24 dark:bg-gray-700"></textarea>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={handleClose} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400" disabled={!name || !email || !message}>
                  Submit Request
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AccessRequestModal;
