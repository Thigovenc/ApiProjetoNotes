const AppError = require("../utils/AppError")
const sqliteConnection = require("../database/sqlite");
class UsersController {

    /*
        1- index - GET para listar registros.
        2- Show - GET para exibir um registro.
        3- create - POST para criar um registro.
        4- update-  PUT para atualizar um registro.
        5- delete- DELETE para remover um registo.
    */

    async create(request, response){
        const{name,email,password}=request.body;

        const database = await sqliteConnection();
        const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        if(checkUserExists){
            throw new AppError("Este e-mail ja esta em uso.")
        }

        return response.status(201).json()
    }
}

module.exports = UsersController;