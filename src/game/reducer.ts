import { CountdownGame, LettersRound, NumbersRound, ConundrumRound } from './game'
import { CountdownAction, StartGameAction, SetPlayerNamesAction, SetLettersRoundResultAction, SetTargetAction, SetNumbersRoundResultAction, RevealConundrumAction, SetP1ConundrumDeclarationAction, SetP2ConundrumDeclarationAction } from './actions'

export default function reduce(game: CountdownGame = createNewGame(), action: CountdownAction): CountdownGame {
    switch (action.type) {
        case 'CREATE_NEW_GAME': return createNewGame();
        case 'SET_PLAYER_NAMES': return setPlayerNames(game, action);
        case 'START_GAME': return startGame(game, action);
        case 'START_LETTERS_ROUND': return startLettersRound(game);
        case 'DRAW_CONSONANT': return drawConsonant(game);
        case 'DRAW_VOWEL': return drawVowel(game);
        case 'SET_LETTERS_ROUND_RESULT': return setLettersRoundResult(game, action);
        case 'START_NUMBERS_ROUND': return startNumbersRound(game);
        case 'DRAW_LARGE': return drawLarge(game);
        case 'DRAW_SMALL': return drawSmall(game);
        case 'SET_TARGET': return setTarget(game, action);
        case 'SET_NUMBERS_ROUND_RESULT': return setNumbersRoundResult(game, action);
        case 'START_CONUNDRUM_ROUND': return startConundrumRound(game);
        case 'REVEAL_CONUNDRUM': return revealConundrum(game, action);
        case 'SET_P1_CONUNDRUM_DECLARATION': return setP1ConundrumDeclaration(game, action);
        case 'SET_P2_CONUNDRUM_DECLARATION': return setP2ConundrumDeclaration(game, action);
        case 'SOLVE_CONUNDRUM': return solveConundrum(game);
        case 'END_ROUND': return endRound(game);
        default: return game;
    }
}

const createNewGame = (): CountdownGame => ({
    p1Name: 'Player 1',
    p2Name: 'Player 2',
    variant: undefined,
    rounds: [],
    consonantPile: shuffleConsonants(),
    vowelPile: shuffleVowels(),
    largePile: shuffle(newLargePile()),
    smallPile: shuffle(newSmallPile())
});

const setPlayerNames = (game: CountdownGame, {p1Name, p2Name}: SetPlayerNamesAction): CountdownGame => ({
    ...game,
    p1Name, p2Name
});

const startGame = (game: CountdownGame, {variant}: StartGameAction): CountdownGame => ({
    ...game,
    variant
});

const startLettersRound = (game: CountdownGame): CountdownGame => ({
    ...game,
    rounds: [
        ...game.rounds,
        newLettersRound()
    ]
});

const updateLettersRound = (game: CountdownGame, updater: (_: LettersRound) => LettersRound): CountdownGame => ({
    ...game,
    rounds: [
        ...game.rounds.slice(0, -1),
        updater(game.rounds[game.rounds.length - 1] as LettersRound)
    ]
});

const drawConsonant = (game: CountdownGame): CountdownGame => {
    const consonant = game.consonantPile[0];
    return {
        ...updateLettersRound(game, round => ({
            ...round,
            selection: [...round.selection, consonant]
        })),
        consonantPile: game.consonantPile.slice(1),
    }
};

const drawVowel = (game: CountdownGame): CountdownGame => {
    const vowel = game.vowelPile[0];
    return {
        ...updateLettersRound(game, round => ({
            ...round,
            selection: [...round.selection, vowel]
        })),
        vowelPile: game.vowelPile.slice(1),
    };
};

const setLettersRoundResult = (game: CountdownGame, {p1Declaration, p2Declaration, p1Score, p2Score, maxes}: SetLettersRoundResultAction): CountdownGame => updateLettersRound(game, round => ({
    ...round,
    p1Declaration, p2Declaration, p1Score, p2Score, maxes
}));

const startNumbersRound = (game: CountdownGame): CountdownGame => ({
    ...game,
    rounds: [
        ...game.rounds,
        newNumbersRound()
    ],
    largePile: shuffle(newLargePile()),
    smallPile: shuffle(newSmallPile())
});

const updateNumbersRound = (game: CountdownGame, updater: (_: NumbersRound) => NumbersRound): CountdownGame => ({
    ...game,
    rounds: [
        ...game.rounds.slice(0, -1),
        updater(game.rounds[game.rounds.length - 1] as NumbersRound)
    ]
});

const drawLarge = (game: CountdownGame): CountdownGame => {
    const large = game.largePile[0];
    return {
        ...updateNumbersRound(game, round => ({
            ...round,
            selection: [large, ...round.selection]
        })),
        largePile: game.largePile.slice(1)
    };
};

const drawSmall = (game: CountdownGame): CountdownGame => {
    const small = game.smallPile[0];
    return {
        ...updateNumbersRound(game, round => ({
            ...round,
            selection: [small, ...round.selection]
        })),
        smallPile: game.smallPile.slice(1)
    };
};

const setTarget = (game: CountdownGame, {value}: SetTargetAction): CountdownGame => updateNumbersRound(game, round => ({
    ...round,
    target: value
}));

const setNumbersRoundResult = (game: CountdownGame, {p1Declaration, p2Declaration, p1Score, p2Score, max}: SetNumbersRoundResultAction): CountdownGame => updateNumbersRound(game, round => ({
    ...round,
    p1Declaration, p2Declaration, p1Score, p2Score, max
}));

const startConundrumRound = (game: CountdownGame): CountdownGame => ({
    ...game,
    rounds: [
        ...game.rounds,
        newConundrumRound()
    ]
});

