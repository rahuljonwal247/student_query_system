const sequelize = require("../config/database");
const User = require("./user");
const Query = require("./query");

// Define relationships
User.hasMany(Query, { foreignKey: "studentId", as: "studentQueries" });
User.hasMany(Query, { foreignKey: "resolverId", as: "resolverQueries" });
Query.belongsTo(User, { foreignKey: "studentId", as: "student" });
Query.belongsTo(User, { foreignKey: "resolverId", as: "resolver" });

module.exports = { sequelize, User, Query };
