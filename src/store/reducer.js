import io from 'socket.io-client';

import { env } from '../constants';
import * as actions from './actions';

import {
  socketIoServerUrl,
  CARD_GUARD,
  //CARD_PRIEST,
  CARD_BARON,
  //CARD_HANDMAID,
  CARD_PRINCE,
  //CARD_KING,
  //CARD_COUNTESS,
  //CARD_PRINCESS,
  //CARD_JESTER,
  //CARD_CARDINAL,
  //CARD_BARONESS,
  //CARD_SYCOPHANT,
  //CARD_DOWAGER_QUEEN,
  //CARD_BISHOP,
  STATE_PENDING,
  STATE_STARTED,
  STATE_GAME_END,
} from '../constants';

// Change to true to develop UI
const useTestState = false;

const initialState = {
  alertMessage: undefined,
  debugEnabled: env !== 'production',
  gameState: STATE_PENDING,
  players: {},
  users: {},
  messages: [],
  socket: io(socketIoServerUrl),
};
const testState = {
  ...initialState,
  activePlayerId: 'gordon',
  currUserId: 'gordon',
  gameState: STATE_STARTED,
  name: 'Gordon',
  //lastCardPlayed: {
    //playerId: 'gordon',
    //card: { id: 2, type: 5 },
    //discarded: true,
  //},
  players: {
    gordon: {
      id: 'gordon',
      name: 'Gordon',
      discardPile: [
        { id: 101, type: CARD_BARON },
      ],
      isLeader: true,
      hand: [{ id: 100, type: CARD_GUARD }],
    },
    steve: {
      id: 'steve',
      name: 'Steve',
      hand: [
        { id: 0, type: CARD_PRINCE },
      ],
      discardPile: [{ id: 103, type: CARD_GUARD }],
    },
  },
  playerOrder: ['gordon', 'steve'],
};

const stateToUse = useTestState ? testState : initialState;

export default function reducer(state = stateToUse, action) {
  let name, newMessages, newPlayers, newUsers, players;

  switch(action.type) {
    case actions.BARON_REVEAL:
      const baronRevealData = action.payload;
      return {
        ...state,
        baronRevealData,
      };

    case actions.CLOSE_END_GAME_MODAL:
      return {
        ...state,
        winnerIds: undefined,
      };

    case actions.DISMISS_ALERT_MESSAGE:
      return {
        ...state,
        alertMessage: undefined,
      };

    case actions.DISMISS_REVEAL:
      return {
        ...state,
        baronRevealData: undefined,
        showLastCardPlayed: false,
        priestRevealCard: undefined,
      };

    case actions.END_GAME:
      const winnerIds = action.payload;
      let alertMessage;
      if (winnerIds) {
        const winnerNames = winnerIds && winnerIds.map(winnerId => state.players[winnerId].name);
        alertMessage = `${winnerNames.join(' and ')} won the game!`;
      } else {
        alertMessage = 'The game has ended.';
      }
      return {
        ...state,
        gameState: STATE_GAME_END,
        alertMessage,
      };

    case actions.JOIN_ROOM:
      return {
        ...state,
        roomCode: action.payload,
      };

    case actions.LAST_CARD_PLAYED:
      return {
        ...state,
        lastCardPlayed: action.payload,
        showLastCardPlayed: true,
      };

    case actions.NEW_LEADER:
      const { userId } = action.payload;
      const user = {
        ...state.users[userId],
        isLeader: true,
      };
      newUsers = {
        ...state.users,
        [userId]: user,
      };
      return {
        ...state,
        users: newUsers,
      };

    case actions.NEW_USER:
      const { id, isLeader } = action.payload;
      name = action.payload.name;
      const oldUser = state.users[id] || {};

      return {
        ...state,
        users: {
          ...state.users,
          [id]: {
            ...oldUser,
            name,
            isLeader,
          },
        },
      };

    case actions.USER_DISCONNECT:
      const disconnectedUserId = action.payload.userId;
      newUsers = {};
      Object.keys(state.users).forEach(userId => {
        if (disconnectedUserId !== userId) {
          newUsers[userId] = state.users[userId];
        }
      });
      return {
        ...state,
        players: {
          ...state.players,
          [disconnectedUserId]: {
            ...state.players[disconnectedUserId],
            connected: false,
          },
        },
        users: newUsers,
      }

    case actions.NEW_MESSAGE:
      newMessages = [...state.messages, action.payload.message];
      return {
        ...state,
        messages: newMessages,
      };

    case actions.PRIEST_REVEAL:
      return {
        ...state,
        priestRevealCard: action.payload.card,
      };

    case actions.RECEIVE_DEBUG_INFO:
      console.log(action.payload);
      return state;

    case actions.RECEIVE_GAME_DATA:
      const { activePlayerId, playerOrder, roundNum } = action.payload;
      const gameState = action.payload.state;
      players = action.payload.players;

      newPlayers = {};
      Object.keys(players).forEach(playerId => {
        newPlayers[playerId] = {
          ...state.players[playerId],
          ...players[playerId],
        }
      });

      return {
        ...state,
        activePlayerId,
        gameState,
        players: newPlayers,
        playerOrder,
        roundNum,
      };

    case actions.RECEIVE_INIT_DATA:
      const { currUserId, messages, users } = action.payload;
      return {
        ...state,
        currUserId,
        messages,
        users,
      };

    case actions.SAVE_NAME:
      name = action.payload.name;
      return {
        ...state,
        debugEnabled: name === 'Gordon' || state.debugEnabled, // >_<
        name: name,
      };

    case actions.SHOW_ALERT:
      return {
        ...state,
        alertMessage: action.payload,
      };

    default:
      return state;
  }
};
