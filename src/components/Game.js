import React from 'react';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Board from './Board';
import LeaderPanel from './LeaderPanel';

function Game({ socket, messages, users }) {
  return (
    <>
      <Row>
        <Col>
          <LeaderPanel numUsers={Object.keys(users).length}/>
          <Board />
        </Col>
      </Row>
    </>
  );
}

export default Game;
