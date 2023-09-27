module.exports = (sequelize, DataTypes) => {

    const Review = sequelize.define("reviews", {
        //id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false},
        date: {type: DataTypes.DATEONLY }, 
        score: {type: DataTypes.INTEGER},
        reviewer_name: {type: DataTypes.STRING},
        comments: {type: DataTypes.TEXT },
        // userId -> FOREIGN KEY,
        // roomId -> FOREIGN KEY

    })
    
    return Review
}