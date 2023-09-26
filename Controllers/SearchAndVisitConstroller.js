const db = require('../Models')

const SearchHistory = db.searchHistories
const Visit = db.visits


const addSearchHistory= async (req,res) => {   

    if(req.body.countryId){ // countryId is mandatory element for the recommendations
        Info={}
        Info["countryId"] = req.body.countryId
        if(req.body.numOfPeople)
            Info["numOfPeople"] = req.body.numOfPeople

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
    res.status(200).json({message: "did not give countryId"})
}   

const getSearchHistory = async (req,res) => {
    const searchHistory=await SearchHistory.findOne({where:{userId:req.params.userId}})
    res.status(200).json({searchHistory: searchHistory})
}

module.exports = {
    addSearchHistory,getSearchHistory
    }