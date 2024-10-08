const express = require('express')
const router = express.Router()
module.exports = router

const axios = require('axios')

const fs = require('fs');
const path = require('path');

const Books = require('../models/books')
const Users = require('../models/users')
const Comments = require('../models/comments')
const multer= require('../middleware/multer')

// 1. получить все книги
router.get('/books', async (req, res) => {

    try {
        const books = await Books.find().select('-__v')
        //console.log(`get /books`)
        //console.log(books)

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
router.get('/books/create', (req, res) => {
    res.render("books/create", {
        title: "Добавить новую книгу",
        user: req.user,
        book: {}
    })
})

router.post('/books/create',
    multer.fields([
        { name: 'cover', maxCount: 1 },
        { name: 'book',  maxCount: 1 }
    ]),
    async (req, res) => {

    console.log(`===post===`)
    console.log(req.body)

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
})

// 3. получить книгу по ID
router.get('/books/:id', async (req, res) => {

    // получаем объект книги, если запись не найдена, вернём Code: 404
    const {id} = req.params
    //console.log(id)

    try {
        //const books = await Books.find().select('-__v')
        //console.log(books)

        const book = await Books.findById(id).select('-__v')
        console.log(`book - ${book}`)

        const COUNTER_URL = process.env.COUNTER_URL || "http://localhost:3003"
        const access_url = `${COUNTER_URL}/counter/${book.title}`

        //console.log(`REDIS access_url - ${access_url}`)

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
        notes = []
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
            user: req.user,
            book: book,
            cnt: cnt,
            notes: notes
        })        
    } catch (e) {
        console.log(`Ошибка при обращении к книге`)
        console.log(e)
        res.redirect('/404')
    }  
})

// 4. редактировать книгу по ID
router.get('/books/update/:id', async (req, res) => {
    // редактируем объект книги, если запись не найдена, вернём Code: 404
    const {id} = req.params

    try {
        const book = await Books.findById(id).select('-__v')

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
    multer.fields([
        { name: 'cover', maxCount: 1 },
        { name: 'book',  maxCount: 1 }
      ]),
    async (req, res) => {
    // редактируем объект книги, если запись не найдена, вернём Code: 404
    console.log(`===req.body===`)
    console.log(req.body)

    const {id} = req.params
    const {title, description, authors, favorite} = req.body
    const favorite_bool = favorite === 'on' ? true: false

    try {
        const dbBook = await Books.findById(id).select('-__v')

        console.log(`===req.files===`)
        console.log(req.files)
        
        let fileCover = dbBook.fileCover;
        if (req.files.cover !== undefined) {
            // Пришел новый файл обложки, надо удалить старый файл
            console.log(`Нужно удалить файл обложки - ${fileCover}`)
            try{
                fs.unlinkSync(fileCover)
            } catch (e) {
                console.log(`Файл ${fileCover} не удален`)
                console.log(e)
            }
            fileCover = req.files.cover[0].path
        }

        let fileName = dbBook.fileName
        let fileBook = dbBook.fileBook
        if (req.files.book !== undefined) {
            // Пришел новый файл книги, надо удалить старый файл
            console.log(`Нужно удалить файл книги - ${fileBook}`)
            try{
                fs.unlinkSync(fileBook)
            } catch (e) {
                console.log(`Файл ${fileBook} не удален`)
                console.log(e)
            }        
            fileName = req.files.book[0].filename
            fileBook = req.files.book[0].path
        }

        console.log(`===put post===`)
        console.log({ title, description, authors, favorite_bool, fileCover, fileName, fileBook})
        try {
            await Books.findByIdAndUpdate(id, {
                title,
                description,
                authors,
                favorite: favorite_bool,  
                fileCover,
                fileName,
                fileBook})
            res.redirect(`/books/${id}`);
        } catch (e) {
            res.redirect('/404')
        } 
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

        await Books.deleteOne({_id: id})
        res.redirect(`/books`); 
    } catch (e) {
        res.redirect('/404');
    }      
})   

// 6. Скачать книгу
router.get('/books/:id/download', async(req, res) => {

    const {id} = req.params

    try {
        const book = await Books.findById(id).select('-__v')

        // Формируем путь до книги
        const filePath = path.resolve(__dirname, "..", book.fileBook)

        // Проверка, существует ли файл
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                res.redirect('/404')
                return 
            }

            // Отправка файла на скачивание
            res.download(filePath, err => {
                if (err)
                    res.status(500).send('Ошибка при скачивании файла')
            })
        })
    } catch (e) {
        res.redirect('/404')
    }
})