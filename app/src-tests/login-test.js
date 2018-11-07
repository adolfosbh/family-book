import { setupServer, setupTester, getResultFromQuery } from './utils'
import createApp from '../src/app';
import { driver } from '../src/db/db-conn';

const app = createApp()
let server

beforeAll(async () => {
  server = setupServer(app)
})

afterAll( () => {
  driver.close()
})

describe('User creation',  function a() {
  const self = this
  beforeEach(async () => {
      self.tester = setupTester(server)
  })
  
  test('Create non-existing user', async () => {
    const response = await getResultFromQuery(
                    self.tester,
                    `mutation {
                        createUser(user: {userName: "user1", password: "1234", email: "test@gmail.com"}) {
                          userName
                          email
                        }
                    }`,
                )
    expect.assertions(2)
    expect(response.success).toBe(true)
    expect(response.data.userName).not.toBeNull()
  })
})