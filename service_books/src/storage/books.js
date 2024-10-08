const cBook = require('../classes/cBook')

// Инициализация базы книг
const book_list = [
    new cBook(
        title       = "The Twelve-Factor App (Русский перевод)", 
        description = "Интересная книга",
        authors     = "",
        favorite    = true,
        fileCover   = "public//books//TFA.html",
        fileName    = "TFA.html",
        fileBook    = "public//books//TFA.html" ),
    new cBook(
        title       = "Совершенный код", 
        description = "Очень хорошая книга",
        authors     = "Макконнелл",
        favorite    = true,
        fileCover   = "public//books//Макконнелл «Совершенный код».pdf",
        fileName    = "Макконнелл «Совершенный код».pdf",
        fileBook    = "public//books//Макконнелл «Совершенный код».pdf" ),
    new cBook(
        title       = "Простоквашино", 
        description = "Отличная книга для детей",
        authors     = "Э. Успенский",
        favorite    = true,
        fileCover   = "err/err/Простоквашино.pdf",
        fileName    = "Простоквашино.pdf",
        fileBook    = "err/err/Простоквашино.pdf" )            
]

const Books = require('../models/books')

async function preloadBooks(){

    try {

        const books_count = await Books.countDocuments()
        console.log(`books_count = ${books_count}`)
        if(books_count !== 0) return;

        console.log(`Нужно инициализировать данные БД Books`)
        for (i = 0; i < book_list.length; i++){
            const book = book_list[i]
            console.log(book)

            const {title, description, authors, favorite, fileCover, fileName, fileBook} = book
            const newBook = new Books({title, description, authors, favorite, fileCover, fileName, fileBook})
            await newBook.save()                
        }

    } catch (e) {
        console.log(`Ошибка при обращении к коллекции Books`)
        console.log(e)
    }
}

module.exports = preloadBooks