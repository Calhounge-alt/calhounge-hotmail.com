import React from 'react';
import { AvatarState } from '../types';

interface AvatarDisplayProps {
  avatarState: AvatarState;
  size?: 'small' | 'large';
}

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ avatarState, size = 'large' }) => {
  const baseSize = size === 'large' ? 'w-48 h-48' : 'w-12 h-12';
  const baseFontSize = size === 'large' ? 'text-8xl' : 'text-3xl';
  const itemSize = size === 'large' ? 'w-16 h-16' : 'w-6 h-6';
  const itemPosition = {
    hat: size === 'large' ? '-top-4' : '-top-1',
    accessory: size === 'large' ? 'bottom-8 right-0' : 'bottom-2 -right-1',
  };

  return (
    <div className={`relative ${baseSize} rounded-full flex items-center justify-center transition-all duration-300`}>
      {avatarState.background ? (
        <img src={avatarState.background.imageUrl} alt="Avatar background" className="absolute inset-0 w-full h-full rounded-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-blue-200 dark:bg-blue-800 rounded-full"></div>
      )}
      
      <div className={`relative ${baseFontSize}`}>
        🤖
      </div>

      {avatarState.hat && (
        <img src={avatarState.hat.imageUrl} alt="Hat" className={`absolute ${itemSize} ${itemPosition.hat}`} />
      )}
      {avatarState.accessory && (
        <img src={avatarState.accessory.imageUrl} alt="Accessory" className={`absolute ${itemSize} ${itemPosition.accessory}`} />
      )}
    </div>
  );
};

export default AvatarDisplay;
