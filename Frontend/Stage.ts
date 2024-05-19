import { Match } from "Match";

export class Stage {

    id: number;
    name : string = "";
    championship : string = "";
    matches : Match[];

    constructor ( id: number, name : string, championship : string, matches: Match[]) {
        this.id = id;
        this.name = name;
        this.championship = championship;
        this.matches = matches;
    }
}