export class Match {

    id : number;
    teamA: string;
    teamB: string;
    goalsA: number;
    goalsB: number;
    played: boolean;

    constructor ( id: number, teamA: string,  teamB: string, goalsA: number, goalsB: number, played: boolean) {
        this.id = id;
        this.teamA = teamA;
        this.teamB = teamB;
        this.goalsA = goalsA;
        this.goalsB = goalsB;
        this.played = played;
    }
}