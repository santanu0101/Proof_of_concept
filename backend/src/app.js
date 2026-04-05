import express from "express";
import errorMiddleware from "./middlewares/error.middleware.js";
import router from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (_, res) => {
  res.send("Hello World!");
});

app.use("/api", router);

app.use(errorMiddleware);

export default app;
