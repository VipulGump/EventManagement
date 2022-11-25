const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const Invite = require('./invite');

const Event = sequelize.define('Event', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    eventName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    createdBy:{
        type: DataTypes.INTEGER
    }

},{
    paranoid: true
});

Event.hasMany(Invite,{
    foreignKey: 'eventId',
})
Invite.belongsTo(Event);

module.exports = {Event};