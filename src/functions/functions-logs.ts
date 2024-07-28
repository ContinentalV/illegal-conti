import fs from 'fs';
import path from 'path';
import {cacheManager} from "../classes/CacheManager";

export function logRenfort(data: any) {
    const date = new Date();
    const timestamp = date.getTime();
    const humanReadableDate = date.toISOString().split('T')[0]; // format: YYYY-MM-DD

    const dirPath = path.join(__dirname, '..', 'logs', 'alert-renfort', humanReadableDate);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    const filePath = path.join(dirPath, 'renfortlogs.json');
    let logs = [];
    if (fs.existsSync(filePath)) {
        const existingLogs = fs.readFileSync(filePath, 'utf8');
        logs = JSON.parse(existingLogs);
    }

    const logEntry = {
        timestamp: timestamp,
        date: humanReadableDate,
        data: {...data.cacheData},

    };
    logs.push(logEntry);

    fs.writeFileSync(filePath, JSON.stringify(logs, null, 2), 'utf8');
}