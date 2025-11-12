

import React from 'react';
import SidekickAvatar from './SidekickAvatar.tsx';

const SidekickBuilder: React.FC = () => {
    return (
        <div>
            <h3 className="text-xl font-bold">Build Your Sidekick</h3>
            <SidekickAvatar />
            <p>Customize your AI helper.</p>
        </div>
    );
};

export default SidekickBuilder;