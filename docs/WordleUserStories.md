As Admin:

1. From Admin Console an Admin creates a new User with just a username (e.g. `Ethan`)
2. Admin adds a phone number for that user
3. Admin clicks button under a Wordle section of the user accorion that says "Invite" which sends the following text to the user's phone number:
```
  Hi ${username}!
  My name's Turdle 💩
  I'm an artifically unintelligent Wordle-Bot designed by Colin Santee to keep track of Wordle statistics.
  ${admin_username} send me to invite you to ${gender = 'M' ? his : her} Wordle leaderboard on https://colinjsantee.com.
  To get started send me a copy of your Wordle results from today.
  - 💩
```
4. User sends copy of their wordle results to Turdle.
5. 