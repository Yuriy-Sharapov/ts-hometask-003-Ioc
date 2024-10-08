//const cBook = require('../classes/cBook2')

import {cBook} from '../classes/cBook2'

// Инициализация базы книг
export const storage = {

    books: [
        new cBook(
            "The Twelve-Factor App (Русский перевод)", 
            "Интересная книга",
            "",
            true,
            "public//books//TFA.html",
            "TFA.html",
            "public//books//TFA.html" ),
        new cBook(
            "Совершенный код", 
            "Очень хорошая книга",
            "Макконнелл",
            true,
            "public//books//Макконнелл «Совершенный код».pdf",
            "Макконнелл «Совершенный код».pdf",
            "public//books//Макконнелл «Совершенный код».pdf" ),
        new cBook(
            "Простоквашино", 
            "Отличная книга для детей",
            "Э. Успенский",
            true,
            "err/err/Простоквашино.pdf",
            "Простоквашино.pdf",
            "err/err/Простоквашино.pdf" )            
    ],
}

//module.exports = storage