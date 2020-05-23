import { createSelector } from 'reselect';

export const alertMessageSelector = state => state.alertMessage;
export const debugEnabledSelector = state => state.debugEnabled;
export const gameStateSelector = state => state.gameState;
export const playersSelector = state => state.players;
export const usersSelector = state => state.users;
export const messagesSelector = state => state.messages;
export const nameSelector = state => state.name;
export const socketSelector = state => state.socket;
export const currUserIdSelector = state => state.currUserId;
export const currUserSelector = createSelector(
  currUserIdSelector,
  usersSelector,
  (currUserId, users) => users[currUserId],
)
export const currPlayerSelector = createSelector(
  currUserIdSelector,
  playersSelector,
  (currUserId, players) => players[currUserId],
)
// the id of the player whose turn it is
export const guesserIdSelector = state => state.guesserId;
export const guesserSelector = createSelector(
  playersSelector,
  guesserIdSelector,
  (players, guesserId) => players[guesserId]
);
export const roomCodeSelector = state => state.roomCode;
export const showRulesModalSelector = state => state.showRulesModal;
export const currWordSelector = state => state.currWord;
export const currGuessSelector = state => state.currGuess;
export const cluesSelector = state => state.clues;
export const currPlayerIsGuesserSelector = createSelector(
  currUserIdSelector,
  guesserIdSelector,
  (currUserId, guesserId) => currUserId === guesserId,
);
export const numPointsSelector = state => state.numPoints;
export const roundNumSelector = state => state.roundNum;
export const totalNumRoundsSelector = state => state.totalNumRounds;
export const numRoundsLeftSelector = createSelector(
  roundNumSelector,
  totalNumRoundsSelector,
  (roundNum, totalNumRounds) => totalNumRounds - roundNum,
);
