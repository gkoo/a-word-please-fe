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
  CARD_PRINCESS,
  //CARD_JESTER,
  CARD_CARDINAL,
  CARD_BARONESS,
  //CARD_SYCOPHANT,
  //CARD_DOWAGER_QUEEN,
  CARD_BISHOP,
  STATE_PENDING,
  STATE_STARTED,
  STATE_GAME_END,
} from '../constants';

// Change to true to develop UI
const useTestState = 1;

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
  alertMessage: undefined,
  //clues: {},
  clues: {
    'gordon': 'wet',
  },
  currWord: 'water',
  currUserId: 'gordon',
  debugEnabled: env !== 'production',
  gameState: STATE_STARTED,
  guesserId: 'yuriko',
  name: 'Gordon',
  players: {
    gordon: {
      id: 'gordon',
      name: 'Gordon',
      isLeader: true,
    },
    steve: {
      id: 'steve',
      name: 'Steve',
    },
    yuriko: {
      id: 'yuriko',
      name: 'Yuriko',
    },
  },
  users: {},
  messages: [],
  socket: io(socketIoServerUrl),
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
        showCardModal: true,
      };

    case actions.CARD_REVEAL:
      return {
        ...state,
        cardReveal: action.payload,
        showCardModal: true,
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
        baronRevealData: null,
        cardReveal: null,
        showCardModal: false,
        switchCardData: null,
        showDrawNewCardModal: false,
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
        showCardModal: true,
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

    case actions.RECEIVE_DEBUG_INFO:
      console.log(action.payload);
      return state;

    case actions.RECEIVE_GAME_DATA:
      const {
        clues,
        currWord,
        guesserId,
        playerOrder,
        roundNum,
      } = action.payload;

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
        clues,
        currWord,
        guesserId,
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

    case actions.SWITCH_CARD_DATA:
      return {
        ...state,
        showCardModal: true,
        switchCardData: action.payload,
      };

    case actions.TOGGLE_DRAW_NEW_CARD:
      return {
        ...state,
        showDrawNewCardModal: action.payload.show,
      };

    case actions.TOGGLE_RULES_MODAL:
      return {
        ...state,
        showRulesModal: action.payload.show,
      };

    default:
      return state;
  }
};
