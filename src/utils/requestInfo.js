import { UAParser } from 'ua-parser-js';

export function getClientIp(req) {
    return req.headers['x-forwarded-for']?.split(',').shift()?.trim() ||
        req.socket.remoteAddress ||
        'unknown';
}

export function getUserAgent(req) {
    return req.headers['user-agent'] || 'unknown';
}

export function getReferrer(req) {
    return req.headers['referer'] || req.headers['referrer'] || null;
}

export function parseUserAgent(req) {
    const ua = getUserAgent(req);
    const { browser, os, device } = UAParser(ua);

    return {
        browser: browser.name || null,
        os: os.name || null,
        device: device.type || 'desktop',
    };
}