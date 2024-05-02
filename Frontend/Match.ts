export class Match {

    private teamA: string;
    private teamB: string;
    private goalsA: number;
    private goalsB: number;
    private played: boolean;

    constructor ( teamA: string,  teamB: string, goalsA: number, goalsB: number, played: boolean) {
        this.teamA = teamA;
        this.teamB = teamB;
        this.goalsA = goalsA;
        this.goalsB = goalsB;
        this.played = played;
    }
}