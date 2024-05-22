import { Match } from "Match";

export class Stage {

    id: number;
    name : string = "";
    matches : Match[];

    constructor ( id: number, name : string, matches: Match[]) {
        this.id = id;
        this.name = name;
        this.matches = matches;
    }
}