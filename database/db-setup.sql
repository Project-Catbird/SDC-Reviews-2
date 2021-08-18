\c sdc-reviews
DROP TABLE IF EXISTS characteristic_reviews;
DROP TABLE IF EXISTS characteristics;
DROP TABLE IF EXISTS reviews_photos;
DROP TABLE IF EXISTS reviews;

CREATE TABLE reviews (
  id SERIAL primary key,
  product_id INTEGER NOT NULL,
  rating SMALLINT NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_DATE,
  temp_date BIGINT NOT NULL,
  summary varchar(255) NOT NULL,
  body TEXT NOT NULL,
  recommended BOOLEAN DEFAULT FALSE,
  reported BOOLEAN DEFAULT FALSE,
  reviewer_name varchar(255) NOT NULL,
  reviewer_email varchar(255) NOT NULL,
  response varchar(255) DEFAULT NULL,
  helpfulness INTEGER DEFAULT 0
);

CREATE TABLE characteristics (
  id SERIAL primary key,
  product_id INTEGER NOT NULL,
  name varchar(20) NOT NULL
);

CREATE TABLE characteristic_reviews (
  id SERIAL primary key,
  characteristic_id INTEGER REFERENCES characteristics(id) ON DELETE CASCADE,
  review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
  value SMALLINT NOT NULL
);

CREATE TABLE reviews_photos (
  id SERIAL primary key,
  review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
  url varchar(255) NOT NULL
);

\COPY reviews(id, product_id, rating, temp_date, summary, body, recommended, reported, reviewer_name, reviewer_email, response, helpfulness) FROM '/Users/kei/Desktop/reviews.csv' DELIMITER ',' CSV HEADER

UPDATE reviews SET date = TO_TIMESTAMP(temp_date / 1000);
ALTER TABLE reviews DROP COLUMN temp_date;
UPDATE reviews SET response = NULL WHERE response = 'null';

\COPY characteristics(id, product_id, name) FROM '/Users/kei/Desktop/characteristics.csv' DELIMITER ',' CSV HEADER

\COPY characteristic_reviews(id, characteristic_id, review_id, value) FROM '/Users/kei/Desktop/characteristic_reviews.csv' DELIMITER ',' CSV HEADER

\COPY reviews_photos(id, review_id, url) FROM '/Users/kei/Desktop/reviews_photos.csv' DELIMITER ',' CSV HEADER

DROP INDEX IF EXISTS idx_review_id;
DROP INDEX IF EXISTS idx_characteristics_id;
DROP INDEX IF EXISTS idx_characteristic_reviews_id;
DROP INDEX IF EXISTS idx_reviews_photos_id;
CREATE INDEX idx_review_id ON public.reviews USING btree (product_id);
CREATE INDEX idx_characteristics_id ON public.characteristics USING btree (product_id);
CREATE INDEX idx_characteristic_reviews_id ON public.characteristic_reviews USING btree (characteristic_id);
CREATE INDEX idx_reviews_photos_id ON public.reviews_photos USING btree (review_id);

SELECT setval('reviews_id_seq', (SELECT MAX(id) FROM "reviews"));
SELECT setval('characteristics_id_seq', (SELECT MAX(id) FROM "characteristics"));
SELECT setval('characteristic_reviews_id_seq', (SELECT MAX(id) FROM "characteristic_reviews"));
SELECT setval('reviews_photos_id_seq', (SELECT MAX(id) FROM "reviews_photos"));