const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Invite = sequelize.define('Invite', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    eventId: {
        type: DataTypes.INTEGER,
    },
    userId:{
        type: DataTypes.INTEGER
    }
},{
    paranoid: true
});

module.exports = Invite;