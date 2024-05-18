export class Match {

    teamA: string;
    teamB: string;
    goalsA: number;
    goalsB: number;
    played: boolean;

    constructor ( teamA: string,  teamB: string, goalsA: number, goalsB: number, played: boolean) {
        this.teamA = teamA;
        this.teamB = teamB;
        this.goalsA = goalsA;
        this.goalsB = goalsB;
        this.played = played;
    }
}