import React, { useState } from 'react';
import { SHOP_ITEMS } from '../data/shopItems.ts';
import { ShopItem, ShopCategory, AvatarState } from '../types.ts';
import AvatarDisplay from './AvatarDisplay.tsx';
import PurchaseConfirmationModal from './PurchaseConfirmationModal.tsx';
import { playSound } from '../utils/soundUtils.ts';

interface ShopScreenProps {
  onBackToHub: () => void;
  avatarState: AvatarState;
  coins: number;
  onPurchase: (item: ShopItem) => void;
  onEquip: (item: ShopItem) => void;
  purchasedItems: Set<number>;
  isSoundEnabled: boolean;
}

const ShopScreen: React.FC<ShopScreenProps> = ({ onBackToHub, avatarState, coins, onPurchase, onEquip, purchasedItems, isSoundEnabled }) => {
  const [activeTab, setActiveTab] = useState<ShopCategory>('hats');
  const [itemToBuy, setItemToBuy] = useState<ShopItem | null>(null);

  const filteredItems = SHOP_ITEMS.filter(item => item.category === activeTab);
  
  const handlePurchaseClick = (item: ShopItem) => {
    playSound('click', isSoundEnabled);
    if (coins >= item.price) {
      setItemToBuy(item);
    } else {
      playSound('error', isSoundEnabled);
      alert("You don't have enough coins!");
    }
  };

  const confirmPurchase = () => {
    if (itemToBuy) {
      onPurchase(itemToBuy);
      setItemToBuy(null);
    }
  };

  const isEquipped = (item: ShopItem) => {
    return (avatarState.hat?.id === item.id) || 
           (avatarState.accessory?.id === item.id) || 
           (avatarState.background?.id === item.id);
  };

  const handleTabClick = (cat: ShopCategory) => {
    playSound('click', isSoundEnabled);
    setActiveTab(cat);
  };

  const handleEquipClick = (item: ShopItem) => {
    playSound('click', isSoundEnabled);
    onEquip(item);
  };
  
  const handleBackToHub = () => {
    playSound('click', isSoundEnabled);
    onBackToHub();
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-blue-600 mb-2">Avatar Shop</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">Use your coins to customize your AI sidekick!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Avatar Display */}
        <div className="md:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center justify-center">
          <AvatarDisplay avatarState={avatarState} size="large" />
          <div className="mt-4 text-2xl font-bold text-yellow-500 flex items-center gap-2">
            <span>💰</span>
            <span>{coins}</span>
          </div>
        </div>

        {/* Shop Items */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex justify-center border-b border-gray-200 dark:border-gray-700 mb-4">
            {(['hats', 'accessories', 'backgrounds'] as ShopCategory[]).map(cat => (
              <button
                key={cat}
                onClick={() => handleTabClick(cat)}
                className={`capitalize px-6 py-3 font-semibold text-lg border-b-4 transition-colors ${
                  activeTab === cat ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto p-2">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center flex flex-col items-center">
                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 mb-2" />
                <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">{item.name}</p>
                {purchasedItems.has(item.id) ? (
                  <button 
                    onClick={() => handleEquipClick(item)}
                    disabled={isEquipped(item)}
                    className="mt-2 w-full text-sm font-bold py-1.5 rounded-md transition-colors bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-500"
                  >
                    {isEquipped(item) ? 'Equipped' : 'Equip'}
                  </button>
                ) : (
                  <button 
                    onClick={() => handlePurchaseClick(item)}
                    disabled={coins < item.price}
                    className="mt-2 w-full flex items-center justify-center gap-1 text-sm font-bold py-1.5 rounded-md transition-colors bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-400 dark:disabled:bg-gray-500"
                  >
                    <span>💰</span>
                    <span>{item.price}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center">
        <button 
          onClick={handleBackToHub}
          className="bg-gray-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-700 transition-all transform hover:scale-105"
        >
          Back to Hub
        </button>
      </div>

      <PurchaseConfirmationModal
        isOpen={!!itemToBuy}
        item={itemToBuy}
        onConfirm={confirmPurchase}
        onClose={() => setItemToBuy(null)}
        isSoundEnabled={isSoundEnabled}
      />
    </div>
  );
};

export default ShopScreen;