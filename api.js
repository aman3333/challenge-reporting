module.exports = {
  getHealth,
  getStudent,
  getStudentGradesReport,
  getCourseGradesReport
}

const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './students.db'
  },
  useNullAsDefault: true
})

async function getHealth (req, res, next) {
  res.json({ success: !!knex })
}

async function getStudent (req, res, next) {
  throw new Error('This method has not been implemented yet.')
}

async function getStudentGradesReport (req, res, next) {
  throw new Error('This method has not been implemented yet.')
}

async function getCourseGradesReport (req, res, next) {
  throw new Error('This method has not been implemented yet.')
}
