module.exports = (sequelize, DataTypes) => {

    const SearchHistory = sequelize.define("searchHistories", {
        //id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false},
        countryId:{type: DataTypes.STRING},
        stateId:{type: DataTypes.STRING},
        cityId: {type: DataTypes.STRING},
        numOfPeople:{type: DataTypes.INTEGER}       
        // userId -> FOREIGN KEY
    })

    return SearchHistory
}