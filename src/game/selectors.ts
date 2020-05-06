import { CountdownGame, Round, LettersRound, NumbersRound } from './game';

export type GameState = 'WAITING' | 'BETWEEN' | 'LETTERS' | 'NUMBERS' | 'CONUNDRUM' | 'ENDED';

export interface RoundDescription {
    type: 'LETTERS' | 'NUMBERS' | 'CONUNDRUM';
    picker: string | undefined;
}

const ROUNDS_9: {type: 'LETTERS' | 'NUMBERS' | 'CONUNDRUM', picker: number | undefined}[] = [
    { type: 'LETTERS', picker: 1 },
    { type: 'LETTERS', picker: 2 },
    { type: 'LETTERS', picker: 1 },
    { type: 'NUMBERS', picker: 2 },
    { type: 'LETTERS', picker: 2 },
    { type: 'LETTERS', picker: 1 },
    { type: 'LETTERS', picker: 2 },
    { type: 'NUMBERS', picker: 1 },
    { type: 'CONUNDRUM', picker: undefined },
];

const ROUNDS_15: {type: 'LETTERS' | 'NUMBERS' | 'CONUNDRUM', picker: number | undefined}[] = [
    { type: 'LETTERS', picker: 1 },
    { type: 'LETTERS', picker: 2 },
    { type: 'NUMBERS', picker: 1 },
    { type: 'LETTERS', picker: 2 },
    { type: 'LETTERS', picker: 1 },
    { type: 'NUMBERS', picker: 2 },
    { type: 'LETTERS', picker: 1 },
    { type: 'LETTERS', picker: 2 },
    { type: 'NUMBERS', picker: 1 },
    { type: 'LETTERS', picker: 2 },
    { type: 'LETTERS', picker: 1 },
    { type: 'LETTERS', picker: 2 },
    { type: 'LETTERS', picker: 1 },
    { type: 'NUMBERS', picker: 2 },
    { type: 'CONUNDRUM', picker: undefined },
];

export const getGameState = (game: CountdownGame): GameState => {
    if (game.variant === undefined) return 'WAITING';
    else if (game.rounds.length === 0) return 'BETWEEN';
    else if (getCurrentRound(game).finished) return gameOver(game) ? 'ENDED' : 'BETWEEN';
    else return game.rounds[game.rounds.length - 1].type;
};

export const getCurrentRound = (game: CountdownGame): Round => {
    return game.rounds[game.rounds.length - 1];
}

export const getCurrentRoundDescription = (game: CountdownGame): RoundDescription => {
    const roundIndex = game.rounds.length - 1;
    return getRoundDescription(game, roundIndex);
};

export const getNextRoundDescription = (game: CountdownGame): RoundDescription => {
    const roundIndex = game.rounds.length;
    return getRoundDescription(game, roundIndex);
};

export const getP1TotalScore = (game: CountdownGame): number => {
    return game.rounds.filter(p1Scores).map(r => r.p1Score).reduce((x, y) => x + y, 0);
}

export const getP2TotalScore = (game: CountdownGame): number => {
    return game.rounds.filter(p2Scores).map(r => r.p2Score).reduce((x, y) => x + y, 0);
}

export const getP1CumulativeScore = (game: CountdownGame, index: number) => {
    return game.rounds.slice(0, index + 1).filter(p1Scores).map(r => r.p1Score).reduce((x, y) => x + y, 0);
}

export const getP2CumulativeScore = (game: CountdownGame, index: number) => {
    return game.rounds.slice(0, index + 1).filter(p2Scores).map(r => r.p2Score).reduce((x, y) => x + y, 0);
}

export const getMaxCumulativeScore = (game: CountdownGame, index: number) => {
    const maxForRound = (round: Round) => round.type === 'LETTERS' ? maxForLettersRound(round) : round.type === 'NUMBERS' ? maxForNumbersRound(round) : 10;
    return game.rounds.slice(0, index + 1).map(r => maxForRound(r)).reduce((x, y) => x + y, 0);
}

const maxForLettersRound = (round: LettersRound) => round.maxes[0].length === 9 ? 18 : round.maxes[0].length;

const maxForNumbersRound = (round: NumbersRound) => {
    const distanceFromTarget = Math.abs(round.target - round.max.value);
    return distanceFromTarget === 0 ? 10 : distanceFromTarget <= 5 ? 7 : distanceFromTarget <= 10 ? 5 : 0;
}

const p1Scores = (round: Round): boolean => {
    if (round.type === 'LETTERS' || round.type === 'CONUNDRUM') return round.p1Score >= round.p2Score;
    else if (round.type === 'NUMBERS') return (round.p1Score >= round.p2Score) && (round.p1Score > round.p2Score || Math.abs(round.target - (round.p1Declaration as number)) <= (Math.abs(round.target - (round.p2Declaration as number))));
    return true;
}

const p2Scores = (round: Round): boolean => {
    if (round.type === 'LETTERS' || round.type === 'CONUNDRUM') return round.p2Score >= round.p1Score;
    else if (round.type === 'NUMBERS') return (round.p2Score >= round.p1Score) && (round.p2Score > round.p1Score || Math.abs(round.target - (round.p2Declaration as number)) <= (Math.abs(round.target - (round.p1Declaration as number))));
    return true;
}

const numberOfRounds = (game: CountdownGame): number => {
    if (game.variant === '9R') return 9;
    else return 15;
}

const gameOver = (game: CountdownGame): boolean => {
    if (game.rounds.length >= numberOfRounds(game) && getCurrentRound(game).finished) {
        return getP1TotalScore(game) !== getP2TotalScore(game);
    }
    return false;
};

const getRoundDescription = (game: CountdownGame, index: number): RoundDescription => {
    const template = (game.variant === '9R' ? ROUNDS_9[index] : ROUNDS_15[index]) || { type: 'CONUNDRUM', picker: undefined };
    return {
        type: template.type,
        picker: template.picker === 1 ? game.p1Name : template.picker === 2 ? game.p2Name : undefined
    };
};
