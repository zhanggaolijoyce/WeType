// initmongo.js

//To execute:
//$mongo team1 initmongo.js 
//Above command to be executed from the directory where initmongo.js is present
db.dropDatabase();

// Create a collection for User Service (USV)
db.createCollection("users");
// Optionally, you can define indexes or validations for the "users" collection here

// Insert a sample user with an "id" field
db.users.insertOne({
  email: "example@example.com",
  password: "abcdefg",
  profile: {
    name: "example",
    avatar: 0,        // avatar
	  preferred_style: 0,	// 0: pink default, 1: blue
	  history: {
      key: ["2023-11-27"],
      value: [3]
    },
	  total_practice_time: 3,
    total_practice_words: 1000,
    friends: ["friend@example.com"]
  }
});
