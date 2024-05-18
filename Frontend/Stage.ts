import { Match } from "Match";

export class Stage {

    name : string = "";
    championship : string = "";
    matches : Match[];

    constructor ( name : string, championship : string, matches: Match[]) {
        this.name = name;
        this.championship = championship;
        this.matches = matches;
    }
}