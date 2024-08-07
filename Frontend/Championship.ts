import { Stage } from "Stage";
import { Team } from "src/app/team";

export class Championship {

    id: number;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    stages: Stage[];
    teams: Team[];

    constructor(id: number, name: string, description: string, startDate: Date, endDate: Date, stages: Stage[]){
        this.id = id;
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.stages = stages;
    }
}