const config = {
    app: {
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
        port: process.env.PORT,
        env: process.env.NODE_ENV,
        baseUrl: process.env.BASE_URL,
    },

    redis: {
        url: process.env.REDIS_URL,
    },

    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        accessExpire: process.env.JWT_ACCESS_EXPIRE,
        refreshExpire: process.env.JWT_REFRESH_EXPIRE,
    },
};

export default config;
