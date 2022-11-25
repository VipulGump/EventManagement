const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const {Event} = require('./event');
const Invite = require('./invite');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
    },
    authToken:{
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    paranoid: true
});

User.hasMany(Event,{
    foreignKey: 'createdBy'
});
Event.belongsTo(User);

User.hasMany(Invite,{
    foreignKey: 'userId'
})

Invite.belongsTo(User);

generateAuthToken = async function (user) {
    const token = jwt.sign({ id: user.id.toString() }, process.env.JWT_SECRET);
    user.authToken =  token;
    await user.save();
    return token;
}

findByCredentials = async (email, password) => {
    const user = await User.findAll();

    if (user.length==0) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user[0].dataValues.password);

    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return user[0];
}

module.exports = { User , generateAuthToken, findByCredentials };