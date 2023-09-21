// Useful reference for Emoji parsing in JS: https://thekevinscott.com/emojis-in-javascript/

import db from '../db';
import { ApplicationError } from '../lib/applicationError';

const WORDLE_ERRORS = {
  PARSING_ERROR: {
    type: ApplicationError.TYPES.CLIENT,
    code: 'INVALID_WORDLE_RESULTS',
    message: 'Invalid Wordle results.',
    statusCode: 400,
  },
};

// Unicode Variables
const whiteSquare = '\u2b1c';
const blackSquare = '\u2b1b';
const white = [whiteSquare, blackSquare];

const yellowSquare = '\ud83d\udfe8';
const blueSquare = '\ud83d\udfe6';
const yellow = [yellowSquare, blueSquare];

const greenSquare = '\ud83d\udfe9';
const orangeSquare = '\ud83d\udfe7'; 
const green = [greenSquare, orangeSquare];

/**
 * @description Convert result rows into arrays of 'w'|'y'|'g' 
 */
function parseGuessRows(rows: string) {
  return rows.split('\n').map(r => r.split(/(?:)/u).map(char => {
    if(white.includes(char)) {
      return 'w';
    } else if(yellow.includes(char)) {
      return 'y';
    } else if (green.includes(char)) {
      return 'g';
    } else {
      throw new ApplicationError(WORDLE_ERRORS.PARSING_ERROR);
    }
  }));
}

function parseWordleResults(results) {
  const wordleRegex = /Wordle (\d+) (\d{1}|X)\/6(\**)[\n\r\s]+((?:(?:[\u2b1b-\u2b1c]|(?:\ud83d[\udfe6-\udfe9])){5}[\n\r\s]*){1,6})/;
  const [wordleNumber, numGuesses, hardMode, guessRows] = results.match(wordleRegex).slice(1);
  const guess_rows = parseGuessRows(guessRows);
  if(!wordleNumber || !numGuesses || !guess_rows) {
    throw new ApplicationError(WORDLE_ERRORS.PARSING_ERROR);
  }
  return {
    wordle_number: Number(wordleNumber), 
    num_guesses: numGuesses === 'X' ? -1 : Number(numGuesses), 
    hard_mode: !!hardMode, 
    guess_rows,
  };
}

export async function insertUserWordle(user_id, results) {
  const {wordle_number, num_guesses, hard_mode, guess_rows} = parseWordleResults(results);
  const {rows: [userWordle]} = await db.file('db/user_wordles/put.sql', {
    user_id,
    wordle_number,
    num_guesses,
    hard_mode,
    guess_rows: JSON.stringify(guess_rows),
  });

  return userWordle;
}

export async function getUserWordleStats(user_id) {
  const {rows: [stats]} = await db.file('db/user_wordles/get_stats.sql', {user_id});
  return stats;
}
