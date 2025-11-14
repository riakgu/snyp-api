import "dotenv/config";
import express from "express";
import authRoute from "./routes/auth.route.js";
import {errorMiddleware} from "./middlewares/error.middleware.js";
import linkRoute from "./routes/link.route.js";
import redirectRoute from "./routes/redirect.route.js";
import {createRateLimiter} from "./middlewares/rateLimiter.middleware.js";
import config from "./config/index.js";

const app = express();

app.use(express.json());

app.use('/api', createRateLimiter({
    limit: config.rateLimit.global.limit,
    windowSeconds: config.rateLimit.global.windowSeconds,
    keyPrefix: 'global',
}));

app.use('/api/auth/login', createRateLimiter({
    limit: config.rateLimit.auth.limit,
    windowSeconds: config.rateLimit.auth.windowSeconds,
    keyPrefix: 'auth',
}));

app.use("/api/auth", authRoute);
app.use("/api/links", linkRoute);
app.use('/', redirectRoute);

app.use(errorMiddleware)

export default app;