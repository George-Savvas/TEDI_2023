module.exports = (sequelize, DataTypes) => {

    const Review = sequelize.define("reviews", {
        //id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false},
        date: {type: DataTypes.DATEONLY ,allowNull: false},
        score: {type: DataTypes.INTEGER,allowNull: false},
        reviewer_name: {type: DataTypes.STRING},
        comments: {type: DataTypes.TEXT ,allowNull: false},
        // userId -> FOREIGN KEY,
        // roomId -> FOREIGN KEY

    })

    return Review
}