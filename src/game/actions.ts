import { Variant } from './game';

export const createNewGame = (): CreateNewGameAction => ({
    type: 'CREATE_NEW_GAME'
});

export const setPlayerNames = (p1Name: string, p2Name: string): SetPlayerNamesAction => ({
    type: 'SET_PLAYER_NAMES',
    p1Name, p2Name
});

export const startGame = (variant: Variant): StartGameAction => ({
    type: 'START_GAME',
    variant
});

export const startLettersRound = (): StartLettersRoundAction => ({
    type: 'START_LETTERS_ROUND'
});

export const drawConsonant = (): DrawConsonantAction => ({
    type: 'DRAW_CONSONANT'
});

export const drawVowel = (): DrawVowelAction => ({
    type: 'DRAW_VOWEL'
});

export const setLettersRoundResult = (p1Declaration: string, p2Declaration: string, p1Score: number, p2Score: number, maxes: string[]): SetLettersRoundResultAction => ({
    type: 'SET_LETTERS_ROUND_RESULT',
    p1Declaration, p2Declaration, p1Score, p2Score, maxes
});

export const startNumbersRound = (): StartNumbersRoundAction => ({
    type: 'START_NUMBERS_ROUND'
});

export const drawLarge = (): DrawLargeAction => ({
    type: 'DRAW_LARGE'
});

export const drawSmall = (): DrawSmallAction => ({
    type: 'DRAW_SMALL'
});

export const setTarget = (): SetTargetAction => ({
    type: 'SET_TARGET',
    value: 100 + Math.floor(900 * Math.random())
});

export const setNumbersRoundResult = (p1Declaration: number, p2Declaration: number, p1Score: number, p2Score: number, max: {value: number, method: string}): SetNumbersRoundResultAction => ({
    type: 'SET_NUMBERS_ROUND_RESULT',
    p1Declaration, p2Declaration, p1Score, p2Score, max
});

export const startConundrumRound = (): StartConundrumRoundAction => ({
    type: 'START_CONUNDRUM_ROUND'
});

export const revealConundrum = (scramble: string, answer: string): RevealConundrumAction => ({
    type: 'REVEAL_CONUNDRUM',
    scramble, answer
});

export const setP1ConundrumDeclaration = (buzzTime: number, declaration: string): SetP1ConundrumDeclarationAction => ({
    type: 'SET_P1_CONUNDRUM_DECLARATION',
    buzzTime, declaration
});

export const setP2ConundrumDeclaration = (buzzTime: number, declaration: string): SetP2ConundrumDeclarationAction => ({
    type: 'SET_P2_CONUNDRUM_DECLARATION',
    buzzTime, declaration
});

export const solveConundrum = (): SolveConundrumAction => ({
    type: 'SOLVE_CONUNDRUM'
});

export const endRound = (): EndRoundAction => ({
    type: 'END_ROUND'
});

export interface CreateNewGameAction {
    type: 'CREATE_NEW_GAME';
}

export interface SetPlayerNamesAction {
    type: 'SET_PLAYER_NAMES';
    p1Name: string;
    p2Name: string;
}

export interface StartGameAction {
    type: 'START_GAME';
    variant: Variant;
}

export interface StartLettersRoundAction {
    type: 'START_LETTERS_ROUND';
}

export interface DrawConsonantAction {
    type: 'DRAW_CONSONANT';
}

export interface DrawVowelAction {
    type: 'DRAW_VOWEL';
}

export interface SetLettersRoundResultAction {
    type: 'SET_LETTERS_ROUND_RESULT';
    p1Declaration: string;
    p2Declaration: string;
    p1Score: number;
    p2Score: number;
    maxes: string[];
}

export interface StartNumbersRoundAction {
    type: 'START_NUMBERS_ROUND';
}

export interface DrawLargeAction {
    type: 'DRAW_LARGE';
}

export interface DrawSmallAction {
    type: 'DRAW_SMALL';
}

export interface SetTargetAction {
    type: 'SET_TARGET';
    value: number;
}

export interface SetNumbersRoundResultAction {
    type: 'SET_NUMBERS_ROUND_RESULT';
    p1Declaration: number;
    p2Declaration: number;
    p1Score: number;
    p2Score: number;
    max: {value: number, method: string};
}

export interface StartConundrumRoundAction {
    type: 'START_CONUNDRUM_ROUND';
}

export interface RevealConundrumAction {
    type: 'REVEAL_CONUNDRUM';
    scramble: string;
    answer: string;
}

export interface SetP1ConundrumDeclarationAction {
    type: 'SET_P1_CONUNDRUM_DECLARATION';
    buzzTime: number;
    declaration: string;
}

export interface SetP2ConundrumDeclarationAction {
    type: 'SET_P2_CONUNDRUM_DECLARATION';
    buzzTime: number;
    declaration: string;
}

export interface SolveConundrumAction {
    type: 'SOLVE_CONUNDRUM';
}

export interface EndRoundAction {
    type: 'END_ROUND';
}

export type CountdownAction = CreateNewGameAction | SetPlayerNamesAction | StartGameAction | StartLettersRoundAction | DrawConsonantAction | DrawVowelAction | SetLettersRoundResultAction | StartNumbersRoundAction | DrawLargeAction | DrawSmallAction | SetTargetAction | SetNumbersRoundResultAction | StartConundrumRoundAction | RevealConundrumAction | SetP1ConundrumDeclarationAction | SetP2ConundrumDeclarationAction | SolveConundrumAction | EndRoundAction;
