import express from 'express';
import cors from 'cors';
import logger from '../logger.js';
import os from 'os';
function getLocalIp() {
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
        const networkInterface = interfaces[interfaceName];
        if (!networkInterface)
            continue;
        for (const network of networkInterface) {
            if (network.family === 'IPv4' && !network.internal) {
                return network.address;
            }
        }
    }
    return 'localhost'; // Default to localhost if LAN IP isn't found
}
export default function (app) {
    app.use((req, res, next) => {
        const startTime = Date.now();
        // Hook into the response `finish` event to log after the response is sent
        res.on('finish', () => {
            const duration = Date.now() - startTime;
            logger.info(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
        });
        next();
    });
    app.use(express.json());
    // Allow local development
    app.use(cors({
        origin: (origin, callback) => {
            callback(null, true);
        }
    }));
    // Logging
    app.use((req, res, next) => {
        const clientIp = req.headers['x-forwarded-for'] || req.ip;
        const method = req.method;
        const endpoint = req.originalUrl;
        logger.debug(`${method} ${endpoint} - IP: ${clientIp}`);
        next();
    });
}
