import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button';

import CluesView from './CluesView';
import * as selectors from '../store/selectors';

const MAX_GUESS_LENGTH = 20;

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
    setGuess(e.target.value.substring(0, MAX_GUESS_LENGTH).replace(/[^\w]/g, ''));
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
          <h1>Here are some clues:</h1>
          <CluesView redactDuplicates={true} />
        </Col>
      </Row>
      {
        currPlayerIsGuesser &&
          <Row>
            <Col sm={8} md={{ span: 6, offset: 3 }} className='text-center'>
              <Form onSubmit={onSubmit}>
                <h1 className='mb-4'>Enter a guess</h1>
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
              <h1>{guesser && guesser.name} is entering a guess!</h1>
            </Col>
          </Row>
      }
    </>
  );
}

export default EnteringCluesView;
