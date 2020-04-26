import { createSelector } from 'reselect';

export const alertMessageSelector = state => state.alertMessage;
export const debugEnabledSelector = state => state.debugEnabled;
export const gameStateSelector = state => state.gameState;
export const playersSelector = state => state.players;
export const messagesSelector = state => state.messages;
export const nameSelector = state => state.name;
export const socketSelector = state => state.socket;
export const currPlayerIdSelector = state => state.currPlayerId;
export const currPlayerSelector = state => state.players[state.currPlayerId];
// the id of the player whose turn it is
export const activePlayerIdSelector = state => state.activePlayerId;
export const activePlayerSelector = createSelector(
  playersSelector,
  activePlayerIdSelector,
  (players, activePlayerId) => players[activePlayerId]
);
export const currPlayerHandSelector = createSelector(
  currPlayerSelector,
  currPlayer => currPlayer && currPlayer.hand,
);
export const baronRevealDataSelector = state => state.baronRevealData;
export const priestRevealCardSelector = state => state.priestRevealCard;
export const winnerIdsSelector = state => state.winnerIds;
