module.exports = (sequelize, DataTypes) => {

    const Image = sequelize.define("images", {
        path:{type:DataTypes.STRING},
        position:{type:DataTypes.INTEGER} // for any position update , just update all images
    })

    return Image

}