FROM node:16
WORKDIR /sdc-reviews
COPY . /sdc-reviews
RUN npm install
EXPOSE 3000
CMD ["node", "index.js"]