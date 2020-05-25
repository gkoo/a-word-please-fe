import { env } from '../constants';
import * as actions from './actions';

import {
  STATE_PENDING,
  STATE_ENTERING_CLUES,
  STATE_REVIEWING_CLUES,
  STATE_ENTERING_GUESS,
  STATE_TURN_END,
  STATE_GAME_END,
} from '../constants';
import { newSocket } from '../socket';

// Change to true to develop UI
const useTestState = 0;

const initialState = {
  alerts: [],
  debugEnabled: env !== 'production',
  gameState: STATE_PENDING,
  nextAlertId: 0,
  players: {},
  socketConnected: false,
  users: {},
  messages: [],
  socket: null,
};

const testState = {
  alerts: [
    {
      id: 0,
      message: 'Gordon is dumb!',
      type: 'danger',
    },
    {
      id: 1,
      message: 'No he\'s not!',
      type: 'primary',
    },
  ],
  //clues: {},
  clues: {
    'steve': {
      clue: 'wet',
      isDuplicate: true,
    },
    'gordon': {
      clue: 'fire',
      isDuplicate: false,
    },
  },
  currWord: 'water',
  currUserId: 'gordon',
  currGuess: 'hydrant',
  debugEnabled: env !== 'production',
  //gameState: STATE_ENTERING_CLUES,
  //gameState: STATE_REVIEWING_CLUES,
  //gameState: STATE_ENTERING_GUESS,
  gameState: STATE_TURN_END,
  //gameState: STATE_GAME_END,
  //guesserId: 'gordon',
  guesserId: 'willy',
  name: 'Gordon',
  nextAlertId: 5,
  numPoints: 7,
  players: {
    gordon: {
      id: 'gordon',
      name: 'Gordon',
      isLeader: true,
      color: 'blue',
    },
    steve: {
      id: 'steve',
      name: 'Steve',
      color: 'indigo',
    },
    yuriko: {
      id: 'yuriko',
      name: 'Yuriko',
      color: 'purple',
    },
    aj: {
      id: 'aj',
      name: 'AJ',
      color: 'pink',
    },
    willy: {
      id: 'willy',
      name: 'Willy',
      color: 'red',
    },
    rishi: {
      id: 'rishi',
      name: 'Rishi',
      color: 'orange',
    },
  },
  roundNum: 0,
  showRulesModal: false,
  socket: null,
  totalNumRounds: 13,
  users: {
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
};

const stateToUse = useTestState ? testState : initialState;

const colors = [
  'blue',
  'indigo',
  'purple',
  'pink',
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'cyan',
  'warning',
  'danger',
];

const getColorForPlayerName = name => {
  const letters = name.split('');
  const charCodes = letters.map(letter => letter.charCodeAt(0));
  const sum = charCodes.reduce((currSum, currCode) => currSum + currCode);
  return colors[sum % colors.length];
};

export default function reducer(state = stateToUse, action) {
  let name, newPlayers, newUsers, players;

  switch(action.type) {
    case actions.CONNECT_SOCKET:
      state.socket.open();
      return {
        ...state,
        socketConnected: true,
      }

    case actions.DISMISS_ALERT:
      const { id } = action.payload;
      const { alerts } = state;
      const alertIdx = alerts.findIndex(alert => alert.id === id);
      return {
        ...state,
        alerts: [
          ...alerts.slice(0, alertIdx),
          ...alerts.slice(alertIdx+1),
        ],
      };

    case actions.DISCONNECT_SOCKET:
      state.socket.close();
      return {
        ...state,
        socketConnected: false,
      }

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

    case actions.NEW_SOCKET:
      const socket = newSocket();
      return {
        ...state,
        socket,
      };

    case actions.NEW_USER:
      const userId = action.payload.id;
      const isLeader = action.payload.isLeader;
      name = action.payload.name;
      const oldUser = state.users[userId] || {};

      return {
        ...state,
        users: {
          ...state.users,
          [userId]: {
            ...oldUser,
            name,
            isLeader,
          },
        },
      };

    // When another user has disconnected
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
        // Add an alert to notify that the user has disconnected
        alerts: [
          ...state.alerts,
          {
            id: state.nextAlertId,
            message: `${state.players[action.payload.userId].name} has disconnected`,
            type: 'danger',
          }
        ],
        // Increment the id for the next alert
        nextAlertId: state.nextAlertId + 1,
        // Mark the user as disconnected
        players: {
          ...state.players,
          [disconnectedUserId]: {
            ...state.players[disconnectedUserId],
            connected: false,
          },
        },
        users: newUsers,
      }

    case actions.NEW_ALERT:
      const { message, type } = action.payload;
      let { nextAlertId } = state;

      const alert = {
        id: nextAlertId,
        message,
        type,
      };
      return {
        ...state,
        alerts: [...state.alerts, alert],
        nextAlertId: nextAlertId + 1,
      };

    case actions.RECEIVE_DEBUG_INFO:
      console.log(action.payload);
      return state;

    case actions.RECEIVE_GAME_DATA:
      const {
        clues,
        currGuess,
        currWord,
        guesserId,
        numPoints,
        playerOrder,
        roundNum,
        skippedTurn,
        totalNumRounds,
      } = action.payload;

      const gameState = action.payload.state;
      players = action.payload.players;

      newPlayers = {};
      Object.keys(players).forEach(playerId => {
        const color = getColorForPlayerName(players[playerId].name);
        newPlayers[playerId] = {
          ...state.players[playerId],
          ...players[playerId],
          color,
        }
      });

      return {
        ...state,
        clues,
        currGuess,
        currWord,
        guesserId,
        gameState,
        numPoints,
        players: newPlayers,
        playerOrder,
        roundNum,
        skippedTurn,
        totalNumRounds,
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
        debugEnabled: name.toLowerCase() === 'gordon' || state.debugEnabled, // >_<
        name: name,
      };

    case actions.SHOW_ALERT:
      return {
        ...state,
        alertMessage: action.payload,
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
