module.exports = (sequelize, DataTypes) => {

    const Review = sequelize.define("reviews", {
        //id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false},
        reviewer_name: {type:DataTypes.STRING},   // nullable maybe for anonymous commenting 
        date: {type: DataTypes.DATEONLY, allowNull: false},
        comments: {type: DataTypes.TEXT, allowNull: false}
    })

    return Review
}

