const { Reviews, Characteristics, CharacteristicReviews, ReviewsPhotos } = require('../database/database');

module.exports = {
  get: async (req, res) => {
    const page = req.query.page || 1;
    const count = req.query.count || 5;
    const sort = req.query.sort;
    const product_id = req.query.product_id;

    const query = {
      attributes: ['id', 'rating', 'summary', 'recommended', 'response', 'body', 'date', 'reviewer_name', 'helpfulness'],
      where: {
        product_id: product_id,
        reported: false
      },
      offset: (page - 1) * count,
      limit: count,
      include: {
        model: ReviewsPhotos,
        as: 'photos',
        attributes: ['id', 'url'],
      },
    }
    if (sort === 'newest') {
      query.order = [['date', 'DESC']];
    } else if (sort === 'helpful') {
      query.order = [['helpfulness', 'DESC']];
    } else if (sort === 'relevant') {
      query.order = [['date', 'DESC'], ['helpfulness', 'DESC']];
    }

    if (product_id !== undefined) {
      try {
        const reviews = await Reviews.findAll(query);
        const result = {
          product: product_id,
          page: page - 1,
          count: count,
          results: reviews,
        }
        res.status(200).json(result);
      } catch (err) {
        console.log(err);
        res.status(500).send('An error occurred. If this error persists, you\'re out of luck.');
      }
    } else {
      res.status(422).send('Error: invalid product_id provided');
    }
  },
  post: async (req, res) => {
    console.log(req.body);
    const reviewQuery = {
      product_id: req.body.product_id,
      rating: req.body.rating,
      summary: req.body.summary,
      body: req.body.body,
      reviewer_name: req.body.name,
      reviewer_email: req.body.email,
    }
    if (req.body.recommended !== undefined) {
      reviewQuery.recommended = req.body.recommended;
    }
    if (req.body.response !== undefined) {
      reviewQuery.response = req.body.response;
    }
    try {
      const newReview = await Reviews.create(reviewQuery);
      const photoURLs = [];
      const characteristics = [];
      if (req.body.photos !== undefined && req.body.photos.length > 0) {
        req.body.photos.forEach(url => {
          photoURLs.push({review_id: newReview.id, url: url});
        });
        const newPhotos = await ReviewsPhotos.bulkCreate(photoURLs);
      }
      if (req.body.characteristics !== undefined && Object.keys(req.body.characteristics).length > 0) {
        for (const characteristic in req.body.characteristics) {
          characteristics.push({
            characteristic_id: characteristic,
            review_id: newReview.id,
            value: req.body.characteristics[characteristic],
          });
        }
        const newCharacteristics = await CharacteristicReviews.bulkCreate(characteristics);
      }
      res.sendStatus(201);
    } catch (err) {
      console.log(err);
      res.status(500).send('An error occurred. If this error persists, you\'re out of luck.');
    }
  },
}