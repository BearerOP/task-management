"use server"

import { revalidatePath } from "next/cache"
import clientPromise from "../lib/mongodb"
import { ObjectId } from "mongodb"
import type { User, Task } from "../lib/mongodb"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

async function getCollection(name: string) {
  if (process.env.NODE_ENV === "production" && !process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set in production environment")
  }
  const client = await clientPromise
  return client.db("taskmanager").collection(name)
}

async function getUserId() {
  const token = cookies().get("token")?.value
  if (!token) throw new Error("Not authenticated")

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    return decoded.userId
  } catch (error) {
    throw new Error("Invalid token")
  }
}

export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    throw new Error("Email and password are required")
  }

  const collection = await getCollection("users")
  const existingUser = await collection.findOne({ email })

  if (existingUser) {
    throw new Error("User already exists")
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const result = await collection.insertOne({
    email,
    password: hashedPassword,
  })

  const token = jwt.sign({ userId: result.insertedId }, JWT_SECRET, { expiresIn: "1d" })
  cookies().set("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" })

  return { success: true }
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    throw new Error("Email and password are required")
  }

  const collection = await getCollection("users")
  const user = await collection.findOne({ email })
  if (!user) {
    throw new Error("Invalid credentials")
  }
  const typedUser = user as User

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid credentials")
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" })
  cookies().set("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" })

  return { success: true }
}

export async function getTasks() {
  const userId = await getUserId()
  const collection = await getCollection("tasks")
  return collection.find({ userId }).sort({ createdAt: -1 }).toArray() as Promise<Task[]>
}

export async function getTask(id: string) {
  const userId = await getUserId()
  const collection = await getCollection("tasks")
  return collection.findOne({ _id: new ObjectId(id), userId }) as Promise<Task | null>
}

export async function addTask(formData: FormData) {
  const userId = await getUserId()
  const collection = await getCollection("tasks")
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const dueDate = formData.get("dueDate") as string

  if (!title) {
    throw new Error("Title is required")
  }

  const result = await collection.insertOne({
    userId,
    title,
    description,
    dueDate: dueDate ? new Date(dueDate) : null,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  revalidatePath("/")
  return result
}

export async function updateTask(formData: FormData) {
  const userId = await getUserId()
  const collection = await getCollection("tasks")
  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const dueDate = formData.get("dueDate") as string
  const completed = formData.get("completed") === "on"

  if (!id || !title) {
    throw new Error("ID and Title are required")
  }

  const result = await collection.updateOne(
    { _id: new ObjectId(id), userId },
    {
      $set: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        completed,
        updatedAt: new Date(),
      },
    },
  )

  revalidatePath("/")
  return result
}

export async function deleteTask(formData: FormData) {
  const userId = await getUserId()
  const collection = await getCollection("tasks")
  const id = formData.get("id") as string

  if (!id) {
    throw new Error("ID is required")
  }

  const result = await collection.deleteOne({ _id: new ObjectId(id), userId })

  revalidatePath("/")
  return result
}

