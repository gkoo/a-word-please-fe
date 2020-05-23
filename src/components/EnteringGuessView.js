import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button';
import cx from 'classnames';

import * as selectors from '../store/selectors';

function EnteringCluesView({
  clues,
  clueGivers,
  currPlayerIsGuesser,
  currWord,
  guesser,
  players,
}) {
  const [guess, setGuess] = useState('');
  const socket = useSelector(selectors.socketSelector);

  const onEnterGuess = e => {
    e.preventDefault();
    setGuess(e.target.value.replace(/[^\w]/g, ''));
  };

  const onSubmit = e => {
    e.preventDefault();
    if (!currPlayerIsGuesser) { return; }
    socket.emit('submitGuess', guess);
    setGuess('');
  };

  return (
    <>
      <Row>
        <Col className='text-center mb-5'>
          <h4>Here are some clues:</h4>
          {
            Object.keys(clues).map(clueGiverId => {
              const clueData = clues[clueGiverId];
              const clueGiver = players[clueGiverId];
              return (
                <div>
                  <span className={`inline-player-label ${clueGiver.color}`}>{clueGiver.name}</span>:{' '}
                  <span className={cx({ duplicate: clueData.isDuplicate })}>
                    {clueData.isDuplicate ? '[redacted]' : clueData.clue}
                  </span>
                </div>
              );
            })
          }
        </Col>
      </Row>
      {
        currPlayerIsGuesser &&
          <Row>
            <Col sm={8} md={{ span: 6, offset: 3 }} className='text-center'>
              <Form onSubmit={onSubmit}>
                <h1>Enter a guess</h1>
                <InputGroup>
                  <Form.Control
                    onChange={onEnterGuess}
                    placeholder="Guess the word"
                    type="text"
                    value={guess}
                  />
                  <Button type='submit'>Submit</Button>
                </InputGroup>
              </Form>
            </Col>
          </Row>
      }
      {
        !currPlayerIsGuesser &&
          <Row className='text-center'>
            <Col>
              <h3>{guesser.name} is entering a guess!</h3>
            </Col>
          </Row>
      }
    </>
  );
}

export default EnteringCluesView;
