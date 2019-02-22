const Flair = require('./models').Flair;
const Topic = require('./models').Topic;

module.exports = {
    addFlair(newFlair, callback){
        return Flair.create(newFlair)
        .then((flair) => {
            callback(null, flair);
        })
        .catch((err) => {
            callback(err);
        })
    },
    getFlairs(topic, callback){
        return topic.getFlairs()
        .then((associatedFlairs) => {
            callback(null, associatedFlairs);
        })
        .catch((err) => {
            callback(err);
        })
    },
    getFlair(id, callback){
        return Flair.findById(id)
        .then((flair) => {
          callback(null, flair);
        })
        .catch((err) => {
          callback(err);
        })
    },
    deleteFlair(id, callback){
        return Flair.destroy({
            where: {id}
        })
        .then((deletedRecordsCount) => {
            callback(null, deletedRecordsCount);
        })
        .catch((err) => {
            console.log(err);
        });
    }
};