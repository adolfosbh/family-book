import { setupServer, setupTester, getResultFromQuery } from './utils'
import createApp from '../src/app';
import { driver } from '../src/db/db-conn';

const app = createApp()
let server

const cleanDB = () => {
    const session = driver.session()
    session.run(
      `MATCH (n)
      DETACH DELETE n`
    ).then(() => {
      session.close()
      console.log('Databe deleted')
    })
}

beforeAll(async () => {
  server = setupServer(app)
})

afterAll( () => {
  driver.close()
})


describe('User creation',  function a() {
  const self = this
  beforeAll( async () => {
    await cleanDB() 
  })

  beforeEach(async () => {
      self.tester = setupTester(server)
  })
  
  test('Create non-existing user', async () => {
    let response = await getResultFromQuery(
                    self.tester,
                    `mutation {
                        createUser(user: {userName: "user1", password: "1234", email: "test@test.com"}) {
                          userName
                          email
                        }
                    }`)
    expect.assertions(2)
    expect(response.success).toBe(true)
    expect(response.data).toMatchObject({
      createUser : {
        userName : 'user1',
        email: 'test@test.com' 
      }
    })
  })
})