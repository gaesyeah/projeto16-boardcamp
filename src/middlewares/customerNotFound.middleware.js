import { db } from "../database/database.js";

export const customerNotFound = async (req, res, next) => {
  const { id } = req.params;
  const { customerId } = req.body;
  try {
    const { rowCount } = await db.query(`
      SELECT * FROM customers 
      WHERE id = $1 OR id = $2
      ;`, [id, customerId]
    );
    if (rowCount === 0) {
      if (customerId) return res.sendStatus(400);
      return res.sendStatus(404);
    }

    next();
  } catch ({ message }) {
    res.status(500).send(message);
  }
};