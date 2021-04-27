const mongoCollections = require('../config/mongoCollections');
const listingagents = mongoCollections.listingagents;
let { ObjectId } = require('mongodb');

const addAgent = async(data) => {
    if(!data.username || !data.email_id || !data.password) {
        console.log(`Data is undefined in addAgent`);
        return false;
    }

    const agentCollection = await listingagents();
    const newAgent = {
        agent_id: new ObjectId(),
        ...data
    };
    
    const newInsertInformation = await agentCollection.insertOne(newAgent);
    if (newInsertInformation.insertedCount === 0) console.log('Could not add agent');
    return newAgent.agent_id;
}

module.exports = {
    addAgent,
};