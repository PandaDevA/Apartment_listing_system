const mongoCollections = require('../config/mongoCollections');
const comments = mongoCollections.comments;
let { ObjectId } = require('mongodb');

const addComment = async(data) => {
    if(!data.commenter_id || !data.comment) {
        console.log(`Data is undefined in addComment`);
        return false;
    }

    const commentCollection = await comments();
    const newComment = {
        comment_id:	new ObjectId(),
        ...data
    };
    
    const newInsertInformation = await commentCollection.insertOne(newComment);
    if (newInsertInformation.insertedCount === 0) console.log('Could not add comment');
    return newComment.comment_id;
};

module.exports = {
    addComment,
};
