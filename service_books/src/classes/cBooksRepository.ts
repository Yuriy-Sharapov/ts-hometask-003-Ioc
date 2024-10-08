const {books} = require('../storage/storage2.ts')

abstract class BooksRepository{
    // создание книги
    createBook(book: ifBook):ifBook {        
        const idx = books.findIndex( (el:ifBook) => el.id === book.id)
        if (idx !== -1) return books[idx];
        books.push(book);
        return book;
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