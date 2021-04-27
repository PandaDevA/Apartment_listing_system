const apartmentData = require('./apartmentlistings');
const commentData = require('./comments');
const agentData = require('./listingagents');
const reviewData = require('./reviews');
const userData = require('./users');

module.exports = {
  apartmentlistings: apartmentData,
  comments: commentData,
  listingagents: agentData,
  reviews: reviewData,
  users: userData
};
