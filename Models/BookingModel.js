module.exports = (sequelize, DataTypes) => {

    const Booking = sequelize.define("booking", {
        //id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false}, AUTOMATICALLY
        //userId  -> foreign
        //roomId  -> foreign
        InDate: {type: DataTypes.DATEONLY, allowNull: false},
        OutDate: {type: DataTypes.DATEONLY, allowNull: false},
    })

    return Booking
}