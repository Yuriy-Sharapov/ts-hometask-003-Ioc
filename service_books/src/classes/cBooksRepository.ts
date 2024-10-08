//const {books} = im('../storage/storage2.ts')

//import { storage.books as books } from '../storage/storage2'
import {ifBook} from './ifBook'
//import {Books} from '../models/books'

export abstract class clBooksRepository{
    // создание книги
    createBook(book: ifBook, files: any):ifBook {        
    
        // создаём книгу и возвращаем её же вместе с присвоенным ID
        const {title, description, authors, favorite} = book
        const favorite_bool = favorite === 'on' ? true: false
    
        let fileCover = ""
        if (files.cover !== undefined)
            fileCover = files.cover[0].path
    
        let fileName = ""
        let fileBook = ""
        if (files.book !== undefined) {
            fileName = files.book[0].filename
            fileBook = files.book[0].path
        }
    
        const newBook = new Books({
            title,
            description,
            authors,
            favorite: favorite_bool,
            fileCover,
            fileName,
            fileBook})
    
        try {
            await newBook.save()
            res.redirect('/books')
        } catch (e) {
            res.status(500).json(e)
        }     
    }
    // получение книги по id
    getBook(id: string):ifBook {
        const idx = books.findIndex( (el:ifBook) => el.id === id)
        if (idx === -1) return null;        
        return books[idx];        
    }
    // получение всех книг
    getBooks():ifBook[] {
        return books;
    }
    // обновление книги
    updateBook(
        id          : string,
        title       : string,
        description : string,
        authors     : string,
        favorite    : boolean,
        fileCover   : string,
        fileName    : string,
        fileBook    : string):ifBook {

        const idx = books.findIndex( (el:ifBook) => el.id === id)
        if (idx === -1) return null;   

        books[idx].title       = title;     
        books[idx].description = description;   
        books[idx].authors     = authors;    
        books[idx].favorite    = favorite;     
        books[idx].fileCover   = fileCover;     
        books[idx].fileName    = fileName;     
        books[idx].fileBook    = fileBook;     
        return books[idx]; 
    }
    //  удаление книги
    deleteBook(id: string):ifBook {
        const idx = books.findIndex( (el:ifBook) => el.id === id)
        if (idx === -1) return null; 
        let book = books[idx];       
        books.splice(idx, 1);
        return book;
    }
}