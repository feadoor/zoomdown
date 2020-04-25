// eslint-disable-next-line import/no-webpack-loader-syntax
import lettersWorker from 'workerize-loader!../workers/letters.worker';
import _words from '../data/words.json';
const words = _words.words;

export const checkValidity = (word: string): boolean => {
    let [lo, hi] = [0, words.length - 1];
    while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (words[mid] === word) return true;
        else if (words[mid] < word) lo = mid + 1;
        else if (words[mid] > word) hi = mid - 1;
    }
    return false;
}

export const findAllWordsFromSelection = (selection: string[], onWordFound: (_: string) => void): (() => void) => {
    const worker = lettersWorker();
    worker.addEventListener('message', (message: any) => {
        if (message.data.type === 'WORD') {
            onWordFound(message.data.value);
        }
    });
    worker.findWordsFromSelection(selection);
    return () => worker.terminate();
}
