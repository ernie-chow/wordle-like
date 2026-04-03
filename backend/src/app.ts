import express from "express";
import cors from "cors";
import gameRouter from "./routes/game.routes";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/game", gameRouter);

export default app;