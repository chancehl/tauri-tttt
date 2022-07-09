import { State } from "./state";

enum Player {
  Taco = "taco",
  Burrito = "burrito",
}

type GameBoard = Array<Array<Player | null>>;

type GameState = {
  player: Player;
  board: GameBoard;
};

const DEFAULT_STATE: GameState = {
  player: Player.Taco,
  board: [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ],
};

class Main {
  state: State<GameState>;

  board: HTMLElement;

  scoreboard: HTMLElement;

  cells: HTMLCollection;

  button: HTMLElement;

  constructor() {
    this.state = new State<GameState>(DEFAULT_STATE, (newState) => {
      this.onStateUpdate(newState);
      this.drawBoard(newState);
    });

    this.cells = document.getElementsByClassName("cell")!;
    this.board = document.getElementById("#game-board")!;
    this.scoreboard = document.getElementById("#scoreboard")!;
    this.button = document.getElementById("#new-game")!;
    this.taco = document.getElementById("#player--taco")!;
    this.burrito = document.getElementById("#player--burrito")!;

    this.initializeBoard();
  }

  private onCellClick(cell: HTMLDivElement) {
    const dataX = cell.getAttribute("data-x");
    const dataY = cell.getAttribute("data-y");

    if (dataX == null || dataY == null) {
      throw new Error("Could not locate cell indices");
    }

    const x = Number.parseInt(dataX);
    const y = Number.parseInt(dataY);

    // update game state
    const { player, board } = this.state.getState();

    board[x][y] = player;

    this.state.setState({
      player: player === Player.Taco ? Player.Burrito : Player.Taco,
      board,
    });
  }

  private initializeBoard() {
    // set up button
    // this.button.addEventListener("click", this.reset);

    // set up cells
    for (let i = 0; i < 9; i++) {
      const cell = this.cells.item(i) as HTMLDivElement;

      if (cell) {
        cell.addEventListener("click", () => this.onCellClick(cell));
        cell.innerHTML = "";
      }
    }
  }

  private onStateUpdate(state: GameState) {
    console.log("state updated", state);

    // look for winner
    const hasWinner = this.lookForWinner(state.board);

    if (hasWinner) {
      alert("winner!");
    }
  }

  private drawBoard(state: GameState) {
    // active player
    const playerImages = document.querySelectorAll(".player--photo");

    playerImages.forEach((image) => {
      if (image.className.includes("inactive")) {
        image.className = image.className.replace(" inactive", "");
      } else {
        image.className = image.className.concat(" inactive");
      }
    });

    // cells
    for (let i = 0; i < state.board.length; i++) {
      for (let j = 0; j < state.board.length; j++) {
        const cell = document.querySelector(`[data-x="${i}"][data-y="${j}"]`);
        const player = state.board[i][j];

        if (cell && player) {
          cell.innerHTML = player === Player.Taco ? "T" : "B";
        }
      }
    }
  }

  private reset() {
    // update state
    this.state.setState(DEFAULT_STATE);

    // clear cells
    const cells = document.getElementsByClassName("cell");

    for (let i = 0; i < 9; i++) {
      const cell = cells.item(i) as HTMLDivElement;

      if (cell) {
        cell.innerHTML = "";
      }
    }
  }

  private lookForWinner(board: GameBoard) {
    return (
      this.hasVerticalWinner(board) ||
      this.hasHorizontalWinner(board) ||
      this.hasDiagonalWinner(board) ||
      false
    );
  }

  private hasVerticalWinner(board: GameBoard) {
    return false;
  }

  private hasHorizontalWinner(board: GameBoard) {
    for (const row of board) {
      if (row.every((value) => value && value === row[0])) {
        return true;
      }
    }

    return false;
  }

  private hasDiagonalWinner(board: GameBoard) {
    return false;
  }
}

export default new Main();
