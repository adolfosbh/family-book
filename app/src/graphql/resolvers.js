import * as db from '../db/db-queries';
import {createPasswordHash, checkUser, createToken, checkToken} from '../utils/login'
import { ForbiddenError } from 'apollo-server';


const checkUserInContext = (context) => {
    if (!context.userUUID) {
        throw new ForbiddenError("This API method requires authentication")    
    }
}

const resolvers = {
    Query: {
      // TO DELETE
      getUserByToken: (root, args, context, info) =>
        checkToken(args.token).then( ( {ok, user, error} ) => {
            if (ok === false) {
                console.log(error)
            }
            return user
        })
    },

    Mutation: {
        createUser: (root, args, context, info) => 
            db.newUser({ userName: args.user.userName, 
                passwordHash: createPasswordHash(args.user.password),
                email: args.user.email
                }),
        
        login: (root, args, context, info) => 
            checkUser(args.login.userName, args.login.password).then ( ({ok, uuid, error}) => {
                if (ok === true) {
                    return {
                        ok,
                        token: createToken(uuid)
                    } 
                } else {
                    return {
                        ok,
                        error
                    }
                }
            }),
            
        createUserBook: (root, args, context, info) => { 
            checkUserInContext(context)
            return db.newUserBook( args.book , context.userUUID )
        },
        createParent: (root, args, context, info) => {
            checkUserInContext(context)
            return db.newFamilyAndParent(args.parent, args.childId)
        },
        createSibling: async (root, args, context, info) => {
            checkUserInContext(context)
            const familyId = await db.getFamilyId(args.personId)
            return db.newChild(args.sibling, familyId)
        }
    },
};

export default resolvers