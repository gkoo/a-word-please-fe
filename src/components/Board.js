import React from 'react';
import { useSelector } from 'react-redux';

import {
  STATE_ENTERING_CLUES,
  STATE_REVIEWING_CLUES,
  STATE_ENTERING_GUESS,
  STATE_TURN_END,
  STATE_GAME_END,
} from '../constants';
import DuplicatesModal from './DuplicatesModal';
import EnteringCluesView from './EnteringCluesView';
import EnteringGuessView from './EnteringGuessView';
import GameEndView from './GameEndView';
import TurnEndModal from './TurnEndModal';
import * as selectors from '../store/selectors';

function Board() {
  const clues = useSelector(selectors.cluesSelector);
  const currPlayerIsGuesser = useSelector(selectors.currPlayerIsGuesserSelector);
  const currWord = useSelector(selectors.currWordSelector);
  const gameState = useSelector(selectors.gameStateSelector);
  const guesser = useSelector(selectors.guesserSelector);
  const players = useSelector(selectors.playersSelector);

  let clueGivers;
  if (guesser) {
    clueGivers = Object.values(players).filter(player =>
      player.id !== guesser.id
    );
  } else {
    clueGivers = [];
  }

  return (
    <div className='board'>
      {
        [STATE_ENTERING_CLUES, STATE_REVIEWING_CLUES].includes(gameState) &&
          <EnteringCluesView
            clues={clues}
            clueGivers={clueGivers}
            currPlayerIsGuesser={currPlayerIsGuesser}
            currWord={currWord}
            guesser={guesser}
          />
      }
      {
        gameState === STATE_ENTERING_GUESS &&
          <EnteringGuessView
            clues={clues}
            clueGivers={clueGivers}
            currPlayerIsGuesser={currPlayerIsGuesser}
            currWord={currWord}
            guesser={guesser}
            players={players}
          />
      }
      {
        gameState === STATE_GAME_END &&
          <GameEndView />
      }
      <DuplicatesModal show={gameState === STATE_REVIEWING_CLUES}/>
      <TurnEndModal show={gameState === STATE_TURN_END}/>
    </div>
  );
}

export default Board;
