import { Router } from "express";
import { deleteRentals, insertRentals, selectRentals, updateRentalsById } from "../controllers/rentals.controller.js";
import { schemaValidation } from "../middlewares/schemaValidation.middleware.js";
import { rentalsSchema } from "../schemas/rentals.schema.js";

const rentalsRouter = Router();

rentalsRouter.get('/rentals', selectRentals);
rentalsRouter.post('/rentals', schemaValidation(rentalsSchema), insertRentals);
rentalsRouter.post('/rentals/:id/return', updateRentalsById);
rentalsRouter.delete('/rentals/:id', deleteRentals);

export default rentalsRouter;