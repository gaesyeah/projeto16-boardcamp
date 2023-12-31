import { db } from "../database/database.js";

export const selectRentals = async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT rentals.*,
        JSON_BUILD_OBJECT('id', customers.id, 'name', customers.name) AS customer,
        JSON_BUILD_OBJECT('id', games.id, 'name', games.name) AS game,
        TO_CHAR("returnDate", \'YYYY-MM-DD\') AS "returnDate",
        TO_CHAR("rentDate", \'YYYY-MM-DD\') AS "rentDate"
      FROM rentals 
      JOIN customers ON rentals."customerId" = customers.id
      JOIN games ON rentals."gameId" = games.id
      ;`)
    ;
    res.send(rows);
  } catch ({ message }) {
    res.status(500).send(message);
  }
};

export const insertRentals = async (req, res) => {
  const { customerId, gameId, daysRented } = req.body;
  try {    
    const { rows, rowCount } = await db.query(`
      SELECT "pricePerDay", "stockTotal"
      FROM games
      WHERE "id" = $1
      ;`, [gameId]
    );
    if (rowCount === 0) return res.sendStatus(400);

    const client = await db.query(`
      SELECT *
      FROM customers
      WHERE "id" = $1
    ;`, [customerId])
    if (client.rowCount === 0) return res.sendStatus(400);

    const rentalsFromGameId = await db.query(`
      SELECT "returnDate"
      FROM RENTALS
      WHERE "gameId" = $1 AND "returnDate" IS NULL
      ;`, [gameId]
    );
    if (rentalsFromGameId.rowCount >= rows[0].stockTotal) return res.sendStatus(400);

    await db.query(`
      INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "originalPrice")
      VALUES ($1, $2, NOW(), $3, $4)
      ;`, [customerId, gameId, daysRented, daysRented*rows[0].pricePerDay]
    );
    res.sendStatus(201);
  } catch ({ message }) {
    res.status(500).send(message);
  }
};

export const updateRentalsById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query(`
      SELECT "gameId", "rentDate", "daysRented" 
      FROM rentals 
      WHERE id = $1
      ;`, [id]
    );
    
    //hoje - dia que aluguei (ex: 27 - 20 = 7)
    const delay = Math.floor((new Date() - rows[0].rentDate) / (1000 * 60 * 60 * 24));
    let delayFee = null;
    //se o delay for maior que o dia que eu deveria ter entregado (ex: 7 > 5; 7 - 5 = 2)
    if (delay > rows[0].daysRented){
      const game = await db.query(`SELECT "pricePerDay" FROM games WHERE id = ${rows[0].gameId}`);
      delayFee = game.rows[0].pricePerDay * (delay - rows[0].daysRented);
    }

    await db.query(`
      UPDATE rentals 
      SET "returnDate" = NOW(), "delayFee" = ${delayFee} 
      WHERE id = $1
      ;`, [id]
    );
    res.sendStatus(200);
  } catch ({ message }) {
    res.status(500).send(message);
  }
};

export const deleteRentalsById = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM rentals WHERE id = $1;', [id]);
    res.sendStatus(200);
  } catch ({ message }) {
    res.status(500).send(message);
  }
};





