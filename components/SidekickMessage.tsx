
import React from 'react';

interface SidekickMessageProps {
    message: string;
}

const SidekickMessage: React.FC<SidekickMessageProps> = ({ message }) => {
    return (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 my-4 rounded-r-lg" role="alert">
            <p className="font-bold">Sidekick Says:</p>
            <p>{message}</p>
        </div>
    );
};

export default SidekickMessage;
