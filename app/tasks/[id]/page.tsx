import { getTask, updateTask, deleteTask } from "../../actions"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import TaskDetailForm from "../../components/TaskDetailForm"

export default async function TaskDetailPage({ params }: { params: { id: string } }) {
  const token = cookies().get("token")
  if (!token) {
    redirect("/login")
  }

  const task = await getTask(params.id)

  if (!task) {
    return <div>Task not found</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Task Details</h1>
      <TaskDetailForm task={task} updateTask={updateTask} deleteTask={deleteTask} />
    </div>
  )
}

