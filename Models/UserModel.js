module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define("users", {
        id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false},
        username: {type: DataTypes.STRING},
        password: {type: DataTypes.STRING},
        name: {type: DataTypes.STRING},
        lastname: {type: DataTypes.STRING},
        email: {type: DataTypes.STRING},
        telephone: {type: DataTypes.STRING(10)}, //fix this
        role: {type: DataTypes.STRING}
    })

    return User
}