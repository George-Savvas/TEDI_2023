const db = require('../Models')

const SearchHistory = db.searchHistories
const Visit = db.visits


const addSearchHistory= async (req,res) => {   

    Info={}
    if(req.body.cityId){ // if cityId not Null then user must have searched country and state as well
        Info["countryId"] = req.body.countryId
        Info["stateId"] = req.body.stateId
        Info["cityId"] = req.body.stateId

        const old_history = await SearchHistory.findOne({where:{userId:req.params.userId}})
        
        if(old_history){ 
            await SearchHistory.update(Info,{where:{ id: old_history.id}})
            res.status(200).json({message: "search history updated!"})
        }    
        else{
            Info["userId"] = req.params.userId
            await SearchHistory.create(Info)
            res.status(200).json({message: "search history created!"})
        }
        
    }
    else 
    res.status(200).json({message: "did not give ciyId"})
}   

const getSearchHistory = async (req,res) => {
    const searchHistory=await SearchHistory.findOne({where:{userId:req.params.userId}})
    res.status(200).json({searchHistory: searchHistory})
}

const addVisit= async (req,res) => {
    
    const old_visit = await Visit.findOne(
        {where:{
            userId:req.body.userId,
            roomId:req.body.roomId
        }}
    )

    if(old_visit){
        Visit.increment('count', { by: 1, where: { id: old_visit.id }});
        res.status(200).json({message: "Visit updated!"})
    }
    else {
        Visit.create({
            userId:req.body.userId,
            roomId:req.body.roomId,
            count:1
        })
        res.status(200).json({message: "Visit created!"})
    }
}

module.exports = {
    addSearchHistory,getSearchHistory,addVisit
    }