const Sequelize = require("sequelize");

const connection = new Sequelize("guiaperguntas", "root", "Gaox3x295@", {
    host: "localhost",
    dialect: "mysql"
});

module.exports = connection;