import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button';

import * as selectors from '../store/selectors';

function EnteringCluesView({
  clues,
  clueGivers,
  currPlayerIsGuesser,
  currWord,
  guesser,
}) {
  const [clue, setClue] = useState('');
  const socket = useSelector(selectors.socketSelector);

  const onEnterClue = e => {
    e.preventDefault();
    setClue(e.target.value.replace(/[^\w]/g, ''));
  };

  const onSubmit = e => {
    e.preventDefault();
    socket.emit('submitClue', clue);
    setClue('');
  };

  return (
    <>
      {
        currPlayerIsGuesser &&
          <Row className='text-center'>
            <Col>
              <h1>Waiting for clues...</h1>
            </Col>
          </Row>
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
                <Form onSubmit={onSubmit}>
                  <InputGroup>
                    <Form.Control
                      onChange={onEnterClue}
                      placeholder="Enter a one-word clue"
                      type="text"
                      value={clue}
                    />
                    <Button type='submit'>Submit</Button>
                  </InputGroup>
                </Form>
              </Col>
            </Row>
            <Row>
              <Col sm={{ span: 10, offset: 1 }}>
                <p className='help-text mt-3'>
                  Think of a clue (one word only) that will help {guesser.name} guess the word!
                  Make sure it's unique; if someone else chooses the same clue, it will not be shown
                  to {guesser.name}.
                </p>
              </Col>
            </Row>
          </>
      }
    </>
  );
}

export default EnteringCluesView;
