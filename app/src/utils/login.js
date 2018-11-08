import bcrypt from 'bcryptjs'
import Paseto from 'paseto.js'
import { getUserByUserName, getUserByUUID } from '../db/db-queries'

const encoder = new Paseto.V2();
let sk; // TODO Provide a custom and fixed key
encoder.symmetric().then(key=> { sk = key  } );

const saltRounds = 10;

const createPasswordHash =  (plainPass) => bcrypt.hashSync(plainPass, bcrypt.genSaltSync(saltRounds))

const checkUser = async (userName, password) => 
    getUserByUserName(userName).then(user => 
        (!user) ? {ok: false, error : { code: "nonexisting_user" } }
                : bcrypt.compare(password, user.passwordHash).then(ok => {
                    return ok ? { ok, uuid: user.uuid } : { ok, error: { code: "invalid_password" } }
                }) 
    );

const createToken = (userUUID) => {
    const exp = new Date()
    exp.setMonth(exp.getMonth()+1)
    return encoder.encrypt(JSON.stringify( {uuid:userUUID, exp}), sk)
}

const checkToken = async (token) => {
    try {
       const data = await encoder.decrypt(token, sk)
       const { uuid, exp } = JSON.parse(data)
       const user = await getUserByUUID(uuid)
       if (!user) {
           return { ok : false, error: { code: 'invalid_token_user'} }
       }

       if (new Date(exp) < new Date()) {
           return { ok : false, error: { code: 'invalid_token_exp_date'}}
       }
       return { ok : true, user}
    } catch (e) { 
        return { ok: false, error: { code: 'invalid_token' } } 
    }
}


export {
    createPasswordHash,
    checkUser,
    createToken,
    checkToken
}
