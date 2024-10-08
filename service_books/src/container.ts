// IoC контейнер
import { Container } from 'inversify'
import { clBooksRepository } from './classes/cBooksRepository'

// Задание 1. создайте IoC-контейнер в файле container.js
const ioc = new Container()
// Задание 2. Добавить сервис BooksRepository в IoC-контейнер
ioc.bind(clBooksRepository).toSelf()

// Задание 3. Использовать IoC-контейнер в обработчиках запросов express.js, чтобы получить BooksRepository
// Реализовано в файле ./routes/books.ts

export {ioc}