import {  gql } from 'apollo-server';

const typeDefs = gql`

type Error {
    code: String! 
    message: String
}

type User {
    userName: String!
    password: String!
    email: String!
    name: String
    surname: String
    sex: Sex
    birthday: String
}

enum Role {
    VIEWER
    EDITOR
    ADMIN
}

enum Sex {
    UNKNOWN
    FEMALE
    MALE
}

type Book {
    name: String!
    owner: User
    users: [BookUser]
}

type BookUser {
    user: User
    role: Role
}

type Query {
    # getUser(userId: ID): User
    # getBook(bookId: ID): Book  
    getUserByToken(token:String): User

}

type Person {
    user: User
    firstName: String!
    birthSurname: String
    currentSurname: String
    bioParents: [Person]
    children: [Person]
    siblings: [Person]
}

input CreateUserInput {
    userName: String!
    password: String!
    email: String!
    name: String
    surname: String
}

type CreateUserResult {
    ok: Boolean!
    user: User
    errors:  [ Error ]
}

input UpdateUserInput {
    email: String
    name: String
    surname: String
    sex: Sex
    birthday: String
}

input LoginInput {
    userName: String!
    password: String!
}

type LoginResult {
    ok: Boolean!
    error: Error
    token: String
}

input CreateBookInput {
    name : String
}

input PersonInput {
    name : String
    surname : String
}

type Mutation {
    createUser(user: CreateUserInput) : User 
    createUserBook(book: CreateBookInput) : Book
    createParent(parent: PersonInput, childId: String) : Person
    createSibling(sibling: PersonInput, personId: String) : Person
    login(login: LoginInput): LoginResult
}

`;

export default typeDefs