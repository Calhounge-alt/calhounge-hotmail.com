import React, { useEffect, useRef } from 'react';
import { ShopItem } from '../types.ts';
import { playSound } from '../utils/soundUtils.ts';

interface PurchaseConfirmationModalProps {
  isOpen: boolean;
  item: ShopItem | null;
  onConfirm: () => void;
  onClose: () => void;
  isSoundEnabled: boolean;
}

const PurchaseConfirmationModal: React.FC<PurchaseConfirmationModalProps> = ({ isOpen, item, onConfirm, onClose, isSoundEnabled }) => {
  const prevIsOpen = useRef(isOpen);

  useEffect(() => {
    if (isOpen && !prevIsOpen.current) {
        playSound('whoosh', isSoundEnabled);
    }
    prevIsOpen.current = isOpen;
  }, [isOpen, isSoundEnabled]);

  if (!isOpen || !item) return null;

  const handleConfirm = () => {
    playSound('purchase', isSoundEnabled);
    onConfirm();
  };

  const handleClose = () => {
    playSound('click', isSoundEnabled);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={handleClose}>
      <div 
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-sm w-full text-center transform transition-all animate-fade-in-up" 
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">Confirm Purchase</h2>
        <img src={item.imageUrl} alt={item.name} className="w-24 h-24 mx-auto my-4" />
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Are you sure you want to buy <strong className="text-gray-900 dark:text-white">{item.name}</strong> for <strong className="text-yellow-600 dark:text-yellow-400">{item.price} 💰</strong>?
        </p>
        
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={handleClose}
            className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 font-bold py-3 px-8 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700"
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseConfirmationModal;