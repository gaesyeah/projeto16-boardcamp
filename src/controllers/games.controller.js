import { db } from "../database/database.js";

export const selectGames = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM games;');
    res.send(rows);
  } catch ({ message }) {
    res.status(500).send(message);
  }
};

export const insertGames = async (req, res) => {
  const { name, image, stockTotal, pricePerDay } = req.body;
  try {
    const { rowCount } = await db.query('SELECT * FROM games WHERE name = $1', [name]);
    if (rowCount > 0) return res.sendStatus(409);

    await db.query(`
      INSERT INTO games (name, image, "stockTotal", "pricePerDay") 
      VALUES ($1, $2, $3, $4)
      ;` , [name, image, stockTotal, pricePerDay]
    );
    res.sendStatus(201);
  } catch ({ message }) {
    res.status(500).send(message);
  }
};