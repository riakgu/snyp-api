const config = {
    app: {
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV,
        backendUrl: process.env.BACKEND_URL,
        frontendUrl: process.env.FRONTEND_URL,
    },

    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
    },

    rabbitMQ: {
        url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
        queues: {
            stats: 'stats',
        },
    },

    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        accessExpire: process.env.JWT_ACCESS_EXPIRE || '1d',
        refreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d',
    },

    rateLimit: {
        global: {
            limit: 100,
            windowSeconds: 60,
        },
        auth: {
            limit: 5,
            windowSeconds: 300,
        },
    },
};

export default config;
