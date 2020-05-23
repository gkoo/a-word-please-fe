import React, { useRef } from 'react';
import { useSelector } from 'react-redux';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import ClueCard from './ClueCard';
import { cluesSelector, playersSelector } from '../store/selectors';

import cx from 'classnames';

function CluesView({ largeView, redactDuplicates }) {
  const clues = useSelector(cluesSelector);

  return (
    <>
      {
        Object.keys(clues).map(playerId => {
          const clueData = clues[playerId];
          return (
            <ClueCard clueData={clueData} playerId={playerId} />
          );
        })
      }
    </>
  );
}

export default CluesView;
