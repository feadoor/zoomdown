// eslint-disable-next-line import/no-webpack-loader-syntax
import numbersWorker from 'workerize-loader!../workers/numbers.worker';

export const findNumbersMethods = (numbers: number[], target: number, onMethodFound: (value: number, method: string) => void): (() => void) => {
    const worker = numbersWorker();
    worker.addEventListener('message', (message: any) => {
        if (message.data.type === 'METHOD') {
            onMethodFound(message.data.value, message.data.method);
        }
    });
    worker.findNumbersMethods(numbers, target);
    return () => worker.terminate();
}
