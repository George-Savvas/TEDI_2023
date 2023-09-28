module.exports = (sequelize, DataTypes) => {

    const Visit = sequelize.define("visits", {
        //id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false},
        count: {type: DataTypes.INTEGER }
        // userId -> FOREIGN KEY,
        // roomId -> FOREIGN KEY

    })

    return Visit
}