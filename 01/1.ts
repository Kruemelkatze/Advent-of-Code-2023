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
const numberRegex = /(\d|one|two|three|four|five|six|seven|eight|nine)/;
const reverseRegex = /(\d|eno|owt|eerht|ruof|evif|xis|neves|thgie|enin)/;

const numbersMap = new Map<string, number>([
    ['one', 1],
    ['two', 2],
    ['three', 3],
    ['four', 4],
    ['five', 5],
    ['six', 6],
    ['seven', 7],
    ['eight', 8],
    ['nine', 9],
]);

const numbersA = inputLines.map(getLineNumberA);
const sumA = L(numbersA).sum();
const numbersB = inputLines.map(getLineNumberB);
const sumB = L(numbersB).sum();


function getLineNumberA(line: string): number {
    let first = '', last = '';

    for (const c of line) {
        if (c >= '0' && c <= '9') {
            first = first ? first : c;
            last = c;
        }
    }

    return parseInt(first + last);
}

function getLineNumberB(line: string): number {
    // reverse string
    const firstStr = line.match(numberRegex)![1];
    const lastStr = reverseString(reverseString(line).match(reverseRegex)![1]);

    let first = numbersMap.has(firstStr) ? numbersMap.get(firstStr) : parseInt(firstStr);
    let last = numbersMap.has(lastStr) ? numbersMap.get(lastStr) : parseInt(lastStr);

    let number = first! * 10 + last!;

    console.log(number + "\t" + line);
    return number;
}

function reverseString(str: string): string {
    return str.split("").reverse().join("");
}



console.timeEnd("time");

console.log("Sum: " + sumA);
console.log("Sum: " + sumB);