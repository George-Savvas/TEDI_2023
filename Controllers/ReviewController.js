const db = require('../Models')

const Review = db.reviews
const Room = db.rooms


const addReview= async (req,res) => {   

//1) check for old review in the same room by same user     , destroy it

    const old_review = await Review.findOne({where:{roomId:req.body.roomId, userId:req.body.userId}})
    if(old_review) await Review.destroy({where:{roomId:req.body.roomId, userId:req.body.userId}})

//2) create new review 
    let ReviewInfo = {
        score: req.body.score,
        date: req.body.date,
        reviewer_name: req.body.reviewer_name,
        comments: req.body.comments, 
        roomId : req.body.roomId,
        userId: req.body.userId
        }

    const review = await Review.create(ReviewInfo)
    

//3) update Room number of reviews and score_rating 

    if(old_review && req.body.score!=null){
        let old_score= old_review.score
        let new_score= req.body.score
    
        await Room.findByPk(req.body.roomId).then(room => {
            let n = room.number_of_reviews
            let old_avg = room.review_scores_rating 
            Room.update({
                    review_scores_rating:(n*old_avg + new_score - old_score)/n
                    },
                    {where:{id:req.body.roomId}
                })
            
            })
    
    }

    else{
        await Room.findByPk(req.body.roomId).then(room => {
            let old_n = room.number_of_reviews
            let old_avg = room.review_scores_rating 

            updates={number_of_reviews:old_n+1}

            if(req.body.score!=null){
                updates["review_scores_rating"]=(old_n*old_avg+req.body.score)/(old_n+1)
            }

            Room.update(
                    // {number_of_reviews:old_n+1,
                    // review_scores_rating:(old_n*old_avg+req.body.score)/(old_n+1)
                    // },
                    updates,
                    {where:{id:req.body.roomId}
            })
  
        })
    
    }

    res.status(200).json({review: review})
}   

module.exports = {
    addReview,
    }
    