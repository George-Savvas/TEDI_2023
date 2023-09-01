module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define("users", {
        //id: {type: DataTypes.INTEGER, autoIncrement: true,primaryKey: true, allowNull: false},
        username: {type: DataTypes.STRING},
        password: {type: DataTypes.STRING},
        name: {type: DataTypes.STRING},
        lastname: {type: DataTypes.STRING},
        email: {type: DataTypes.STRING},
        telephone: {type: DataTypes.STRING(10)}, //maybe fix this(for the additional +30 at the start)
        active:{type: DataTypes.BOOLEAN},
        isTenant: {type: DataTypes.BOOLEAN},
        isLandlord:{type: DataTypes.BOOLEAN},
        isAdmin:{type: DataTypes.BOOLEAN},
        profile_img:{type:DataTypes.STRING},
    })
 
    return User
}