const updateConundrumRound = (game: CountdownGame, updater: (_: ConundrumRound) => ConundrumRound): CountdownGame => ({
    ...game,
    rounds: [
        ...game.rounds.slice(0, -1),
        updater(game.rounds[game.rounds.length - 1] as ConundrumRound)
    ]
});

const revealConundrum = (game: CountdownGame, {scramble, answer}: RevealConundrumAction): CountdownGame => updateConundrumRound(game, round => ({
    ...round,
    scramble, answer
}));

const setP1ConundrumDeclaration = (game: CountdownGame, {buzzTime, declaration}: SetP1ConundrumDeclarationAction): CountdownGame => updateConundrumRound(game, round => ({
    ...round,
    p1BuzzTime: buzzTime,
    p1Declaration: declaration,
    p1Score: declaration === round.answer ? 10 : 0,
    solved: declaration === round.answer
}));

const setP2ConundrumDeclaration = (game: CountdownGame, {buzzTime, declaration}: SetP2ConundrumDeclarationAction): CountdownGame => updateConundrumRound(game, round => ({
    ...round,
    p2BuzzTime: buzzTime,
    p2Declaration: declaration,
    p2Score: declaration === round.answer ? 10 : 0,
    solved: declaration === round.answer
}));

const solveConundrum = (game: CountdownGame): CountdownGame => updateConundrumRound(game, round => ({
    ...round,
    solved: true
}));

const endRound = (game: CountdownGame): CountdownGame => ({
    ...game,
    rounds: [
        ...game.rounds.slice(0, -1),
        {
            ...game.rounds[game.rounds.length - 1],
            finished: true
        }
    ]
});

const newLettersRound = (): LettersRound => ({
    type: 'LETTERS',
    selection: [],
    maxes: [],
    finished: false,
    p1Declaration: undefined,
    p2Declaration: undefined,
    p1Score: 0,
    p2Score: 0
});

const newNumbersRound = (): NumbersRound => ({
    type: 'NUMBERS',
    selection: [],
    target: 0,
    max: {value: 0, method: ''},
    finished: false,
    p1Declaration: undefined,
    p2Declaration: undefined,
    p1Score: 0,
    p2Score: 0
});

const newConundrumRound = (): ConundrumRound => ({
    type: 'CONUNDRUM',
    scramble: undefined,
    answer: undefined,
    solved: false,
    finished: false,
    p1BuzzTime: undefined,
    p2BuzzTime: undefined,
    p1Declaration: undefined,
    p2Declaration: undefined,
    p1Score: 0,
    p2Score: 0
});

const newConsonantPile = () => {
    const frequencies: {[s: string]: number} = {'R': 9, 'S': 9, 'T': 9, 'N': 8, 'D': 6, 'L': 5, 'G': 4, 'M': 4, 'P': 4, 'C': 3, 'B': 2, 'F': 2, 'H': 2, 'V': 2, 'W': 2, 'J': 1, 'K': 1, 'Q': 1, 'X': 1, 'Y': 1, 'Z': 1};
    const pile = [];
    for (const letter of Object.keys(frequencies)) {
        for (let i = 0; i < frequencies[letter]; ++i) {
            pile.push(letter);
        }
    }
    return pile;
}

const newVowelPile = () => {
    const frequencies: {[s: string]: number} = {'E': 20, 'A': 15, 'I': 13, 'O': 13, 'U': 7};
    const pile = [];
    for (const letter of Object.keys(frequencies)) {
        for (let i = 0; i < frequencies[letter]; ++i) {
            pile.push(letter);
        }
    }
    return pile;
}

const newLargePile = () => [100, 75, 50, 25];

const newSmallPile = () => [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10];

const isBadConsonant = (letter: string) => ['C', 'B', 'F', 'H', 'V', 'W', 'J', 'K', 'Q', 'X', 'Y', 'Z'].includes(letter);

const shuffleConsonants = () => {
    const pile = shuffle(shuffle(newConsonantPile()));
    for (let i = 0; i < pile.length - 2; ++i) {
        if (isBadConsonant(pile[i]) && isBadConsonant(pile[i + 1]) && isBadConsonant(pile[i + 2])) {
            const indicesToSwap = [...Array(pile.length - i - 3)].map((_, idx) => idx + i + 3).filter(idx => !isBadConsonant(pile[idx]));
            if (indicesToSwap.length > 0) {
                const randomIndex = Math.floor(Math.random() * indicesToSwap.length);
                [pile[i + 1], pile[indicesToSwap[randomIndex]]] = [pile[indicesToSwap[randomIndex]], pile[i + 1]];
            }
        }
    }
    return pile;
};

const shuffleVowels = () => {
    const pile = shuffle(shuffle(newVowelPile()));
    for (let i = 0; i < pile.length - 3; ++i) {
        if (pile[i] === pile[i + 1] && pile[i + 1] === pile[i + 2]) {
            const vowelToIgnore = pile[i];
            const indicesToSwap = [...Array(pile.length - i - 3)].map((_, idx) => idx + i + 3).filter(idx => pile[idx] !== vowelToIgnore);
            if (indicesToSwap.length > 0) {
                const randomIndex = Math.floor(Math.random() * indicesToSwap.length);
                [pile[i + 1], pile[indicesToSwap[randomIndex]]] = [pile[indicesToSwap[randomIndex]], pile[i + 1]];
            }
        }
    }
    return pile;
};

const shuffle = <T>(_items: T[]) => {
    const items = [..._items];
    for (let i = items.length - 1; i > 0; --i) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
}
