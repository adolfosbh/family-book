import { tester } from 'graphql-tester'
import stoppable from 'stoppable'


const setupServer = (apolloServer)=> {
    return {
        creator: async (port) => {
            const serverInfo = await apolloServer.listen(port)
            const stoppableServer = stoppable(serverInfo.server, 10000)
            return { server: { shutdown: () => stoppableServer.stop() }, 
                     url: serverInfo.url }}
    }
}

const setupTester = (server, { endpoint = '/graphql', authHeader = null } = {}) => {
    return tester({
        server: server,
        url: endpoint,
        contentType: 'application/json',
        authorization: authHeader,
    })
}

const getResultFromQuery = async (tester, query) => {
    return tester(JSON.stringify({ query: query }))
}

export {
    setupServer,
    setupTester,
    getResultFromQuery,
}
