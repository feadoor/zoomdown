export interface LettersRound {
    type: 'LETTERS';
    selection: string[];
    maxes: string[];
    finished: boolean;
    p1Declaration: string | undefined;
    p2Declaration: string | undefined;
    p1Score: number;
    p2Score: number;
}

export interface NumbersRound {
    type: 'NUMBERS';
    selection: number[];
    target: number;
    finished: boolean;
    max: {value: number, method: string};
    p1Declaration: number | undefined;
    p2Declaration: number | undefined;
    p1Score: number;
    p2Score: number;
}

export interface ConundrumRound {
    type: 'CONUNDRUM';
    scramble: string | undefined;
    answer: string | undefined;
    solved: boolean;
    finished: boolean;
    p1BuzzTime: number | undefined;
    p2BuzzTime: number | undefined;
    p1Declaration: string | undefined;
    p2Declaration: string | undefined;
    p1Score: number;
    p2Score: number;
}

export type Round = LettersRound | NumbersRound | ConundrumRound;

export type Variant = '9R' | '15R';

export interface CountdownGame {
    p1Name: string;
    p2Name: string;
    variant: Variant | undefined;
    rounds: Round[];
    consonantPile: string[];
    vowelPile: string[];
    largePile: number[];
    smallPile: number[];
}
