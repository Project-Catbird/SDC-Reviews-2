const router = require('express').Router();
const controller = require('./controllers');

router.get('/reviews', controller.reviews.get);
router.get('/reviews/meta', controller.meta.get);
router.post('/reviews', controller.reviews.post);
router.put('/reviews/:review_id/helpful', controller.helpful.put);
router.put('/reviews/:review_id/report', controller.report.put);

module.exports = router;