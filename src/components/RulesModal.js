import React from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function RulesModal({ onClose, show }) {
  return (
    <Modal show={show} className='rules-modal'>
      <Modal.Header>
        <Modal.Title>How to play</Modal.Title>
      </Modal.Header>
      <Modal.Body className='rules-modal-body'>
        <p>Get your love to the Princess!</p>
        <h5><u>Gameplay</u></h5>
        <p>
          Each player starts with one random card.
        </p>
        <p>
          On your turn, you draw a card from the deck. You
          then play one card and keep the other. When you play your card, you apply the card's
          effect. You can read about each card effect in the right column of the screen. Once you
          have played the card, it becomes the next player's turn.
        </p>

        <h5><u>Winning a Round</u></h5>
        <p>
          A round ends when either there are no more cards left in the deck to draw. At that point,
          the player with the highest card number in hand wins the round and earns a token.
        </p>
        <p>
          A round can also end if all but one players are knocked out of the round. If that happens,
          the last player standing earns a token.
        </p>
        <h6><u>Tiebreak</u></h6>
        <p>
          If two players have the same number card at the end of the round, they each sum up the
          numbers of the cards in their discard pile. The player with the highest sum wins the
          round.
        </p>
        <h5><u>Winning the Game</u></h5>
        <p>
          The game ends when a player has reached a certain number of tokens, depending on the
          number of players in the game.
        </p>
        <p>
          2 players: 7 tokens<br/>
          3 players: 5 tokens<br/>
          4 players: 4 tokens<br/>
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='primary' onClick={onClose}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RulesModal;
