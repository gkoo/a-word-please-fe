import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import Button from 'react-bootstrap/Button';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import cx from 'classnames';

import {
  CARD_GUARD,
  CARD_PRIEST,
  CARD_BARON,
  CARD_HANDMAID,
  CARD_PRINCE,
  CARD_KING,
  CARD_COUNTESS,
  CARD_PRINCESS,
} from '../constants';
import { showAlert } from '../store/actions';

function Card({
  allPlayers,
  card,
  clickable,
  clickCallback,
  currPlayerId,
  currHand,
  isActivePlayer,
  isDiscard,
  isRevealCard,
}) {
  const [guardTargetId, setGuardTargetId] = useState('');
  const [guardNumberGuess, setGuardNumberGuess] = useState('');
  const [showTargetOptions, setShowTargetOptions] = useState(false);
  const dispatch = useDispatch();
  const popoverTarget = useRef(null);
  const hasTargetEffect = [
    CARD_GUARD,
    CARD_PRIEST,
    CARD_BARON,
    CARD_PRINCE,
    CARD_KING,
  ].includes(card.type);

  const enumsToValues = {
    [CARD_GUARD]: {
      label: 'Guard',
      value: '1',
    },
    [CARD_PRIEST]: {
      label: 'Priest',
      value: '2',
    },
    [CARD_BARON]: {
      label: 'Baron',
      value: '3',
    },
    [CARD_HANDMAID]: {
      label: 'Handmaid',
      value: '4',
    },
    [CARD_PRINCE]: {
      label: 'Prince',
      value: '5',
    },
    [CARD_KING]: {
      label: 'King',
      value: '6',
    },
    [CARD_COUNTESS]: {
      label: 'Countess',
      value: '7',
    },
    [CARD_PRINCESS]: {
      label: 'Princess',
      value: '8',
    },
  };

  const { label, value } = enumsToValues[card.type];

  const handleClick = card => {
    if (!clickable) { return; }
    if (isDiscard) { return; }

    const currHandTypes = currHand.map(card => card.type);
    const hasCountess = currHandTypes.includes(CARD_COUNTESS);
    const hasKing = currHandTypes.includes(CARD_KING);
    const hasPrince = currHandTypes.includes(CARD_PRINCE);

    if (hasCountess && (hasKing || hasPrince)) {
      if (card.type !== CARD_COUNTESS) {
        const warningMsg = 'If you ever have the Countess and either the King or Prince in your ' +
          'hand, you must discard the Countess.';
        dispatch(showAlert(warningMsg));
        return;
      }
    }

    if (hasTargetEffect) {
      setShowTargetOptions(!showTargetOptions);
      return;
    }

    clickCallback({ card, effectData: {} });
  };

  const classNames = cx('game-card', {
    discard: isDiscard,
    clickable,
    expanded: isActivePlayer || isRevealCard,
    guard: card.type === CARD_GUARD,
    priest: card.type === CARD_PRIEST,
    baron: card.type === CARD_BARON,
    handmaid: card.type === CARD_HANDMAID,
    prince: card.type === CARD_PRINCE,
    king: card.type === CARD_KING,
    countess: card.type === CARD_COUNTESS,
    princess: card.type === CARD_PRINCESS,
  });

  const renderCard = () => {
    return (
      <div className={classNames} ref={popoverTarget} onClick={() => handleClick(card)}>
        <div className='card circle'>{value}</div>
        {!isDiscard && <div className='card title'>{label}</div>}
      </div>
    );
  };

  if (isDiscard) { return renderCard(); }
  if (!hasTargetEffect) { return renderCard(); }
  if (!clickable) { return renderCard(); }

  const alivePlayers = Object.values(allPlayers).filter(player => !player.isKnockedOut);

  const getTargetInstructions = () => {
    switch (card.type) {
      case CARD_GUARD:
        return 'Choose a player and a number other than 1. If that player has that number ' +
          'in their hand, that player is knocked out of the round.';
      case CARD_PRIEST:
        return 'Choose another player. You will be able to look at their hand. Do not reveal ' +
          'the hand to any other players.';
      case CARD_BARON:
        return 'Choose another player. The two of you will compare hands and the player with ' +
          'the lower number is knocked out of the round.';
      case CARD_PRINCE:
        return 'Choose a player, including yourself. That player discards his or her hand ' +
          '(but doesn’t apply its effect, unless it is the Princess) and draws a new one.';
      case CARD_KING:
        return 'Trade the card in your hand with the card held by another player of your choice.';
      default:
        console.error(`Unexpected card ${card.type} for getTargetInstructions`);
    }
  };

  // Choose to target this person with the card's effect
  const targetPlayer = playerId => {
    hideTargetOptions();
    clickCallback({ card, effectData: { targetPlayerId: playerId } })
  };

  const onDiscard = () => {
    clickCallback({ card, effectData: {} });
  };

  const discardCardButton = () => {
    return (
      <>
        <p>
          There are no valid players to target. If you would still like to play this card,
          it will have no effect.
        </p>
        <Button onClick={onDiscard}>Discard</Button>
      </>
    );
  };

  const getTargetButtons = ({ includeSelfTarget }) => {
    let targetCandidates;
    if (includeSelfTarget) {
      targetCandidates = alivePlayers;
    } else {
      targetCandidates = alivePlayers.filter(player => player.id !== currPlayerId);
    }
    // Remove handmaid from targets
    targetCandidates = targetCandidates.filter(
      player => !player.handmaidActive || player.id === currPlayerId,
    );

    if (targetCandidates.length === 0) {
      // Everyone else has a handmaid
      return discardCardButton();
    }

    if (card.type === CARD_GUARD) {
      return getGuardTargetButtons({ targetCandidates });
    }

    return targetCandidates.map(
      player => <Button key={player.id} onClick={() => targetPlayer(player.id)}>{player.name}</Button>
    );
  };

  const onTargetedPlayerChange = value => setGuardTargetId(value);
  const onGuardNumberGuessChange = value => setGuardNumberGuess(value);
  const targetPlayerForGuard = () => {
    hideTargetOptions();
    clickCallback({
      card,
      effectData: {
        guardNumberGuess: parseInt(guardNumberGuess, 10),
        targetPlayerId: guardTargetId,
      },
    });
  };

  const getGuardTargetButtons = ({ targetCandidates }) => {
    const possibleNumbers = [2, 3, 4, 5, 6, 7, 8];
    return (
      <>
        <ToggleButtonGroup name='playerToggle' onChange={onTargetedPlayerChange}>
          {
            targetCandidates.map(
              player =>
                <ToggleButton name='playerToggle' value={player.id}>
                  {player.name}
                </ToggleButton>
            )
          }
        </ToggleButtonGroup>
        <ToggleButtonGroup name="radio" onChange={onGuardNumberGuessChange}>
          {
            possibleNumbers.map(number =>
              <ToggleButton key={number} type="radio" name="radio" value={number}>
                {number}
              </ToggleButton>
            )
          }
        </ToggleButtonGroup>
        {
          guardTargetId && guardNumberGuess &&
            <Button onClick={targetPlayerForGuard}>OK</Button>
        }
      </>
    )
  };

  const includeSelfTarget = (card.type === CARD_PRINCE);

  const hideTargetOptions = () => setShowTargetOptions(false);

  // For cards with target effects
  return (
    <>
      {renderCard()}
      <Overlay
        onHide={hideTargetOptions}
        placement='right'
        rootClose={true}
        show={showTargetOptions}
        target={popoverTarget.current}
      >
        <Popover>
          <Popover.Title as="h3">{label}</Popover.Title>
          <Popover.Content>
            <p>{getTargetInstructions()}</p>
            {getTargetButtons({ includeSelfTarget })}
          </Popover.Content>
        </Popover>
      </Overlay>
    </>
  );
}

export default Card;
