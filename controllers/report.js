const { Reviews } = require('../database/database');

module.exports = {
  put: async (req, res) => {
    try {
      await Reviews.update({reported: true}, {
        where: {
          id: req.params.review_id,
        }
      });
      res.sendStatus(204);
    } catch (err) {
      console.log(err);
      res.status(500).send('An error occurred. If this error persists, you\'re out of luck.');
    }
  }
}