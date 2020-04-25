import useLocalStorage from './useLocalStorage';
import { CountdownGame } from '../game/game';
import { CountdownAction, createNewGame } from '../game/actions';
import reduce from '../game/reducer';

export default function useCountdownGame(): [CountdownGame, (_: CountdownAction) => void] {
    const [game, setGame] = useLocalStorage<CountdownGame>('countdownGame', reduce(undefined, createNewGame()));
    const dispatch = (action: CountdownAction) => setGame(game => reduce(game, action));
    return [game, dispatch];
}
