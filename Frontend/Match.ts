export class Match {

    matchId : number;
    teamA: string;
    teamB: string;
    goalsA: number;
    goalsB: number;
    date: Date;
    scoreObtained: number;

    constructor ( id: number, teamA: string,  teamB: string, goalsA: number, goalsB: number, date: Date, scoreObtained: number) {
        this.matchId = id;
        this.teamA = teamA;
        this.teamB = teamB;
        this.goalsA = goalsA;
        this.goalsB = goalsB;
        this.date = date;
        this.scoreObtained = scoreObtained;
    }
}