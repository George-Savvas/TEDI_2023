module.exports = (sequelize, DataTypes) => {

    const Availability = sequelize.define("availabilities", {  // availability of one room for one date
        id: {type: DataTypes.INTEGER, autoIncrement: true,primaryKey: true, allowNull: false},
        date: {type: DataTypes.DATEONLY, allowNull: false},
        available: {type: DataTypes.BOOLEAN, allowNull: false},
        price: {type: DataTypes.INTEGER}
     })

    return Availability
}