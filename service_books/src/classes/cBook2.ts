// подключаем генератор гуидов UUID
//const { v4: uuid } = require('uuid')
import { v4 as uuid } from 'uuid'

export class cBook implements ifBook{

    title       : string;
    description : string; 
    authors     : string;
    favorite    : boolean;
    fileCover   : string;
    fileName    : string;
    fileBook    : string;
    id          : string;

    constructor(
            title       : string,
            description : string, 
            authors     : string,
            favorite    : boolean,
            fileCover   : string,
            fileName    : string,
            fileBook    : string,
            id          : string = uuid()){
        
        this.title       = title
        this.description = description
        this.authors     = authors
        this.favorite    = favorite
        this.fileCover   = fileCover
        this.fileName    = fileName
        this.fileBook    = fileBook
        this.id          = id

    }
}

//module.exports = cBook