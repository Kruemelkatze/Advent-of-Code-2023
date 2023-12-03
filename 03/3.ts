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
class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    isAdjacentTo(point: Point): boolean {
        return Math.abs(this.x - point.x) <= 1 && Math.abs(this.y - point.y) <= 1;
    }
}

class Symbol {
    id: string;
    point: Point;
    adjacentNumbers: Set<Num>;

    constructor(id: string, x: number, y: number) {
        this.id = id;
        this.point = new Point(x, y);
        this.adjacentNumbers = new Set<Num>();
    }

    addAdjacentNumber(num: Num) {
        this.adjacentNumbers.add(num);
    }
}

class Num {
    value: number;
    point: Point;
    adjacentSymbols: Set<Symbol>;

    constructor(value: number, x: number, y: number) {
        this.value = value;
        this.point = new Point(x, y);
        this.adjacentSymbols = new Set<Symbol>();
    }

    get length(): number {
        return Math.floor(Math.log10(this.value)) + 1;
    }

    getPositions(): Point[] {
        const positions = [];
        let l = this.length;
        for (let i = 0; i < l; i++) {
            positions.push(new Point(this.point.x + i, this.point.y));
        }
        return positions;
    }

    isAdjacentToSymbol(symbols: Symbol[]): boolean {
        const positions = this.getPositions();
        return positions.some((position) => symbols.some((symbol) => symbol.point.isAdjacentTo(position)));
    }

    setSymbolAdjacency(symbols: Symbol[]) {
        this.adjacentSymbols = new Set<Symbol>(symbols.filter((symbol) => this.isAdjacentToSymbol([symbol])));
        this.adjacentSymbols.forEach((symbol) => symbol.addAdjacentNumber(this));
    }
}

class Schematic {
    symbols: Symbol[];
    nums: Num[];

    constructor() {
        this.symbols = [];
        this.nums = [];
    }

    isAdjacentToSymbol(point: Point): boolean {
        return this.symbols.some((symbol) => symbol.point.isAdjacentTo(point));
    }

    isNumberAdjacentToSymbol(num: Num): boolean {
        const positions = num.getPositions();
        return positions.some((position) => this.isAdjacentToSymbol(position));
    }

    setNumberAndSymbolAdjacencies() {
        this.nums.forEach((num) => num.setSymbolAdjacency(this.symbols));
    }

    // 617*....45
    loadLine(line: string, lineNumber: number) {
        let currentNumValue = 0;
        let currentNumPosition = -1;

        let addedNumbers = 0;
        let addedSymbols = 0;

        for (let i = line.length - 1; i >= 0; i--) {
            const char = line[i];

            // Number
            if (char >= '0' && char <= '9') {
                if (currentNumPosition === -1) {
                    currentNumPosition = i;
                }

                currentNumValue += Math.pow(10, currentNumPosition - i) * parseInt(char);
                continue;
            }

            // Finish Number
            if (currentNumPosition !== -1) {
                const newNumber = new Num(currentNumValue, i + 1, lineNumber);
                this.nums.push(newNumber);
                currentNumPosition = -1;
                currentNumValue = 0;
                addedNumbers++;
            }

            // Empty
            if (char === '.') {
                continue;
            }

            // Symbol
            const newSymbol = new Symbol(char, i, lineNumber);
            this.symbols.push(newSymbol);
            addedSymbols++;
        }

        // Finish possibly open number
        if (currentNumPosition !== -1) {
            const newNumber = new Num(currentNumValue, 0, lineNumber);
            this.nums.push(newNumber);
            currentNumPosition = -1;
            currentNumValue = 0;
            addedNumbers++;
        }

        //console.log(`Line ${lineNumber}: Added ${addedSymbols} symbols and ${addedNumbers} numbers`);
    }
}

const schematic = new Schematic();
for (let i = 0; i < inputLines.length; i++) {
    schematic.loadLine(inputLines[i], i);
}

schematic.setNumberAndSymbolAdjacencies();

//const numbersWithoutAdjacentSymbols = schematic.nums.filter((num) => num.adjacentSymbols.size === 0);
//console.dir(numbersWithoutAdjacentSymbols, { depth: 2 });

const numbersWithAdjacentSymbols = schematic.nums.filter((num) => num.adjacentSymbols.size > 0);
//console.dir(numbersWithAdjacentSymbols, { depth: 2 });
const sumWithAdjacentSymbols = numbersWithAdjacentSymbols.reduce((sum, num) => sum + num.value, 0);
console.log("A: " + sumWithAdjacentSymbols);

const gears = schematic.symbols.filter((symbol) => symbol.id === '*' && symbol.adjacentNumbers.size === 2);
const gearSum = gears.reduce((sum, gear) => {
    let values = [...gear.adjacentNumbers].map((num) => num.value);
    return sum + values[0] * values[1];
}, 0);

console.log("B: " + gearSum);

console.timeEnd("time");




