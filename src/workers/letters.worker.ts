import _trie from '../data/trie.json';
type Trie = {[s: string]: (Trie | string)};
const trie = _trie as Trie;

export function findWordsFromSelection(selection: string[]) {
    const counts: {[s: string]: number} = {};
    for (const letter of selection) counts[letter] = (counts[letter] || 0) + 1;

    const generator = (currNode: Trie = trie): void => {
        for (const char of Object.keys(currNode)) {
            // eslint-disable-next-line
            if (char === '_end_') (self as any).postMessage({type: 'WORD', value: currNode[char]});
            else if (counts[char] > 0) {
                counts[char] = counts[char] - 1;
                generator(currNode[char] as Trie);
                counts[char] = counts[char] + 1;
            }
        }
    }

    generator();
}
