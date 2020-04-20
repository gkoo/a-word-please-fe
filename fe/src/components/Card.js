import React, { useRef, useState } from 'react';

import Button from 'react-bootstrap/Button';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';

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

function Card({ card, isDiscard, clickCallback, allPlayers, currPlayerId }) {
  const [guardNumberGuess, setGuardNumberGuess] = useState('');
  const [showTargetOptions, setShowTargetOptions] = useState(false);
  const classNames = ['card'];
  const popoverTarget = useRef(null);
  const hasTargetEffect = [
    CARD_GUARD,
    CARD_PRIEST,
    CARD_BARON,
    CARD_PRINCE,
    CARD_KING,
  ].includes(card);

  let label;
  let value;

  switch (card) {
    case CARD_GUARD:
      label = 'Guard';
      value = '1';
      break;
    case CARD_PRIEST:
      label = 'Priest';
      value = '2';
      break;
    case CARD_BARON:
      label = 'Baron';
      value = '3';
      break;
    case CARD_HANDMAID:
      label = 'Handmaid';
      value = '4';
      break;
    case CARD_PRINCE:
      label = 'Prince';
      value = '5';
      break;
    case CARD_KING:
      label = 'King';
      value = '6';
      break;
    case CARD_COUNTESS:
      label = 'Countess';
      value = '7';
      break;
    case CARD_PRINCESS:
      label = 'Princess';
      value = '8';
      break;
    default:
      console.error(`Unrecognized card ${card}`);
  }

  const handleClick = card => {
    if (isDiscard) { return; }

    if (hasTargetEffect) {
      setShowTargetOptions(!showTargetOptions);
      return;
    }

    clickCallback({ card, effectData: {} });
  };

  const renderCard = () => {
    return (
      <div className={classNames.join(' ')} ref={popoverTarget} onClick={() => handleClick(card)}>
        <h3>{value}{ !isDiscard && <span>: {label}</span> }</h3>
      </div>
    );
  };

  if (isDiscard) {
    classNames.push('discard');
    return renderCard();
  }

  const alivePlayers = Object.values(allPlayers).filter(player => !player.isKnockedOut);

  const getTargetInstructions = () => {
    switch (card) {
      case CARD_GUARD:
        return 'Choose a player and a number other than 1. If that player has that number ' +
          'in their hand, that player is knocked out of the round';
      case CARD_PRIEST:
        return 'Choose another player. You will be able to look at their hand. Do not reveal ' +
          'the hand to any other players.';
      case CARD_BARON:
        return 'Choose another player. The two of you will compare hands and the player with ' +
          'the lower number is knocked out of the round.';
      case CARD_PRINCE:
        return 'Choose a player (including yourself). That player discards his or her hand ' +
          '(but doesn’t apply its effect, unless it is the Princess) and draws a new one.';
      case CARD_KING:
        return 'Trade the card in your hand with the card held by another player of your choice.';
      default:
        console.error(`Unexpected card ${card} for getTargetInstructions`);
    }
  };

  // Choose to target this person with the card's effect
  const targetPlayer = playerId => {
    hideTargetOptions();
    clickCallback({ card, effectData: { targetPlayerId: playerId } })
  };

  const getPlayerButtons = ({ includeSelfTarget }) => {
    let targetCandidates;
    if (includeSelfTarget) {
      targetCandidates = alivePlayers;
    } else {
      targetCandidates = alivePlayers.filter(player => player.id !== currPlayerId);
    }
    return targetCandidates.map(
      player => <Button onClick={() => targetPlayer(player.id)}>{player.name}</Button>
    );
  };

  const maybeRenderGuardNumberGuess = () => {
    if (card !== CARD_GUARD) { return; }

    return (
      <div><input value={guardNumberGuess} onChange={setGuardNumberGuess}/></div>
    );
  };

  const includeSelfTarget = (card === CARD_PRINCE);

  const hideTargetOptions = () => setShowTargetOptions(false);

  if (!hasTargetEffect) {
    // For cards without target effects
    return renderCard();
  }

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
            <p>{getTargetInstructions(card)}</p>
            {getPlayerButtons({ includeSelfTarget })}
            {maybeRenderGuardNumberGuess()}
          </Popover.Content>
        </Popover>
      </Overlay>
    </>
  );
}

export default Card;
