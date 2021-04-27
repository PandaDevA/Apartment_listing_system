const mongoCollections = require('../config/mongoCollections');
const apartmentlistings = mongoCollections.apartmentlistings;
let { ObjectId } = require('mongodb');

const addApartment = async(data) => {
    if(!data.title || !data.price || !data.address) {
        console.log(`Data is undefined in addApartment`);
        return false;
    }

    const apartmentCollection = await apartmentlistings();
    const newApartment = {
        listing_id:	new ObjectId(),
        title: data.title,
        price: data.price,
        utilities_included: data.utilities_included,
        address: data.address,
        longitude: data.longitude,
        latitude: data.latitude,
        description: data.description,
        photos: data.photos,
        reviews: [],
        rating: data.rating
    };
    
    const newInsertInformation = await apartmentCollection.insertOne(newApartment);
    if (newInsertInformation.insertedCount === 0) console.log('Could not add Apartment');
    return newApartment.listing_id;
}

module.exports = {
    addApartment,
};