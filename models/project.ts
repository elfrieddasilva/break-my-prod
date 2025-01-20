import { User } from "./user"
import {Score} from "./score"
import { ErrorLog } from "./error-log";
import { ProjectType } from "./project-type";
export type Project = {
    id: string;
    user: User;
    score: Score;
    url: string;
    errorLogs: ErrorLog[];
    type: ProjectType;
}