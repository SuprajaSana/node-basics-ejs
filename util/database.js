const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_first_project', 'root', 'Saana@123', {
    dialect: 'mysql',
    host:'localhost'
});

module.exports = sequelize;