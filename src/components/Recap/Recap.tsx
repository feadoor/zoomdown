import React from 'react';
import './Recap.css';

import { CountdownGame, Round, LettersRound, NumbersRound, ConundrumRound } from '../../game/game';
import { getP1CumulativeScore, getP2CumulativeScore, getMaxCumulativeScore } from '../../game/selectors';

export interface RecapProps {
    game: CountdownGame;
}

const Recap: React.FC<RecapProps> = ({ game }) => {

    const renderHeader = () => <tr>
        <td>Round</td>
        <td>Selection</td>
        <td>{game.p1Name}</td>
        <td>Score</td>
        <td>{game.p2Name}</td>
        <td>Best</td>
        <td>Max Score</td>
    </tr>;

    const renderLettersRow = (round: LettersRound, index: number) => <tr key={index}>
        <td>{index + 1}</td>
        <td>{round.selection.join(' ')}</td>
        <td className={round.p1Score > 0 ? '' : 'invalid'}>{round.p1Declaration}</td>
        <td>{getP1CumulativeScore(game, index)} - {getP2CumulativeScore(game, index)}</td>
        <td className={round.p2Score > 0 ? '' : 'invalid'}>{round.p2Declaration}</td>
        <td title={round.maxes.join(', ')} className={round.maxes.length > 1 ? 'more-maxes' : ''}>{round.maxes[0]}</td>
        <td>{getMaxCumulativeScore(game, index)}</td>
    </tr>;

    const renderNumbersRow = (round: NumbersRound, index: number) => <tr key={index}>
        <td className="recap__round-number">{index + 1}</td>
        <td className="recap__numbers-selection">{round.selection.join(' ')}</td>
        <td className={round.p1Score > 0 ? '' : 'invalid'}>{round.p1Declaration}</td>
        <td className="recap__score">{getP1CumulativeScore(game, index)} - {getP2CumulativeScore(game, index)}</td>
        <td className={round.p2Score > 0 ? '' : 'invalid'}>{round.p2Declaration}</td>
        <td title={`${round.max.value} = ${round.max.method}`}>{round.max.value}</td>
        <td>{getMaxCumulativeScore(game, index)}</td>
    </tr>;

    const renderConundrumRow = (round: ConundrumRound, index: number) => <tr key={index}>
        <td className="recap__round-number">{index + 1}</td>
        <td className="recap__conundrum-selection">{[...round.scramble].join(' ')}</td>
        <td>
            <div className={round.p1Score > 0 || !round.p1Declaration ? '' : 'invalid'}>{round.p1Declaration}</div>
            {!!round.p1BuzzTime && <div>{normalizeBuzzTime(round.p1BuzzTime)} seconds</div>}
        </td>
        <td className="recap__score">{getP1CumulativeScore(game, index)} - {getP2CumulativeScore(game, index)}</td>
        <td>
            <div className={round.p2Score > 0 || !round.p2Declaration ? '' : 'invalid'}>{round.p2Declaration}</div>
            {!!round.p2BuzzTime && <div>{normalizeBuzzTime(round.p2BuzzTime)} seconds</div>}
        </td>
        <td>{round.p1Score === 0 && round.p2Score === 0 ? round.answer : ''}</td>
        <td>{getMaxCumulativeScore(game, index)}</td>
    </tr>;

    const renderRoundRow = (round: Round, index: number) => {
        switch (round.type) {
            case 'LETTERS': return renderLettersRow(round, index);
            case 'NUMBERS': return renderNumbersRow(round, index);
            case 'CONUNDRUM': return renderConundrumRow(round, index);
        }
    };

    const normalizeBuzzTime = (buzzTime: number) => {
        let roundedBuzzTime = (Math.round(buzzTime * 4) / 4);
        let adjustedBuzzTime = Math.min(30, Math.max(0.25, roundedBuzzTime - 0.5));
        return adjustedBuzzTime.toFixed(2);
    }

    return (
        <div className="recap">
            <table>
                <thead>
                    {renderHeader()}
                </thead>
                <tbody>
                    {game.rounds.map((rd, idx) => renderRoundRow(rd, idx))}
                </tbody>
            </table>
        </div>
    );
};

export default Recap;
