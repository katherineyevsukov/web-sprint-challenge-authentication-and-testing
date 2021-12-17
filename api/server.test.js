const request = require('supertest')
const db = require('./../data/dbConfig')
const server = require('./server')
const jokes = require('./jokes/jokes-data')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async () => {
  await db.destroy()
})

test('sanity', () => {
  expect(true).not.toBe(false)
})

test('correct env?', () => {
  expect(process.env.NODE_ENV).toBe('testing')
})
