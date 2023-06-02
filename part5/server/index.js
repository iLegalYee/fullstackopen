const app = require('./app')
const { info, error } = require('./utils/logger')
require('dotenv').config();

const PORT = 3003
app.listen(PORT, () => {
  info(`Server running on port ${PORT}`)
})
