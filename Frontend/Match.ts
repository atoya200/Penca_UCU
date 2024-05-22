export class Match {

    id : number;
    teamA: string;
    teamB: string;
    goalsA: number;
    goalsB: number;
    date: Date;

    constructor ( id: number, teamA: string,  teamB: string, goalsA: number, goalsB: number, date: Date) {
        this.id = id;
        this.teamA = teamA;
        this.teamB = teamB;
        this.goalsA = goalsA;
        this.goalsB = goalsB;
        this.date = date;
    }
}