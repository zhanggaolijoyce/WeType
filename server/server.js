const fs = require('fs');
const express = require('express');
const path = require('path');
const { ApolloServer, UserInputError } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { MongoClient } = require('mongodb');

/******************************************* 
DATABASE CONNECTION CODE
********************************************/
//Note that the below variable is a global variable 
//that is initialized in the connectToDb function and used elsewhere.
let db;

//Function to connect to the database
async function connectToDb() {
    const url = 'mongodb://localhost/team1';
    const client = new MongoClient(url, { useNewUrlParser: true });
    await client.connect();
    console.log('Connected to MongoDB at', url);
    db = client.db();
  }

/******************************************* 
GraphQL CODE
********************************************/  
const resolvers = {
  Query: {
    // User Service (USV) Resolvers
    fetchUserInfo: fetchUserInfoResolver,
    worldRanking: worldRankingResolver,
  },
  Mutation: {
    // User Service (USV) Resolvers
    logIn: logInResolver,
    signUp: signUpResolver,
    editProfile: editProfileResolver,
    deregister: deregisterResolver,

    addRecord: addRecordResolver,
    addFriend: addFriendResolver
  }
};

/**
 * 
 * @param {*} _ 
 * @param {*} args User's email and password.
 * @returns 1 if success, else unsuccess.
 */
async function logInResolver(_, args)
{
  try{
    const {email, password} = args;
    const user = await db.collection('users').findOne({email: email});
    if(!user){
      console.log("Error::login::user not found.");
      return -1; // user not found
    }
    if(user.password == password)
      return 1; // success
    else{
      console.log("Error::login::user email and password dismatch.");
      return -7; // password dismatch
    }
  } catch(error){
    console.log("Error::login::unknown unsuccess.");
    return 0; // unknown unsuccess
  }
}

/**
 * 
 * @param {*} _ 
 * @param {*} args User's name, email, and password.
 * @returns 1 if success, else unsuccess.
 */
async function signUpResolver(_, args) 
{
  try {
    const { name, email, password } = args;
    // Check if the user with the provided email already exists
    const existingUser = await db.collection('users').findOne({ email });
    
    if (existingUser) {
      console.log("Error::signup::duplicative user email.")
      return -1;
    }

    // Create a new user document
    const newUser = {
      email: email,
      password: password,
      profile: {
        name: name ? name : "",
        preferred_style: 0,
        history: {
          key: [],
          value: []
        },
        total_practice_time: 0,
        total_practice_words: 0,
        friends: []
      }
    };

    // Insert the new user into the "users" collection
    const result = await db.collection('users').insertOne(newUser);
    if(result.insertedCount == 1)
      return 1;
    else{
      console.log("Error::signup::unsuccessfully insert into database");
      return 0;
    }
  } catch (error) {
    console.log("Error::signup::unknown unsuccess.");
    return 0;
  }
};

/**
 * 
 * @param {*} _ 
 * @param {*} args User's email and password.
 * @returns User's profile, empty if unsuccess.
 */
async function fetchUserInfoResolver(_, args)
{
  try {
    const { email } = args;
    const user = await db.collection('users').findOne({ email: email });
    if (!user) {
      console.log("Error::fetchUserInfo::user not found.");
      return null;
    }
    return user.profile;
  } catch (error) {
    console.log("Error::fetchUserInfo::unknown unsuccess.");
    return null;
  }
}

/**
 * 
 * @param {*} _ 
 * @param {*} args User's email, might contain the editted name, preferred_style, or avatar.
 * @returns 1 if success, else unsuccess.
 */
async function editProfileResolver(_, args) {
  try {
    const { email, name, preferred_style, avatar } = args;
    let user = await db.collection('users').findOne({email: email});
    if(!user){
      console.log("Error::editProfile::user not found.");
      return -1;
    }
    if(name){
      user.profile.name = name;
    }
    if(preferred_style == 0 || preferred_style == 1){
      user.profile.preferred_style = preferred_style;
    }
    if(avatar){
      user.profile.avatar = avatar;
    }
    const result = await db.collection('users').updateOne(
      {email: email},
      {$set: {profile: user.profile}}
    );
    if(result.modifiedCount == 1){
      return 1;
    }
    else if(result.modifiedCount == 0){
      return 2;
    }
    else{
      console.log("Error::editProfile::unsuccessfully database documentation update.");
      return 0;
    }
  } catch (error) {
    console.log("Error::editProfile::unknown unsuccess");
    return 0;
  }
}

