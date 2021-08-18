require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(`postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);


const Reviews = sequelize.define('reviews', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
  },
  summary: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  recommended: {
    type: DataTypes.BOOLEAN,
  },
  reported: {
    type: DataTypes.BOOLEAN,
  },
  reviewer_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reviewer_email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  response: {
    type: DataTypes.STRING,
  },
  helpfulness: {
    type: DataTypes.INTEGER,
  },
}, {
  timestamps: false
});

const Characteristics = sequelize.define('characteristics', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
});

const CharacteristicReviews = sequelize.define('characteristic_reviews', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  characteristic_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  review_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: false,
});

const ReviewsPhotos = sequelize.define('reviews_photos', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  review_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
});

Reviews.hasMany(ReviewsPhotos, {as: 'photos', foreignKey: 'review_id'});
Reviews.hasMany(CharacteristicReviews, {foreignKey: 'review_id'});
// ReviewsPhotos.belongsTo(Reviews, {foreignKey: 'review_id'});
// CharacteristicReviews.belongsTo(Reviews, {foreignKey: 'characteristic_id'});

module.exports = {
  Reviews: Reviews,
  Characteristics: Characteristics,
  CharacteristicReviews: CharacteristicReviews,
  ReviewsPhotos: ReviewsPhotos,
};
// exports.connect = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Connected to db');
//   } catch (err) {
//     console.log('Unable to connect to db');
//   }
// }