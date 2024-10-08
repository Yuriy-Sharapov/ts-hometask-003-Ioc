const user_list = [
    {
      id          : 1,
      username    : 'user',
      password    : '123456',
      displayName : 'demo user',
      email       : 'user@mail.ru',
    },
    {
      id          : 2,
      username    : 'jill',
      password    : 'birthday',
      displayName : 'Jill',
      email       : 'jill@example.com',
    },
  ]
  
  const Users = require('../models/users')
  const bcrypt = require('bcrypt')
   
  async function preloadUsers(){

    try {

        const users_count = await Users.countDocuments()
        console.log(`users_count = ${users_count}`)
        if(users_count !== 0) return;

        console.log(`Нужно инициализировать данные БД Users`)
        for (i = 0; i < user_list.length; i++){
            const user = user_list[i]
            //console.log(user)
             
            const {username, password, displayName, email} = user
            
            // получаем соль
            const salt = await bcrypt.genSalt(10)
            // солим и шифруем пароль
            const hash_password = await bcrypt.hash(password, salt)
      
            // console.log(`password - ${password}`)
            // console.log(`salt - ${salt}`)
            // console.log(`hash - ${hash_password}`)    
      
            console.log({username, hash_password, displayName, email})
      
            const newUser = Users({
              username   : username,
              password   : hash_password,
              displayName: displayName,
              email      : email})
                
            await newUser.save()
        }

    } catch (e) {
        console.log(`Ошибка при обращении к коллекции Users`)
        console.log(e)
    }
  }

  module.exports = preloadUsers