/**
 * 
 * @param {*} _ 
 * @param {*} args User's email and password.
 * @returns 1 if success, else unsuccess.
 */
async function deregisterResolver(_, args) {
  try {
    const { email, password } = args;
    const user = await db.collection('users').findOne({email: email});
    if(!user){
      console.log("Error::deregister::user not found");
      return -1;
    }
    if(user.password != password){
      console.log("Error::deregister::user email and password dismatch.");
      return -7;
    }
    const result = await db.collection('users').deleteOne({email: email});
    if (result.acknowledged) {
      return 1;
    }
    else{
      console.log("Error::deregister::unsuccessfully database documentation delete.");
      return 0;
    }
  } catch (error) {
    console.log("Error::deregister::unknown unsuccess");
    return 0;
  }
}

/**
 * 
 * @param {*} _ 
 * @param {*} args 
 * @returns 1 if success, else unsuccess.
 */
async function addRecordResolver(_, args){
  try{
    const { email, time, words } = args;
    let user = await db.collection('users').findOne({email: email});

    if(!user){
      console.log("Error::addRecord::user not found");
      return -1;
    }

    // generate current date
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based, so add 1
    const day = currentDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    // update
    const dates = user.profile.history.key;
    const index = dates.findIndex(element => element === formattedDate);

    if(index != -1){
      user.profile.history.value[index] += 1;
    }
    else{
      user.profile.history.key.push(formattedDate);
      user.profile.history.value.push(1);
    }
    user.profile.total_practice_time += time;
    user.profile.total_practice_words += words;

    const result = await db.collection('users').updateOne(
      {email: email},
      {$set: {profile: user.profile}}
    );
    if(result.modifiedCount == 1){
      return 1;
    }
    else{
      console.log("Error::addRecord::unsuccessfully database documentation update.");
      return 0;
    }
  } catch (error){
    console.log("Error::addRecord::" + error);
    return 0;
  }
}

/**
 * 
 * @param {*} _ 
 * @param {*} args User's email, password, and the friend's email the user wants to add.
 * @returns 1 if success, else unsuccess.
 */
async function addFriendResolver(_, args){
  try{
    const {email, password, friend} = args;
    let user = await db.collection('users').findOne({email: email});

    // authentication
    if(!user){
      console.log("Error::addFriend::user not found");
      return -1;
    }
    if(user.password != password){
      console.log("Error::addFriend::user email and password dismatch.");
      return -7;
    }

    user.profile.friends.push(friend);
    const result = await db.collection('users').updateOne(
      {email: email},
      {$set: {profile: user.profile}}
    );
    if(result.acknowledged){
      return 1;
    }
    else{
      console.log("Error::addFriend::unsuccessfully database documentation update.");
      return 0;
    }
  } catch (error){
    console.log("Error::addFriend::unknown unsuccess");
    return 0;
  }
}

async function worldRankingResolver(_, args){
  try{
    const result = await db.collection('users').find({});
    //const result = await db.collection('users').find({});
    return result.toArray();
  } catch (error){
    console.log("Error::wordRanking::" + error);
    return 0;
  }
}

/******************************************* 
SERVER INITIALIZATION CODE
********************************************/
const app = express();
// const path = require('path');
// //Attaching a Static web server. 
app.use(express.static('dist')); 

//Creating and attaching a GraphQL API server.
const server = new ApolloServer({
  typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
  resolvers,
  formatError: error => {
    console.log(error);
    return error;
  },
});
server.applyMiddleware({ app, path: '/graphql' });

//Starting the server that runs forever.
  (async function () {
    try {
      await connectToDb();
      app.listen(3000, function () {
        console.log('App started on port 3000');
      });
    } catch (err) {
      console.log('ERROR:', err);
    }
  })();