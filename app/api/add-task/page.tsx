import TaskForm from "../../components/TaskForm"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default function AddTaskPage() {
  const token = cookies().get("token")
  if (!token) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Add New Task</h1>
      <TaskForm />
    </div>
  )
}

