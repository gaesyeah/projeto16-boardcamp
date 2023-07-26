import { Router } from "express";
import { insertCustomers, selectCustomers, selectCustomersById, updateCustomers } from "../controllers/customer.controller.js";
import { schemaValidation } from "../middlewares/schemaValidation.middleware.js";
import { customersSchema } from "../schemas/customers.schema.js";

const customersRouter = Router();

customersRouter.get('/customers', selectCustomers);
customersRouter.get('/customers/:id', selectCustomersById);
customersRouter.post('/customers', schemaValidation(customersSchema), insertCustomers);
customersRouter.put('/customers/:id', schemaValidation(customersSchema), updateCustomers);

export default customersRouter;

