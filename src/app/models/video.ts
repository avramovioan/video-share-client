import { User } from "./user";

export class Video{
    id?: number;
    title: string;
    url: string; 
    description:string;  
    ownerId?: number;
    owner?: User
}
