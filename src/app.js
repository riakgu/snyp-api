import "dotenv/config";
import express from "express";

import authRoute from "./routes/auth.route.js";
import {errorMiddleware} from "./middlewares/error.middleware.js";
import {logger} from "./utils/logging.js";
import linkRoute from "./routes/link.route.js";

const app = express();
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/links", linkRoute);

app.use(errorMiddleware)

app.listen(3000, () => {
    logger.info("App started");
})

export default app;