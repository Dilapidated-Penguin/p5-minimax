# Tic-Tac-Toe with Minimax and Orientation-Agnostic Memoization

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

![p5.js](https://img.shields.io/badge/p5.js-ED225D?style=for-the-badge&logo=p5.js&logoColor=FFFFFF)

This project implements an unbeatable computer agent for Tic-Tac-Toe using the Minimax algorithm, visualized with the p5.js library. To enhance performance, it incorporates orientation-agnostic memoization, ensuring efficient state evaluation regardless of board rotations or reflections.

### Features

- **Minimax algorithm**: employs the minimax algorithms to find the optimal moves
- **p5.js visualization:** Utilizes p5.js for intuitive and interactive game rendering.
- **Orientation-Agnostic Memoization**: Caches board states in a manner that recognizes identical states across rotations and reflections, reducing redundant computations.

# Installation
1. Clone the repository
```
git clone https://github.com/Dilapidated-Penguin/p5-minimax.git
```
2. Navigate to the repository
```
cd p5-minimax
```
## Running the project
you have several options,

### 1. Using Visual Studio Code Live Server Extension (Recommended)
The easiest and most optimal way to run this project is by using the Live Server extension in Visual Studio Code:
**1. Install Live Server Extension:**
- Go to the Extensions view by clicking on the square icon in the sidebar or pressing Ctrl+Shift+X.
- Search for "Live Server" and install it.

### 2. Using p5-server Node Module
Alternatively, you can use the [p5-server](https://osteele.github.io/p5-server/#quick-start--installation) Node.js module to run the project:

```
npm install -g p5-server
```

```
p5 serve --open
```
This command will start a local server and automatically open your project in the default web browser.


## Implementation details
### Minimax algorithm
The Minimax algorithm recursively explores each potential move, assigning scores based on the eventual game outcome: win, lose, or draw which is then used to select the move with the highest score to ensure the best possible outcome.
### Orientation-agnostic memoization
To optimize performance, the algorithm caches evaluated board states. Since different orientations (rotations and reflections) of the same board are equivalent, the memoization process normalizes each board state to its canonical form before caching by:
1. rotating the matrix representing the board state 90, 180 and 270 degrees
2. generating a string corresponding to each rotation and finds the lexicographically smallest string
3. This string as well as a boolean representing who turn it is are used to retrieve the cached results of the minimax algorithm.

This approach prevents redundant evaluations of equivalent states, significantly enhancing efficiency.
## Roadmap

- [ ] Generalise the implementation to multiple versions of [m,n,k-games](https://en.wikipedia.org/wiki/M,n,k-game)
    - [ ] 15,15,5-game ([Gomoku](https://en.wikipedia.org/wiki/Gomoku))
    - [ ] (5,5,4)
    - [ ] (9,6,6)
    - [ ] (7,7,6)

- [ ] Implement other versions of optimisation to compare
    - [ ] Alpha-beta pruning


## Acknowledgements
- The loading animation used [is from this loading animation editor](https://editor.p5js.org/black/sketches/HJbGfpCvM)

