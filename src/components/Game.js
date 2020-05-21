import React from 'react';
import { useDispatch } from 'react-redux';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Board from './Board';
import LeaderPanel from './LeaderPanel';

import { toggleRulesModal } from '../store/actions';

function Game({ socket, messages, users }) {
  const dispatch = useDispatch();

  const onShowRulesModal = () => dispatch(toggleRulesModal({ show: true }));

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
