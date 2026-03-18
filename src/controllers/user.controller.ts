import db from "../models";
import userModel from "../models/user.model";

class UserController {


    async createUser (email:string, password:string ){
        const user = db.User.create()
    }

    async getUserByEmail (email:string) {
        const user = db.User.find({
            where : {email}
        })

        if(!user){
            throw new Error('User not found')
        }

        return user;
    }


}