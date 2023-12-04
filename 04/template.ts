import { Linq } from "https://deno.land/x/linqts@1.3.0/mod.ts";
import { lodash as _ } from "https://deno.land/x/deno_ts_lodash@0.0.1/mod.ts";

const L = <T>(array: T[]): Linq<T> => new Linq<T>(array);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Config ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const PROD = true;
const inputFile = PROD ? "input.txt" : "input-test.txt";
console.log("Using " + inputFile);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Setup ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const input = await Deno.readTextFile(inputFile);
const inputLines = input.trim().split(/\r?\n/g).map((l) => l.trim());

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Here be Dragons ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
console.time("time");

// CODE

class Game {
    id: number;
    winningNumbers: Set<string>;
    playingNumbers: Set<string>;
    overlap: number = 0;

    constructor(id: number, winningNumbers: Set<string>, playingNumbers: Set<string>) {
        this.id = id;
        this.winningNumbers = winningNumbers;
        this.playingNumbers = playingNumbers;
    }

    get points(): number {
        return this.overlap > 0 ? Math.pow(2, this.overlap - 1) : 0;
    }
}

const games: Game[] = [];
for (let line of inputLines) {
    const [idText, numberText] = line.split(":");
    const id = parseInt(idText.substring('Card '.length));

    const [winningNumbersText, playingNumbersText] = numberText.split(" | ");
    const winningNumbers = winningNumbersText.trim().split(/ +/);
    const playingNumbers = playingNumbersText.trim().split(/ +/);

    const game = new Game(id, new Set(winningNumbers), new Set(playingNumbers));
    game.overlap = _.intersection([...game.winningNumbers], [...game.playingNumbers]).length;

    games.push(game);
}

const winningGamesA = games.reduce((acc, game) => acc + game.points, 0);
console.log("A: " + winningGamesA);

const ownedCards = new Map<number, number>();
const queue: Game[] = [...games];
for (let q = 0; q < queue.length; q++) {
    const lastGame = queue[q];

    if (!lastGame) {
        continue;
    }

    ownedCards.set(lastGame.id, (ownedCards.get(lastGame.id) || 0) + 1);

    for (let i = 1; i <= lastGame.overlap; i++) {
        let nextGame = games[lastGame.id - 1 + i];
        queue.push(nextGame);
    }
}

const cardCount = [...ownedCards.values()].reduce((acc, count) => acc + count, 0);

console.log("B: " + cardCount);

console.timeEnd("time");