export class Match {

    private teamA: string;
    private teamB: string;
    private goalsA: number;
    private goalsB: number;

    constructor ( teamA: string,  teamB: string, goalsA: number, goalsB: number) {
        this.teamA = teamA;
        this.teamB = teamB;
        this.goalsA = goalsA;
        this.goalsB = goalsB;
    }
}