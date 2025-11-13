import "dotenv/config";
import express from "express";
import authRoute from "./routes/auth.route.js";
import {errorMiddleware} from "./middlewares/error.middleware.js";
import linkRoute from "./routes/link.route.js";
import redirectRoute from "./routes/redirect.route.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/links", linkRoute);
app.use('/', redirectRoute);

app.use(errorMiddleware)

export default app;