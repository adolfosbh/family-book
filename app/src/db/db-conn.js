const neo4j = require('neo4j-driver').v1

const [url, user, pass] = ( () => {
    switch (process.env.NODE_ENV) {
        case 'production':
            return [
                process.env.NEO4J_URL_PROD, 
                process.env.NEO4J_USER_PROD,
                process.env.NEO4J_PASSWORD_PROD,
            ]
        case 'test':
        default: return [
            process.env.NEO4J_URL_DUMMY, 
            process.env.NEO4J_USER_DUMMY,
            process.env.NEO4J_PASSWORD_DUMMY,
        ]
    }
})()

const driver = neo4j.driver(url, neo4j.auth.basic(user, pass))

export { driver }