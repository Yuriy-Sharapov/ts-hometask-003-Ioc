import express from 'express'
const router = express.Router()
module.exports = router

import multer from 'multer'
import { cBook } from '../classes/cBook2'
import axios from 'axios'
import { ioc } from '../container'
import { clBooksRepository } from '../classes/cBooksRepository'
import Comments from '../models/comments'
import Users from '../models/users'

// 1. получить все книги
router.get('/books', async (req: any, res) => {

    const bookrep = ioc.get(clBooksRepository)

    try {
        const books = await bookrep.getBooks()

        res.render("books/index", {
            title: "Список книг",
            user: req.user,
            books: books,
        });  
    } catch (e) {
        res.status(500).json(e)
    }  
}) 

// 2. создать книгу
router.get('/books/create', (req: any, res) => {
    res.render("books/create", {
        title: "Добавить новую книгу",
        user: req.user,
        book: {}
    })
})

router.post('/books/create',
    // multer.fields([
    //     { name: 'cover', maxCount: 1 },
    //     { name: 'book',  maxCount: 1 }
    // ]),
    async (req: any, res) => {

    // создаём книгу и возвращаем её же вместе с присвоенным ID
    const {title, description, authors, favorite} = req.body
    const favorite_bool = favorite === 'on' ? true: false

    let fileCover = ""
    if (req.files.cover !== undefined)
        fileCover = req.files.cover[0].path

    let fileName = ""
    let fileBook = ""
    if (req.files.book !== undefined) {
        fileName = req.files.book[0].filename
        fileBook = req.files.book[0].path
    }

    const book = new cBook (title, description, authors, favorite_bool, fileCover, fileName, fileBook)
    const bookrep = ioc.get(clBooksRepository)

    try {
        const books = await bookrep.createBook(book, req.files)
        res.redirect('/books')
    } catch (e) {
        res.status(500).json(e)
    }     
})

// 3. получить книгу по ID
router.get('/books/:id', async (req: any, res) => {

    // получаем объект книги, если запись не найдена, вернём Code: 404
    const {id} = req.params
    const bookrep = ioc.get(clBooksRepository)

    try {

        const book = await bookrep.getBook(id)

        const COUNTER_URL = process.env.COUNTER_URL || "http://localhost:3003"
        const access_url = `${COUNTER_URL}/counter/${book.title}`

        let cnt = 0
        try {
            await axios.post(`${access_url}/incr`);
            const axios_res = await axios.get(access_url);
            cnt = axios_res.data.cnt
            console.log(`Количество обращений ${cnt}`)
        } catch (e) { 
            console.log('Ошибка при работе с axios')
            console.log(e)
        }
    
        const comments = await Comments.find({ bookId: id }).select('-__v').sort( { date : -1 } )
        //console.log(`comments - ${comments}`)
        // Создаем новый список комментариев, в котором будут имена пользователей
        let notes: any[]
        let i: number
        for (i = 0; i < comments.length; i++) {
            //console.log(`comment = ${comments[i]}`)
            const comm_user = await Users.findById(comments[i].userId).select('-__v')
            notes.push( {
                username: comm_user.username,
                date    : comments[i].date.toLocaleString('ru'),
                text    : comments[i].text
            })
        }
        //console.log(`notes - ${notes}`)

        res.render("books/view", {
            title: "Просмотреть карточку книги",
            user : req.user,
            book : book,
            cnt  : cnt,
            notes: notes
        })        
    } catch (e) {
        console.log(`Ошибка при обращении к книге`)
        console.log(e)
        res.redirect('/404')
    }  
})

// 4. редактировать книгу по ID
router.get('/books/update/:id', async (req: any, res) => {
    // редактируем объект книги, если запись не найдена, вернём Code: 404
    const {id} = req.params
    const bookrep = ioc.get(clBooksRepository)

    try {
        const book = await bookrep.getBook(id)

        console.log(`===put get===`)
        console.log(book)

        res.render("books/update", {
            title: "Редактирование атрибутов книги",
            user: req.user,
            book: book,
        })        
    } catch (e) {
        res.redirect('/404')
    } 
})

router.post('/books/update/:id',
    // multer.fields([
    //     { name: 'cover', maxCount: 1 },
    //     { name: 'book',  maxCount: 1 }
    //   ]),
    async (req, res) => {
    // редактируем объект книги, если запись не найдена, вернём Code: 404

    const {id} = req.params
    const {title, description, authors, favorite} = req.body
    const favorite_bool = favorite === 'on' ? true: false

    const bookrep = ioc.get(clBooksRepository)

    try {        
        const book = await bookrep.updateBook(id, title, description, authors, favorite_bool, req.files)
        res.redirect(`/books/${id}`);
    } catch (e) {
        console.log(`Ошибка при обращении к книге`)
        console.log(e)
        res.redirect('/404')
        return        
    }  
})

// 5. удалить книгу по ID
router.post('/books/delete/:id', async (req, res) => {
    // удаляем книгу и возвращаем ответ: 'ok'
    const {id} = req.params   
    const bookrep = ioc.get(clBooksRepository)

    try {
        const book = bookrep.deleteBook(id)
        res.redirect(`/books`); 
    } catch (e) {
        res.redirect('/404');
    }      
})   

// // 6. Скачать книгу
// router.get('/books/:id/download', async(req, res) => {

//     const {id} = req.params

//     try {
//         const book = await Books.findById(id).select('-__v')

//         // Формируем путь до книги
//         const filePath = path.resolve(__dirname, "..", book.fileBook)

//         // Проверка, существует ли файл
//         fs.access(filePath, fs.constants.F_OK, (err) => {
//             if (err) {
//                 res.redirect('/404')
//                 return 
//             }

//             // Отправка файла на скачивание
//             res.download(filePath, err => {
//                 if (err)
//                     res.status(500).send('Ошибка при скачивании файла')
//             })
//         })
//     } catch (e) {
//         res.redirect('/404')
//     }
// })