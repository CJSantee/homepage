type LetterGuess = 'w' | 'y' | 'g';

export type GuessRow = LetterGuess[];

export default interface UserWordle {
  user_wordle_id: string,
  user_id: string,
  wordle_number: number,
  num_guesses: number,
  hard_mode: boolean,
  guess_rows: GuessRow[]
};
