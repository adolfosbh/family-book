import createApp from './app.js'

createApp().listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});