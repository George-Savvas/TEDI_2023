module.exports = (sequelize, DataTypes) => {

    const Date = sequelize.define("dates", {
        //id: {type: DataTypes.INTEGER, autoIncrement: true,primaryKey: true, allowNull: false},
        datekey: {type: DataTypes.DATEONLY,primaryKey: true, allowNull: false},
    })

    return Date
}