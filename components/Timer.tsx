import React, { useState, useEffect, useRef } from 'react';

const PRESET_TIMES = [
  { label: 'Story Time', minutes: 10 },
  { label: 'Art Time', minutes: 10 },
  { label: 'Music Time', minutes: 10 },
  { label: 'Reflection', minutes: 5 },
  { label: 'Custom 15min', minutes: 15 },
];

const Timer: React.FC = () => {
  const [time, setTime] = useState(PRESET_TIMES[0].minutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [initialTime, setInitialTime] = useState(PRESET_TIMES[0].minutes * 60);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive && time > 0) {
      intervalRef.current = window.setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      if(intervalRef.current) clearInterval(intervalRef.current);
      // Optional: Add an alert or sound
    }

    return () => {
      if(intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, time]);

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(initialTime);
  };

  const handlePresetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMinutes = parseInt(event.target.value, 10);
    const newTime = newMinutes * 60;
    setInitialTime(newTime);
    setTime(newTime);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-4 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
      <div className="font-mono text-4xl font-bold text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 px-4 py-2 rounded-md">
        {formatTime(time)}
      </div>
      <div className="flex flex-col gap-2">
         <select
            onChange={handlePresetChange}
            className="bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md px-2 py-1 text-sm font-semibold"
            aria-label="Select timer preset"
         >
            {PRESET_TIMES.map(preset => (
                <option key={preset.label} value={preset.minutes}>{preset.label}</option>
            ))}
         </select>
        <div className="flex gap-2">
          <button
            onClick={handleStartPause}
            className={`px-4 py-1.5 text-sm font-bold rounded-md ${
              isActive ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'
            }`}
          >
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button onClick={handleReset} className="px-4 py-1.5 text-sm font-bold bg-gray-500 text-white rounded-md">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timer;
