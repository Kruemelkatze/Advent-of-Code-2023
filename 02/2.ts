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
const availableCubes = new Map<string, number>([
    ['red', 12],
    ['green', 13],
    ['blue', 14],
]);

const possibleGames = [];
const gamePowers = [];
for (const gameInfo of inputLines) {
    const [gameIdText, cubeText] = gameInfo.split(':');
    const gameId = parseInt(gameIdText.substring(5));

    if (isGameValid(cubeText)) {
        possibleGames.push(gameId);
    }

    const [red, green, blue] = getMinimumCubeCount(cubeText);
    gamePowers.push(red * green * blue);
}

const gameSum = possibleGames.reduce((a, b) => a + b, 0);
const gamePowerSum = gamePowers.reduce((a, b) => a + b, 0);

// 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
function isGameValid(cubeText: string): boolean {
    const subGames = cubeText.split(';').map((c) => c.trim()); // of format '3 blue, 4 red'
    for (const subGame of subGames) {
        const cubeDefs = subGame.split(',').map((c) => c.trim()); // of format 'X COLOR'

        for (const cubeDef of cubeDefs) {
            const [count, color] = cubeDef.split(' ');
            const availableCount = availableCubes.get(color) ?? 0;
            if (parseInt(count) > availableCount) {
                return false;
            }
        }
    }

    return true;
}

// 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
function getMinimumCubeCount(cubeText: string): number[] {
    const subGames = cubeText.split(';').map((c) => c.trim()); // of format '3 blue, 4 red'
    const cubeCounts = { red: 0, green: 0, blue: 0 };

    for (const subGame of subGames) {
        const cubeDefs = subGame.split(',').map((c) => c.trim()); // of format 'X COLOR'

        for (const cubeDef of cubeDefs) {
            const [count, color] = cubeDef.split(' ');
            const typedColor = color as 'red' | 'green' | 'blue';
            cubeCounts[typedColor] = Math.max(cubeCounts[typedColor], parseInt(count));
        }
    }

    return [cubeCounts.red, cubeCounts.green, cubeCounts.blue];

}

console.log("A: " + gameSum);
console.log("B: " + gamePowerSum);


console.timeEnd("time");