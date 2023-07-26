import { db } from "../database/database.js";

export const selectCustomers = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM customers');
    res.send(rows);
  } catch ({ message }) {
    res.status(500).send(message);
  }
};

export const selectCustomersById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM customers WHERE id = $1', [id]);
    res.send(rows[0]);
  } catch ({ message }) {
    res.status(500).send(message);
  }
};

export const insertCustomers = async (req, res) => {
  const { name, phone, cpf, birthday } = req.body;
  try {
    const { rowCount } = await db.query('SELECT * FROM customers WHERE cpf = $1;', [cpf]);
    if (rowCount > 0) return res.sendStatus(409);

    await db.query(`
      INSERT INTO customers ( name, phone, cpf, birthday)
      VALUES ($1, $2, $3, $4)
      ;`, [name, phone, cpf, birthday]
    );
    res.sendStatus(201);
  } catch ({ message }) {
    res.status(500).send(message);
  }
};

export const updateCustomers = async (req, res) => {
  const { id } = req.params;
  const { name, phone, cpf, birthday } = req.body;
  try {
    const { rowCount } = await db.query(`
      SELECT * FROM customers 
      WHERE cpf = $1 AND id <> $2
      ;`, [cpf, id]);
    if (rowCount > 0) return res.sendStatus(409);

    await db.query(`
      UPDATE customers
      SET name = $1, phone = $2, cpf = $3, birthday = $4
      WHERE id = $5
      ;`, [name, phone, cpf, birthday, id]
    );
    res.sendStatus(200);
  } catch ({ message }) {
    res.status(500).send(message);
  }
};