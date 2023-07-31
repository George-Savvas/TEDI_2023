module.exports = (sequelize, DataTypes) => {

    const Room = sequelize.define("rooms", {
        //id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false},
        name: {type: DataTypes.STRING},
        price: {type: DataTypes.INTEGER},
        location: {type: DataTypes.STRING},
        area: {type: DataTypes.INTEGER},
        floor: {type: DataTypes.INTEGER},
        heating: {type: DataTypes.BOOLEAN},
        description: {type: DataTypes.TEXT},
        thumbnail_img:{type:DataTypes.STRING},
        //images:{type:DataTypes.ARRAY(DataTypes.STRING)}
        images:{type:DataTypes.TEXT}
            // ,
            // get() {
            //     if null
            //     return this.getDataValue('images').split(';')
            // },
            // set(val) {
            //     this.setDataValue('images',val.join(';'));
            // },
        
        
        // ADD τον αριθμό των ατόμων που αφορά η αναζήτηση num_of_people:{type: DataTypes.INTEGER},
        /*μέγιστος αριθμός ατόμων, ελάχιστη
τιμή ενοικίασης και επιπλέον κόστος ανά άτομο, τύπος ενοικιαζόμενου χώρου,
φωτογραφίες, κανόνες ενοικίασης, περιγραφή, αριθμός κρεβατιών, αριθμός
μπάνιων, αριθμός υπνοδωματίων, ύπαρξη καθιστικού, εμβαδό χώρου και ό,τι άλλο
κρίνεται απαραίτητο/* */
    })


    return Room
}
