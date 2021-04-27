const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
let { ObjectId } = require('mongodb');

const addUser = async(data) => {
    if(!data.username || !data.password || !data.email_id) {
        console.log(`Data is undefined in addUser`);
        return false;
    }

    const userCollection = await users();
    const newUser = {
        user_id: new ObjectId(),
        ...data
    };
    
    const newInsertInformation = await userCollection.insertOne(newUser);
    if (newInsertInformation.insertedCount === 0) console.log('Could not add user');
    return newUser.user_id;
}

module.exports = {
    addUser,
};