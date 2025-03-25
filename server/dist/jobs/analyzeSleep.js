import { executePythonScript } from './executePython.js';
export const executeAnalyzeSleep = (side, startTime, endTime) => {
    return executePythonScript({
        script: '/home/dac/free-sleep/biometrics/sleep_detection/analyze_sleep.py',
        args: [
            `--side=${side}`,
            `--start_time=${startTime}`,
            `--end_time=${endTime}`
        ],
    });
};
