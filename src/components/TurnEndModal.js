import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';

import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row'

import * as selectors from '../store/selectors';

function TurnEndModal({ show }) {
  const currWord = useSelector(selectors.currWordSelector);
  const currGuess = useSelector(selectors.currGuessSelector);
  const guesser = useSelector(selectors.guesserSelector);

  const isCorrectGuess = !!currGuess && currGuess.toLowerCase() === currWord.toLowerCase();

  const classes = cx('word-to-guess', {
    correct: isCorrectGuess,
    incorrect: !isCorrectGuess,
  });

  return (
    <Modal show={!!currGuess && show}>
      <Modal.Body className='text-center'>
        <Row className='my-3'>
          <Col>
            <p>The word was</p>
            <h2 className='word-to-guess'>{currWord}</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>{guesser && guesser.name} guessed</p>
            <h1 className={classes}>
              {currGuess}
            </h1>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default TurnEndModal;
