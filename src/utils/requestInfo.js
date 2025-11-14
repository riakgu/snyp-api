export function getClientIp(req) {
    return req.headers['x-forwarded-for']?.split(',').shift()?.trim() ||
        req.socket.remoteAddress ||
        'unknown';
}

export function getUserAgent(req) {
    return req.headers['user-agent'] || 'unknown';
}