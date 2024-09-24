const {hash, compare} = require("bcryptjs")
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

        const hashedPassword = await hash(password,8)

        await database.run("INSERT INTO users (name,email,password) VALUES (?,?,?)", [name,email,hashedPassword]);

        return response.status(201).json()
    }

    async update(request,response){
        const {name,email,password, old_password} = request.body;
        const {id} = request.params;

        const database = await sqliteConnection();
        const user = await database.get("SELECT * FROM users WHERE id=(?)", [id])

        if(!user){
            throw new AppError("Usuario nao encontrado")
        }

        const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email=(?)", [email])

        if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
            throw new AppError("Este email ja esta em uso.")
        }

        user.name = name;
        user.email = email;

        if(password && !old_password){
            throw new AppError("Voce precisa informar a senha antiga para definir a nova senha !!")
        }

        if(password && old_password){
            const checkOldPassword = await compare(old_password,user.password)

            if(!checkOldPassword){
                throw new AppError("A senha antiga nao confere")
            }

            user.password = await hash(password,8)
        }

        await database.run(`UPDATE users SET
            name = ?,
            email = ?,
            password= ?,
            update_at = ?
            WHERE id = ?`, [user.name, user.email,user.password,new Date(),id]);
        
        return response.status(200).json();
    }


}

module.exports = UsersController;