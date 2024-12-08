const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize('postgresql://query_user:Pu6QYPVQzQCHz0x6sxGCBy9ULZsJgIUz@dpg-ctaqrbpu0jms73f270c0-a.oregon-postgres.render.com/query', {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true, // Ensure SSL is required
      rejectUnauthorized: false, // Set to false to allow self-signed certificates
    },
  },
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
