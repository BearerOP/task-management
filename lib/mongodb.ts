import { MongoClient } from "mongodb"

if (!process.env.MONGODB_URI && process.env.NODE_ENV !== "production") {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI || "mongodb://placeholder"
const options = {}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise

export interface User {
  _id: string
  email: string
  password: string
}

export interface Task {
  _id: string
  userId: string
  title: string
  description?: string
  dueDate?: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

