import UserWordle from "../types/models/user_wordle";
import { getRandomInt } from "../utils";

const SIGNATURE = "\n- 💩";

function templateResponse<T extends object>(response: string) {
  const params = response.match(/(?<=\[).+?(?=\])/g);
  if(!params?.length) {
    throw new Error('Missing template params');
  }
  return ({...params}: T) => {
    let res = response;
    Object.keys(params).forEach((param) => {
      const regex = new RegExp(`\\[${param}\\]`, "g");
      res = res.replace(regex, params[param]);
    });
    return res + SIGNATURE;
  }
}

// TODO: Incorporate ChatGPT to generate unique responses
const TEMPLATE_RESPONSES = {
  INVITE: templateResponse<{username:string}>("Hi [username]!\nMy name's Turdle 💩\nI'm an artifically unintelligent Wordle-Bot designed by Colin Santee to keep track of Wordle statistics.\nColin sent me to invite you to his Wordle leaderboard. To get started send me a copy of your results from today's Wordle."),
  USER_OPT_IN: templateResponse<{username:string}>("Hi [username]!\nMy name's Turdle 💩\nI'm an artifically unintelligent Wordle-Bot designed by Colin Santee to keep track of Wordle statistics.\nThanks for joining the learderboard. To get started send me a copy of your results from today's Wordle."),
};

interface GuessResponses {
  '1': string,
  '2': string,
  '3': string,
  '4': string,
  '5': string,
  '6': string,
  '-1': string,
}
const GUESS_RESPONSES: {[tone: string]: GuessResponses} = {
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
};

const RESPONSES = {
  OPT_IN: "You have successfully subscribed to Turdle 💩, Colin Santee's Wordle-Bot. Message and data rates may apply. Reply Help for additional support. Reply STOP to unsubscribe.",
  OPT_OUT: "You have successfully been unsubscribed from Turdle 💩, Colin Santee's Wordle-Bot. You will not receive any more messages from this number.",
  INVALID_RESULTS: "Huh, that doesn\'t look like Wordle results to me.\nTo get your results for today\'s Wordle click on the podium icon at the top of your screen and then click Share." + SIGNATURE,
  WORDLE_ALREADY_SUBMITTED: "Oops! It looks like you've already submit results for this Wordle." + SIGNATURE,
  REQUEST_WORDLE: "By the way, I haven't figured out the today's Wordle myself yet, do you mind sharing it with me so I can make sure everyone else isn't cheating?" + SIGNATURE,
  WORDLE_RECEIVED: "Thanks for sharing today's Wordle!" + SIGNATURE,
};

function respondToUserWordle(userWordle: UserWordle): string {
  let response = '';
  
  const {num_guesses, hard_mode} = userWordle;
  // Get random response from GUESSES Tones
  response += Object.values(GUESS_RESPONSES)[getRandomInt(Object.keys(GUESS_RESPONSES).length)][num_guesses];

  if(hard_mode) {
    response += '\nP.S. I\'m proud of you for playing on Hard Mode 😉';
  }

  return response+SIGNATURE;
}

export = {
  respondToUserWordle,
  ...TEMPLATE_RESPONSES,
  ...RESPONSES,
};

