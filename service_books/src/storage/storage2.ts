const clBook = require('../classes/cBook2')

// Инициализация базы книг
const storage = {

    books: [
        new clBook(
            "The Twelve-Factor App (Русский перевод)", 
            "Интересная книга",
            "",
            true,
            "public//books//TFA.html",
            "TFA.html",
            "public//books//TFA.html" ),
        new clBook(
            "Совершенный код", 
            "Очень хорошая книга",
            "Макконнелл",
            true,
            "public//books//Макконнелл «Совершенный код».pdf",
            "Макконнелл «Совершенный код».pdf",
            "public//books//Макконнелл «Совершенный код».pdf" ),
        new clBook(
            "Простоквашино", 
            "Отличная книга для детей",
            "Э. Успенский",
            true,
            "err/err/Простоквашино.pdf",
            "Простоквашино.pdf",
            "err/err/Простоквашино.pdf" )            
    ],
}

module.exports = storage