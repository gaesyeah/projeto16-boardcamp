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
      JOIN games ON  rentals."gameId" = games.id
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
    if (daysRented <= 0) return res.sendStatus(400);

    const { rows, rowCount } = await db.query('SELECT * FROM games WHERE id = $1;', [gameId]);
    if (rowCount === 0 || daysRented > rows[0].stockTotal) return res.sendStatus(400);

    const daysRentedFromGameId = await db.query('SELECT "daysRented", "returnDate" FROM rentals WHERE "gameId" = $1;', [gameId]);
    let rentedValue = 0;
    daysRentedFromGameId.rows.forEach(({ daysRented, returnDate }) => {
      if (returnDate === null) rentedValue = rentedValue + daysRented;
    });
    if (rentedValue >= rows[0].stockTotal) return res.sendStatus(400);

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
    
    //a linha abaixo foi necessária pq o horario das datas vindas do banco são travadas em 3:00:00.000Z 
    const todayDate = new Date(); todayDate.setUTCHours(3); todayDate.setUTCMinutes(0); todayDate.setUTCSeconds(0); todayDate.setUTCMilliseconds(0);

    const delay = (todayDate - rows[0].rentDate) / (1000 * 60 * 60 * 24);
    let delayFee = null;
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





