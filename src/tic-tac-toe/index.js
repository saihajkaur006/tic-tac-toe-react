import React, { useState } from 'react';
import './style.css';

// Polyfill for structuredClone (for older browsers/Node)
if (typeof window.structuredClone !== 'function') {
  window.structuredClone = (v) => JSON.parse(JSON.stringify(v));
}

const Players = {
  A: 0,
  B: 1,
};

const PlayerIcon = {
  [Players.A]: 'X',
  [Players.B]: 'O',
};

const DefaultTurns = {
  [Players.A]: [],
  [Players.B]: [],
};

const WinningPatterns = ['012', '345', '678', '036', '147', '258', '048', '246'];

function TicTacToe() {
  const [activePlayer, setActivePlayer] = useState(Players.A);
  const buttons = Array.from(new Array(9));

  const [playerTurns, setPlayerTurns] = useState(structuredClone(DefaultTurns));
  const [winner, setWinner] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [message, setMessage] = useState('');

  function handleTurn(index) {
    return () => {
      const newPlayer = activePlayer === Players.A ? Players.B : Players.A;

      const playerATurns = playerTurns[Players.A];
      const playerBTurns = playerTurns[Players.B];

      if (playerATurns.join('').includes(String(index))) return;
      if (playerBTurns.join('').includes(String(index))) return;

      const oldPlayerTurns = structuredClone(playerTurns);
      oldPlayerTurns[activePlayer].push(String(index));

      const isWon = isPlayerWon(oldPlayerTurns[activePlayer]);
      if (isWon) {
        setMessage(`Player ${PlayerIcon[activePlayer]} Won the Game`);
        setWinner(PlayerIcon[activePlayer]);
      } else {
        const totalMoves =
          oldPlayerTurns[Players.A].length + oldPlayerTurns[Players.B].length;
        if (totalMoves === 9) {
          setIsGameOver(true);
          setMessage("Game Over! It's a draw");
        }
      }

      setPlayerTurns(oldPlayerTurns);
      setActivePlayer(newPlayer);
    };
  }

  function isPlayerWon(turns) {
    const turnsInStr = turns.sort().join('');
    return WinningPatterns.some((t) => moreStrict(t, turnsInStr));
  }

  function moreStrict(singlePattern, turnsInStr) {
    return singlePattern.split('').every((p) => turnsInStr.includes(p));
  }

  function handleRestart() {
    setPlayerTurns(structuredClone(DefaultTurns));
    setActivePlayer(Players.A);
    setMessage('');
    setWinner(null);
    setIsGameOver(false);
  }

  const restartGame = handleRestart;

  return (
    <div className="game-root">
      {/* Title */}
      <h1 className="game-title">Tic Tac Toe</h1>
      {/* Player Turn */}
      {!winner && !isGameOver && (
        <h2 className="player-turn">Player Turn: {PlayerIcon[activePlayer]}</h2>
      )}

      {/* Game Board */}
      <div className="tic-tac-toe">
        {buttons.map((_, index) => {
          const otherPlayer = activePlayer === Players.A ? Players.B : Players.A;
          const currentPlayerTurns = playerTurns[Players.A];
          const otherPlayerTurns = playerTurns[Players.B];

          let icon = '';

          if (currentPlayerTurns.join('').includes(String(index))) {
            icon = PlayerIcon[Players.A];
          } else if (otherPlayerTurns.join('').includes(String(index))) {
            icon = PlayerIcon[Players.B];
          }

          return (
            <button onClick={handleTurn(index)} key={index}>
              {icon}
            </button>
          );
        })}

        {!!message && (
          <div className="message">
            <h4>{message}</h4>
            <button onClick={handleRestart}>Restart</button>
          </div>
        )}
      </div>

      {/* Winner / Draw Popup */}
      {(winner || isGameOver) && (
        <div className="popup">
          <div className="popup-content">
            <h2>{winner ? `Winner: ${winner}` : "Game Over! It's a draw"}</h2>
            <button onClick={restartGame}>Restart</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TicTacToe;
