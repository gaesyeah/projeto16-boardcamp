import { db } from "../database/database.js";

export const rentalNotFound = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { rowCount } = await db.query('SELECT * FROM rentals WHERE id = $1', [id]);
    if (rowCount === 0) return res.sendStatus(404);
    next();
  } catch ({ message }) {
    res.status(500).send(message);
  }
};

export const rentalReturnDate = (type) => {
  return async (req, res, next) => {
    const { id } = req.params;
    try {
      const { rows } = await db.query('SELECT "returnDate" FROM rentals WHERE id = $1;', [id]);

      if (type === 'update') if (rows[0].returnDate !== null) return res.sendStatus(400);

      if (type === 'delete') if (rows[0].returnDate === null) return res.sendStatus(400);
      
      next();
    } catch ({ message }) {
      res.status(500).send(message);
    }
  }
};