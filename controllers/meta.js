const { Reviews, Characteristics, CharacteristicReviews } = require('../database/database');

module.exports = {
  get: async (req, res) => {
    const product_id = req.query.product_id;
    const reviewQuery = {
      attributes: ['rating','recommended'],
      where: {
        product_id: product_id,
        reported: false
      },
    };
    const characteristicQuery = {
      attributes: ['id','name'],
      where: {
        product_id: product_id,
      },
      include: {
        model: CharacteristicReviews,
        attributes: ['value'],
        group: 'characteristic_id',
      },
    };

    if (product_id) {
      try {
        const result = {
          product_id: product_id,
          ratings: {},
          recommended: {},
          characteristics: {},
        };
        const reviews = await Reviews.findAll(reviewQuery);
        const characteristics = await Characteristics.findAll(characteristicQuery);

        reviews.forEach( review => {
          result.ratings[review.rating] = result.ratings[review.rating] === undefined ? 1 : result.ratings[review.rating] + 1;
          result.recommended[review.recommended] = result.recommended[review.recommended] === undefined ? 1 : result.recommended[review.recommended] + 1;
        });

        characteristics.forEach( characteristic => {
          if (characteristic.characteristic_reviews.length > 0) {
            var sum = 0;
            for (var i = 0; i < characteristic.characteristic_reviews.length; i++) {
              sum += characteristic.characteristic_reviews[i].value;
            }
            result.characteristics[characteristic.name] = {
              id: characteristic.id,
              value: sum / characteristic.characteristic_reviews.length,
            }
          }
        });

        res.status(200).json(result);
      } catch (err) {
        console.log(err);
        res.status(500).send('An error occurred. If this error persists, you\'re out of luck.');
      }
    } else {
      res.status(422).send('Error: invalid product_id provided');
    }
  }
}