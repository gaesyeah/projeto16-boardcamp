import { db } from "../database/database.js";

export const selectRentals = async (req, res) => {
  try {
    const { rows, rowCount } = await db.query('SELECT * FROM rentals;');
    if (rowCount > 0){
      for (let i = 0; i < rows.length; i++) {
        let id = rows[i].customerId;
        const user = await db.query(`SELECT name FROM customers WHERE id = ${id};`);
        rows[i].customer = { id, name: user.rows[0].name };

        id = rows[i].gameId;
        const game = await db.query(`SELECT name FROM games WHERE id = ${id};`);
        rows[i].game = { id, name: game.rows[0].name };
      }
    }
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
    if (rowCount === 0) return res.sendStatus(400);

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
    const { rows } = await db.query('SELECT "gameId", "rentDate", "daysRented" FROM rentals WHERE id = $1;', [id]);
    
    //a linha abaixo foi necessária pq o horario das datas vindas do banco são travadas em 3:00:00.000Z 
    const todayDate = new Date(); todayDate.setUTCHours(3); todayDate.setUTCMinutes(0); todayDate.setUTCSeconds(0); todayDate.setUTCMilliseconds(0);

    const delay = (todayDate - rows[0].rentDate) / 1000 * 60 * 60 * 24;
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





