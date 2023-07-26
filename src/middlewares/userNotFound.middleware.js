import { db } from "../database/database.js";

export const userNotFound = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { rowCount } = await db.query('SELECT * FROM customers WHERE id = $1', [id]);
    if (rowCount === 0) return res.sendStatus(404);

    next();
  } catch ({ message }) {
    res.status(500).send(message);
  }
};