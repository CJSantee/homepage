import UserWordle from "../types/models/user_wordle";
import { getRandomInt } from "../utils";

// TODO: Incorporate ChatGPT to generate unique responses
const RESPONSES = {
  SIGNATURE: "\n- 💩",
  INVITE: (username: string, admin_username: string, admin_gender: string = 'male') => `Hi ${username}!\nMy name's Turdle 💩\nI'm an artifically unintelligent Wordle-Bot designed by Colin Santee to keep track of Wordle statistics.\n${admin_username} sent me to invite you to ${admin_gender === 'female' ? 'her' : 'his'} Wordle leaderboard on https://colinjsantee.com.\nTo get started send me a copy of your results from today's Wordle.`,
  INVALID_RESULTS: "Huh, that doesn\'t look like Wordle results to me.\nTo get your results for today\'s Wordle click on the podium icon at the top of your screen and then click Share.",
  WORDLE_ALREADY_SUBMITTED: "Oops! It looks like you've already submit results for this Wordle.",
  GUESSES: {
    CONGRATULATORY: {
      '1': "Wow, you're a Wordle wizard! 🧙‍♂️🌟 Congratulations on guessing the hidden word on your very first attempt! That's some impressive word-solving skills! 🎉🏆",
      '2': "Bravo! 🎉 You're on fire! 🔥 Guessing the Wordle on your second try is an impressive feat. You're a word-solving champ! Keep it up!",
      '3': "Great job! 🎉 Third time's the charm, and you nailed it! You're proving to be a Wordle master. Keep those guesses coming, and let's see if you can keep up the winning streak!",
      '4': "Congratulations! 🎉 Fourth time's a charm for you! You're really honing those word-solving skills. Keep up the fantastic work, and let's see if you can continue to crack the code!",
      '5': "Well done! 🎉 Fifth time's a charm for you! You've shown great determination and word-solving prowess. Keep those guesses coming, and let's see how you conquer the next challenge!",
      '6': "Phew! 🎉 You made it on your very last chance! What a fantastic save! Your dedication to cracking the Wordle code is truly commendable. Keep playing and testing your word skills - you're a true Wordle enthusiast!",
      '-1': "Don't worry, Wordle can be tricky sometimes! 🤔 Failure happens to the best of us. Keep playing and you'll improve with each game. You've got this! 💪",
    },
    SARCASTIC: {
      '1': "Oh, come on! You guessed it on your first try? You must be some kind of Wordle prodigy. 🙄 Just kidding, that's seriously impressive! 🎉",
      '2': "Two tries? You must have psychic word-guessing powers. Or you just got really lucky. 😉 Either way, good job!",
      '3': "Third time's the charm, right? It took you long enough! 😜 Just kidding, you're doing great. Keep up the not-so-speedy word-solving!",
      '4': "Four attempts? Wordle champion material, right here! 😂 But hey, you got it, and that's what counts.",
      '5': "Took you five tries, huh? I guess practice makes perfect...eventually. 😄 Keep those guesses coming!",
      '6': "Six tries, but who's counting? Oh, right, I am. 😅 You're making it suspenseful, that's for sure!",
      '-1': "Well, look who couldn't crack the code! Don't worry; not everyone can be a Wordle genius. 😎",
    },
    COMPETITIVE: {
      '1': "Impressive! You're setting the bar high for Wordle players everywhere. Can anyone catch up to your lightning-fast word-solving skills? 🏆",
      '2': "Two tries? You're making this look easy! Challenge accepted, right? Let's see who can solve the next one even faster!",
      '3': "Nice work! It took you three tries, but you're keeping the competition alive. I'm determined to catch up! 😄",
      '4': "Four tries? I see what you did there—trying to keep us on our toes! Let's keep this Wordle competition fierce and fun!",
      '5': "Five tries, but the race is far from over! This Wordle rivalry is heating up. May the best word-guesser win!",
      '6': "Six attempts? You're making us sweat! The Wordle competition is fierce, and I'm ready for the challenge. Bring it on!",
      '-1': "Couldn't guess it, huh? No worries; it's all part of the Wordle battle. Next time, we'll see who emerges victorious! 🥇",
    },
  }
};

function respondToUserWordle(userWordle: UserWordle): string {
  let response = '';
  
  const {num_guesses, hard_mode} = userWordle;
  // Get random response from GUESSES Tones
  response += Object.values(RESPONSES.GUESSES)[getRandomInt(Object.keys(RESPONSES.GUESSES).length)][num_guesses];

  if(hard_mode) {
    response += '\nP.S. I\'m proud of you for playing on Hard Mode 😉';
  }

  return response+RESPONSES.SIGNATURE;
}

export = {
  inviteUser: RESPONSES.INVITE,
  respondToUserWordle,
  WORDLE_ALREADY_SUBMITTED: RESPONSES.WORDLE_ALREADY_SUBMITTED + RESPONSES.SIGNATURE,
  INVALID_RESULTS: RESPONSES.INVALID_RESULTS + RESPONSES.SIGNATURE,
}
