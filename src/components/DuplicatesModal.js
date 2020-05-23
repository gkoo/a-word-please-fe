import React from 'react';
import { useSelector } from 'react-redux';

import Modal from 'react-bootstrap/Modal';

import CluesView from './CluesView';
import { currPlayerIsGuesserSelector } from '../store/selectors';

function DuplicatesModal({ show }) {
  const currPlayerIsGuesser = useSelector(currPlayerIsGuesserSelector);

  return (
    <Modal show={show && !currPlayerIsGuesser} className='mt-5' animation={false}>
      <Modal.Body className='text-center'>
        <h3>Your clues</h3>
        <div>
          <CluesView redactDuplicates={false} />
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default DuplicatesModal;
