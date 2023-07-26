export const selectGames = async (req, res) => {
  try {
    res.send();
  } catch ({ message }) {
    res.status(500).send(message);
  }
};

export const insertGames = async (req, res) => {
  try {
    res.send();
  } catch ({ message }) {
    res.status(500).send(message);
  }
};