module.exports = (sequelize, DataTypes) => {

    const Room = sequelize.define("rooms", {
        //id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false},
        name: {type: DataTypes.STRING},
        price: {type: DataTypes.INTEGER},
        dates_available: {type: DataTypes.STRING},
        location: {type: DataTypes.STRING},
        area: {type: DataTypes.INTEGER},
        floor: {type: DataTypes.INTEGER},
        heating: {type: DataTypes.BOOLEAN},
        description: {type: DataTypes.TEXT}
    })

    return Room
}
