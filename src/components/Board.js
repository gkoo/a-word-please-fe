import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import * as selectors from '../store/selectors';

function Board() {
  const [clue, setClue] = useState('');

  const clues = useSelector(selectors.cluesSelector);
  const currWord = useSelector(selectors.currWordSelector);
  const guesserId = useSelector(selectors.guesserIdSelector);
  const currUserId = useSelector(selectors.currUserIdSelector);
  const players = useSelector(selectors.playersSelector);
  const socket = useSelector(selectors.socketSelector);
  const dispatch = useDispatch();
  const currPlayerIsGuesser = currUserId === guesserId;

  const onSubmit = e => {
    e.preventDefault();
    socket.emit('submitClue', clue);
    setClue('');
  };

  const onChange = e => {
    e.preventDefault();
    setClue(e.target.value.replace(/\s/g, ''));
  };

  const nonGuessers = Object.values(players).filter(player =>
    player.id !== guesserId
  );

  return (
    <>
      {
        currPlayerIsGuesser &&
          <h1>Waiting for words...</h1>
      }
      {
        !currPlayerIsGuesser &&
          <>
            <Row>
              <Col className='text-center'>
                <h6>The word is:</h6>
                <h2 className='word-to-guess'>{currWord}</h2>
              </Col>
            </Row>
            <Row>
              <Col sm={8} md={{ span: 6, offset: 3 }} className='text-center'>
                <Form>
                  <InputGroup>
                    <Form.Control
                      onChange={onChange}
                      placeholder="Enter a one-word clue"
                      type="text"
                      value={clue}
                    />
                    <Button onClick={onSubmit}>Submit</Button>
                  </InputGroup>
                </Form>
              </Col>
            </Row>
            <Row className='my-5'>
              <Col className='text-center'>
                {
                  nonGuessers.map(nonGuesser =>
                    <div>
                      {clues[nonGuesser.id] && '✅ '}
                      {nonGuesser.name}
                    </div>
                  )
                }
              </Col>
            </Row>
          </>
      }
    </>
  );
}

export default Board;
