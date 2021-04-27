const dbConnection = require('../app/config/mongoConnection');
const data = require('../app/data/');
const apartments = data.apartmentlistings;
const comments = data.comments;
const listingagents = data.listingagents;
const users = data.users;
const reviews = data.reviews;

const commentData = {
  commenter_id: '905763c',
  comment: 'Thank you!!'
};

const agentData = [
  {username: 'Dick Taylor', email_id: 'dick.taylor@gmail.com', password: 'xxxxxxxx', listings: ['7b7997a2'], comments: ['605810fdb595']},
];

const userData = [
    {username: 'John Smith', email_id: 'john.smith@yahoo.com', password: 'xxxxxxxx', reviews: ['684882cw7898f', 'fwe7cx6wewef623'], comments: ['2374984389fd8cx']},
];

const listData = [
  {
    title: '25 Senate Place Apartments, Senate Place, Jersey City, NJ',
    price: 37000,
    utilities_included: false,
    address: 'Journal Square, Jersey City, NJ - o7306',
    city: 'Jersey City',
    state: 'NJ',
    zip: '07310',
    longitude: 40.732628,
    latitude: -74.037628,
    description: 'Looking for anyone who can start lease from 1st May in 2 bed 2 bath luxurious apartment near Journal Square, Jersey City, NJ - 07306.',
    photos: ['xxxx', 'yyyy', 'zzzz'],
    reviews: [],
    rating: 4.3
  }
];

const reviewData = [
  {
    user_id: '3hd73489',
    review: 'This is a really amazing!!',
    rating: 5,
  }
];

async function main() {
  const db = await dbConnection();
  await db.dropDatabase();

  const comment_id = await comments.addComment(commentData);
  const agent_id = await listingagents.addAgent(agentData[0]);
  const user_id = await users.addUser(userData[0]);
  const apartment_id = await apartments.addApartment(listData[0]);
  const review_id = await reviews.addReview({apartment_id, ...reviewData[0]});

  console.log('Done seeding database');

  await db.serverConfig.close();
}

main();
