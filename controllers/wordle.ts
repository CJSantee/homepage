// Useful reference for Emoji parsing in JS: https://thekevinscott.com/emojis-in-javascript/

import db from '../db';
import { ApplicationError } from '../lib/applicationError';
import UserWordle, { GuessRow } from '../types/models/user_wordle';
import Wordle from '../types/models/wordle';

const WORDLE_ERRORS = {
  PARSING_ERROR: {
    type: ApplicationError.TYPES.CLIENT,
    code: 'INVALID_WORDLE_RESULTS',
    message: 'Wordle Results Parsing Error',
    statusCode: 400,
    statusMessage: 'Invalid Wordle results.',
  },
  DUPLICATE_WORDLE: {
    type: ApplicationError.TYPES.CLIENT,
    code: 'WORDLE_ALREADY_SUBMITTED',
    message: 'Duplicate User Wordle Submitted',
    statusCode: 400,
    statusMessage: 'You have already submit results for this Wordle.',
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
function parseGuessRows(rows: string): GuessRow[] {
  return rows.split('\n').map(r => r.split(/(?:)/u).map(char => {
    if(white.includes(char)) {
      return 'w';
    } else if(yellow.includes(char)) {
      return 'y';
    } else if (green.includes(char)) {
      return 'g';
    } else {
      throw new Error('Unexpected Character');
    }
  }));
}

export function parseWordleResults(results) {
  const wordleRegex = /Wordle (\d+) (\d{1}|X)\/6(\**)[\n\r\s]+((?:(?:[\u2b1b-\u2b1c]|(?:\ud83d[\udfe6-\udfe9])){5}[\n\r\s]*){1,6})/;
  try {
    const [wordleNumber, numGuesses, hardMode, guessRows] = results.match(wordleRegex).slice(1);
    const guess_rows = parseGuessRows(guessRows);
    return {
      wordle_number: Number(wordleNumber), 
      num_guesses: numGuesses === 'X' ? -1 : Number(numGuesses), 
      hard_mode: !!hardMode, 
      guess_rows,
    };
  } catch(err) {
    throw new ApplicationError(WORDLE_ERRORS.PARSING_ERROR);
  }
}

export async function insertUserWordle(user_id: string, results: string): Promise<UserWordle> {
  const {wordle_number, num_guesses, hard_mode, guess_rows} = parseWordleResults(results);
  try {
    const {rows: [userWordle]} = await db.file('db/user_wordles/put.sql', {
      user_id,
      wordle_number,
      num_guesses,
      hard_mode,
      guess_rows: JSON.stringify(guess_rows),
    });
    return userWordle;
  } catch(err: any) {
    if(err.constraint === 'user_id_wordle_number_idx') {
      throw new ApplicationError(WORDLE_ERRORS.DUPLICATE_WORDLE);
    } 
    throw new Error(err);
  }
}

export async function getUserWordleStats(user_id:string) {
  const {rows: [stats]} = await db.file('db/user_wordles/get_stats.sql', {user_id});
  return stats;
}

export async function getWordleLeaderboard() {
  const {rows: leaderboard} = await db.file('db/user_wordles/get_leaderboard.sql');
  return leaderboard;
}

export async function insertWordle({wordle, wordle_number, wordle_date}:Wordle) {
  const {rows: [wordleRow]} = await db.file('db/wordles/put.sql', {wordle, wordle_number, wordle_date});
  return wordleRow;
}
