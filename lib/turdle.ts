const responses = {
  INVITE: (username, admin_username, admin_gender = 'male') => 
    `Hi ${username}!
    My name's Turdle 💩
    I'm an artifically unintelligent Wordle-Bot designed by Colin Santee to keep track of Wordle statistics.
    ${admin_username} sent me to invite you to ${admin_gender === 'female' ? 'her' : 'his'} Wordle leaderboard on https://colinjsantee.com.
    To get started send me a copy of your results from today's Wordle.
    - 💩`,
  INVALID_RESULTS: 
    `Huh, that doesn\'t look like Wordle results to me. 
    To get your results for today\'s Wordle click on the podium icon at the top of your screen and then click Share.
    - 💩`,
  ONE_GUESS: 
    `WOW! One guess?! You must be cheating, but if you're not, that's really impressive.
    - 💩`,
  TWO_GUESSES:
    `Impressive!`
};
