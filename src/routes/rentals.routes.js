import { Router } from "express";
import { deleteRentalsById, insertRentals, selectRentals, updateRentalsById } from "../controllers/rentals.controller.js";
import { customerNotFound } from "../middlewares/customerNotFound.middleware.js";
import { rentalNotFound, rentalReturnDate } from "../middlewares/rentalNotFound.middleware.js";
import { schemaValidation } from "../middlewares/schemaValidation.middleware.js";
import { rentalsSchema } from "../schemas/rentals.schema.js";

const rentalsRouter = Router();

rentalsRouter.get('/rentals', selectRentals);
rentalsRouter.post('/rentals', customerNotFound, schemaValidation(rentalsSchema), insertRentals);
rentalsRouter.post('/rentals/:id/return', rentalNotFound, rentalReturnDate('update'), updateRentalsById);
rentalsRouter.delete('/rentals/:id', rentalNotFound, rentalReturnDate('delete'), deleteRentalsById);

export default rentalsRouter;