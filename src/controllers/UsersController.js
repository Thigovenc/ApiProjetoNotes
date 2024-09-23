const AppError = require("../utils/AppError")

class UsersController {

    /*
        1- index - GET para listar registros.
        2- Show - GET para exibir um registro.
        3- create - POST para criar um registro.
        4- update-  PUT para atualizar um registro.
        5- delete- DELETE para remover um registo.
    */

    create(request, response){
        const{name,email,password}=request.body;

        if(!name){
            throw new AppError("O NOME e obrigatorio!");
        }
        response.status(201).json({name,email,password});
    }
}

module.exports = UsersController;