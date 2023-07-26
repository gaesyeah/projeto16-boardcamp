import { Router } from "express";
import customersRouter from "./customers.routes.js";
import gamesRouter from "./games.routes.js";
import rentalsRouter from "./rentals.routes.js";

const indexRouter = Router();

indexRouter.use(customersRouter, gamesRouter, rentalsRouter);

export default indexRouter;