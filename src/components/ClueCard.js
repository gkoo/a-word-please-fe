import React, { useRef } from 'react';
import { useSelector } from 'react-redux';

import Overlay from 'react-bootstrap/Overlay'
import Tooltip from 'react-bootstrap/Tooltip';
import cx from 'classnames';

import { playersSelector } from '../store/selectors';

function ClueCard({ clueData, playerId }) {
  const target = useRef(null);
  const players = useSelector(playersSelector);

  const player = players[playerId];

  return (
    <>
      <div ref={target} className={`player-label ${player.color}`}>
        {player.name}
      </div>
      <br />
      <Overlay target={target.current} show={true} placement="right">
        {
          (props) =>
            <Tooltip className={cx('clue-label', { duplicate: clueData.isDuplicate })} {...props}>
              {clueData.clue}
              {
                clueData.isDuplicate &&
                  <span>
                    { ' ❌' }
                  </span>
              }
            </Tooltip>
        }
      </Overlay>
    </>
  );
}

export default ClueCard;
