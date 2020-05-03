type Operator = 'CONST' | '+' | '-' | '*' | '/';

interface Blob {
    value: number;
    operator: Operator;
    used: number;
    left: Blob | undefined;
    right: Blob | undefined;
    next: Blob | undefined;
    hlink: Blob | undefined;
}

const LPRI = {'CONST': 0, '+': 1, '-': 1, '*': 2, '/': 2};
const RPRI = {'CONST': 0, '+': 1, '-': 2, '*': 2, '/': 3};

const write = (blob: Blob, pri: number): string => {

    if (blob.operator === 'CONST') {
        return blob.value.toString();
    }

    const pieces = [];
    const [lpri, rpri] = [LPRI[blob.operator], RPRI[blob.operator]];
    if (lpri < pri) pieces.push('(');
    pieces.push(write(blob.left as Blob, lpri));
    pieces.push(` ${blob.operator} `);
    pieces.push(write(blob.right as Blob, rpri));
    if (lpri < pri) pieces.push(')');

    return pieces.join('');
}

const prettyPrint = (blob: Blob): string => write(blob, 1);

const countOnes = (size: number, expSize: number): {[n: number]: number} => {
    const ones: {[n: number]: number} = {};
    for (let n = 0; n < expSize; ++n) ones[n] = 0;
    for (let i = 0; i < size; ++i) {
        const t = (1 << i);
        for (let r = 0; r < t; ++r) {
            ones[t + r] = ones[r] + 1;
        }
    }
    return ones;
}

export function findNumbersMethods(numbers: number[], target: number) {

    const N = numbers.length;
    const EXPN = (1 << numbers.length);
    const HSIZE = 20000;

    let bestDist = target;
    let bestValue = 0;
    let bestSolution = '';

    const ones: {[n: number]: number} = countOnes(N, EXPN);
    const pool: (Blob | undefined)[] = [...Array(EXPN)].map(_ => undefined);
    const htable: (Blob | undefined)[] = [...Array(HSIZE)].map(_ => undefined);

    const addBlob = (operator: Operator, p: Blob | undefined, q: Blob | undefined, value: number, used: number) => {
        for (let r = htable[value % HSIZE]; r !== undefined; r = r.hlink) {
            if (r.value === value && !(r.used & ~used)) return;
        }

        const t: Blob = { value, operator, used, left: p, right: q, next: pool[used], hlink: htable[value % HSIZE] };
        pool[used] = t; htable[value % HSIZE] = t;

        const dist = target < value ? value - target : target - value;
        if (dist <= bestDist) {
            const prettySolution = prettyPrint(t);
            if (dist < bestDist || prettySolution.length < bestSolution.length) {
                bestDist = dist; bestValue = value; bestSolution = prettySolution;
                // eslint-disable-next-line
                (self as any).postMessage({type: 'METHOD', value: bestValue, method: prettySolution});
            }
        }
    }

    const combine = (r: number, s: number) => {
        const used = r | s;
        for (let p = pool[r]; p !== undefined; p = p.next) {
            for (let q = pool[s]; q !== undefined; q = q.next) {
                if (p.value >= q.value) {
                    addBlob('+', p, q, p.value + q.value, used);
                    addBlob('-', p, q, p.value - q.value, used);
                    addBlob('*', p, q, p.value * q.value, used);
                    if (q.value > 0 && p.value % q.value == 0) {
                        addBlob('/', p, q, p.value / q.value, used);
                    }
                }
            }
        }
    }

    for (let i = 0; i < N; ++i) {
        addBlob('CONST', undefined, undefined, numbers[i], (1 << i));
    }

    for (let i = 2; i <= N; ++i) {
        for (let r = 0; r < EXPN; ++r) {
            for (let s = 0; s < EXPN; ++s) {
                if (ones[r] + ones[s] == i && ((r & s) == 0)) {
                    combine(r, s);
                }
            }
        }
    }
}
