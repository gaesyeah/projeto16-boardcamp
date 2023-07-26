import { Router } from "express";
import { insertGames, selectGames } from "../controllers/games.controller.js";
import { schemaValidation } from "../middlewares/schemaValidation.middleware.js";
import { gamesSchema } from "../schemas/games.schemas.js";

const gamesRouter = Router();

gamesRouter.get('/games', selectGames);
gamesRouter.post('/games', schemaValidation(gamesSchema), insertGames);

export default gamesRouter;