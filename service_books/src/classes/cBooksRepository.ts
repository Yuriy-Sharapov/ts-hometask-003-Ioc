//const {books} = im('../storage/storage2.ts')

//import { storage.books as books } from '../storage/storage2'
import { injectable } from 'inversify'
import { ifBook } from './ifBook'
import { cBook } from './cBook2'
import fs from 'fs'
import axios from 'axios'
import Books from '../models/books'
import Comments from '../models/comments'

@injectable()
export abstract class clBooksRepository{
    // создание книги
    async createBook(book: ifBook, files: any):Promise<ifBook> {        

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
            title      : book.title,
            description: book.description,
            authors    : book.authors,
            favorite   : book.favorite,
            fileCover,
            fileName,
            fileBook})
    
        try {
            await newBook.save()
            return book
        } catch (e) {
            return null
        }        
    }
    // получение книги по id
    async getBook(id: string):Promise<ifBook> {

        try {
            const dbBook = await Books.findById(id).select('-__v')
            const {title, description, authors, favorite, fileCover, fileName, fileBook} = dbBook
            const book = new cBook (title, description, authors, favorite, fileCover, fileName, fileBook)
            return book
        } catch (e) { 
            return null
        }
    }
    // получение всех книг
    async getBooks():Promise<ifBook[]> {
        try {
            const dbBooks = await Books.find().select('-__v')
            
            let books: cBook[]
            let i: number
            for (i = 1; i < dbBooks.length; i++ ){
                const {title, description, authors, favorite, fileCover, fileName, fileBook} = dbBooks[i]
                const book = new cBook (title, description, authors, favorite, fileCover, fileName, fileBook)   
                books.push(book)          
            }
            return books;

        } catch (e) {

            return null
        }  
    }
    // обновление книги
    async updateBook(
        id          : string,
        title       : string,
        description : string,
        authors     : string,
        favorite    : boolean,
        files       : any):Promise<ifBook> {
       
        try {
            const dbBook = await Books.findById(id).select('-__v')
            
            let fileCover = dbBook.fileCover;
            if (files.cover !== undefined) {
                // Пришел новый файл обложки, надо удалить старый файл
                console.log(`Нужно удалить файл обложки - ${fileCover}`)
                try{
                    fs.unlinkSync(fileCover)
                } catch (e) {
                    console.log(`Файл ${fileCover} не удален`)
                    console.log(e)
                }
                fileCover = files.cover[0].path
            }
    
            let fileName = dbBook.fileName
            let fileBook = dbBook.fileBook
            if (files.book !== undefined) {
                // Пришел новый файл книги, надо удалить старый файл
                console.log(`Нужно удалить файл книги - ${fileBook}`)
                try{
                    fs.unlinkSync(fileBook)
                } catch (e) {
                    console.log(`Файл ${fileBook} не удален`)
                    console.log(e)
                }        
                fileName = files.book[0].filename
                fileBook = files.book[0].path
            }
    
            const book = new cBook (title, description, authors, favorite, fileCover, fileName, fileBook)
            try {
                await Books.findByIdAndUpdate(id, {
                    title,
                    description,
                    authors,
                    favorite,  
                    fileCover,
                    fileName,
                    fileBook})

                return book
            } catch (e) {
                return null
            } 
        } catch (e) {
            console.log(`Ошибка при обращении к книге`)
            console.log(e)
            return null
        }  
    }
    //  удаление книги
    async deleteBook(id: string):Promise<ifBook> {

        try {
            const dbBook = await Books.findById(id).select('-__v')
            try{
                fs.unlinkSync(dbBook.fileCover)
            } catch (e) {
                console.log(`Файл обложки ${dbBook.fileCover} не удален`)
                console.log(e)
            }
            try{
                fs.unlinkSync(dbBook.fileBook)
            } catch (e) {
                console.log(`Файл книги ${dbBook.fileBook} не удален`)
                console.log(e)
            }

            const {title, description, authors, favorite, fileCover, fileName, fileBook} = dbBook
            const book = new cBook (title, description, authors, favorite, fileCover, fileName, fileBook)

            await Books.deleteOne({_id: id})

            return book
        } catch (e) {
            return null
        }   
    }
}