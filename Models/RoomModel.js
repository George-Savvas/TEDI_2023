module.exports = (sequelize, DataTypes) => {

    const Room = sequelize.define("rooms", {
        //id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false},
        name: {type: DataTypes.STRING,allowNull: false},
        cost: {type: DataTypes.INTEGER,allowNull: false},
        space: {type: DataTypes.INTEGER},
        heating: {type: DataTypes.BOOLEAN},
        description: {type: DataTypes.TEXT},
        thumbnail_img:{type:DataTypes.STRING},
        num_of_images: {type: DataTypes.INTEGER}, // must be under 10
        
//         max_people:{type: DataTypes.INTEGER},
//         extra_price_per_person: {type: DataTypes.INTEGER}, //if (n> num_of_people){ total price+= (n-num_of_people)*extra_price_per_person.. }
//         summary:{type: DataTypes.TEXT},
// //        swimming_pool: {type: DataTypes.BOOLEAN},
//         experiences_offered:{type: DataTypes.TEXT},
//         //neighborhood_overview,    // !!!!!!!!!!!!   YES
//         //notes,
//         transit: {type: DataTypes.TEXT},
//         //,thumbnail_url,medium_url,picture_url,xl_picture_url,host_id,host_url,
//         //host_name,  GOOD
//         //host_since, GOOD
//         //,host_location,host_about,host_response_time,host_response_rate,host_acceptance_rate,host_is_superhost,host_thumbnail_url,host_picture_url,host_neighbourhood,
//         //host_listings_count, GOOD
//         //host_total_listings_count,host_verifications,host_has_profile_pic,host_identity_verified,
//         street:{type: DataTypes.STRING},
//         neighbourhood:{type: DataTypes.STRING},
//         //neighbourhood_cleansed,neighbourhood_group_cleansed,
//         city:{type: DataTypes.STRING},
//         state:{type: DataTypes.STRING},
//         zipcode:{type: DataTypes.INTEGER},
//         //market,
//         country_code:{type: DataTypes.STRING},        
        openStreetMapX:{type: DataTypes.DOUBLE},// SEE FLOAT
        openStreetMapY:{type: DataTypes.DOUBLE},
        openStreetMapLabel:{type: DataTypes.STRING},
///////  NEW STUFF:
        
    countryId:{type: DataTypes.STRING},
    stateId:{type: DataTypes.STRING},
    cityId:{type: DataTypes.STRING},
    address: {type: DataTypes.STRING},
    accessibilityToMeansOfTransport: {type: DataTypes.TEXT},
    numOfPeople:{type: DataTypes.INTEGER},
    maxNumOfPeople: {type: DataTypes.INTEGER},
    additionalCostPerPerson: {type: DataTypes.INTEGER},
    roomType: {type: DataTypes.STRING},
    rules: {type: DataTypes.TEXT},
    numOfBeds: {type: DataTypes.INTEGER},
    numOfBathrooms: {type: DataTypes.DOUBLE},
    numOfBedrooms: {type: DataTypes.INTEGER},
    livingRoomInfo: {type: DataTypes.STRING},
    roomArea: {type: DataTypes.INTEGER},
    number_of_reviews: {type: DataTypes.INTEGER},
    review_scores_rating: {type: DataTypes.DOUBLE}


/////////   END OF NEW STUFF    //////////////////////

//         //is_location_exact,property_type,
//         room_type:{type: DataTypes.STRING},
//         accommodates:{type: DataTypes.INTEGER},
//         bathrooms:{type: DataTypes.DOUBLE},
//         bedrooms:{type: DataTypes.INTEGER},
//         beds:{type: DataTypes.INTEGER},
//         bed_type:{type: DataTypes.STRING},
//         //amenities,  ?
//         //square_feet,
//         price:{type: DataTypes.INTEGER},
//         weekly_price:{type: DataTypes.INTEGER},
//         monthly_price:{type: DataTypes.INTEGER},
//         //security_deposit, MAYBE
//         //cleaning_fee,
//         //guests_included,  MAYBE
//         //extra_people,  // ?
//         //minimum_nights,
//         //maximum_nights,
// /*        calendar_updated,  // ?       FOR 9
//         has_availability:{type: DataTypes.BOOLEAN},
//         availability_30:{type: DataTypes.BOOLEAN},  
//         availability_60:{type: DataTypes.BOOLEAN},
//         availability_90:{type: DataTypes.BOOLEAN},
//         availability_365:{type: DataTypes.BOOLEAN},
//         calendar_last_scraped, //???   /* */
//         number_of_reviews:{type: DataTypes.INTEGER},
//         // first_review,
//         // last_review, //  MAYBE
//         review_scores_rating:{type: DataTypes.DOUBLE},
//         review_scores_accuracy:{type: DataTypes.DOUBLE}, // ?
//         review_scores_cleanliness:{type: DataTypes.DOUBLE},
//         review_scores_checkin:{type: DataTypes.DOUBLE},
//         review_scores_communication:{type: DataTypes.DOUBLE},
//         review_scores_location:{type: DataTypes.DOUBLE},
//         review_scores_value:{type: DataTypes.DOUBLE},
//         //requires_license,license,jurisdiction_names,
//         //instant_bookable, MAYBE
//         //cancellation_policy:{type:DataTypes.TEXT},  //GOOD
//         //rules:{type:DataTypes.TEXT},  //GOOD
//         //require_guest_profile_picture,require_guest_phone_verification,calculated_host_listings_count,
//         reviews_per_month:{type: DataTypes.DOUBLE}

//         // images:{type:DataTypes.TEXT}
//             // ,
//             // get() {
//             //     if null
//             //     return this.getDataValue('images').split(';')
//             // },
//             // set(val) {
//             //     this.setDataValue('images',val.join(';'));
//             // },
        
        
        // ADD τον αριθμό των ατόμων που αφορά η αναζήτηση num_of_people:{type: DataTypes.INTEGER},
        /*μέγιστος αριθμός ατόμων, ελάχιστη
τιμή ενοικίασης και επιπλέον κόστος ανά άτομο, τύπος ενοικιαζόμενου χώρου,
φωτογραφίες, κανόνες ενοικίασης, περιγραφή, αριθμός κρεβατιών, αριθμός
μπάνιων, αριθμός υπνοδωματίων, ύπαρξη καθιστικού, εμβαδό χώρου και ό,τι άλλο
κρίνεται απαραίτητο/* */
    })


    return Room
}
