import React from 'react';
import { useSelector } from 'react-redux';

import cx from 'classnames';
import Modal from 'react-bootstrap/Modal';

import * as selectors from '../store/selectors';

function DuplicatesModal({ show }) {
  const clues = useSelector(selectors.cluesSelector);
  const currPlayerIsGuesser = useSelector(selectors.currPlayerIsGuesserSelector);
  const players = useSelector(selectors.playersSelector);

  return (
    <Modal show={show && !currPlayerIsGuesser} className='mt-5'>
      <Modal.Body>
        <h2>Your clues</h2>
        <div className='text-center'>
          {
            Object.keys(clues).map(playerId => {
              const clueData = clues[playerId];
              const classes = cx({ duplicate: clueData.isDuplicate });
              return (
                <div className='clue'>
                  {players[playerId].name}: <span className={classes}>{clueData.clue}</span>
                </div>
              );
            })
          }
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default DuplicatesModal;
