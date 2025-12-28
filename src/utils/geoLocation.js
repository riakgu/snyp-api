export async function getGeoLocation(ip) {
    try {
        if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.')) {
            return { country: null, city: null };
        }

        const response = await fetch(`http://ip-api.com/json/${ip}?fields=country,city`);
        const data = await response.json();

        if (data.status === 'fail') {
            return { country: null, city: null };
        }

        return {
            country: data.country || null,
            city: data.city || null,
        };
    } catch (err) {
        return { country: null, city: null };
    }
}