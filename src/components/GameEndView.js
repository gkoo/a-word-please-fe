import React from 'react';

import { useSelector } from 'react-redux';

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import * as selectors from '../store/selectors';

function GameEndView() {
  const numPoints = useSelector(selectors.numPointsSelector);

  return (
    <Row>
      <Col>
        <h1>Game Over!</h1>
        <h2>Total Points: {numPoints}</h2>
      </Col>
    </Row>
  )
}

export default GameEndView;
