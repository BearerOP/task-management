"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import type { Task } from "../../lib/mongodb"
import { DatePicker } from "./DatePicker"

interface TaskDetailFormProps {
  task: Task
  updateTask: (formData: FormData) => Promise<any>
  deleteTask: (formData: FormData) => Promise<any>
}

export default function TaskDetailForm({ task, updateTask, deleteTask }: TaskDetailFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [dueDate, setDueDate] = useState<Date | undefined>(task.dueDate ? new Date(task.dueDate) : undefined)
  const { toast } = useToast()
  const router = useRouter()

  async function handleUpdate(formData: FormData) {
    setIsLoading(true)
    try {
      formData.set("dueDate", dueDate ? dueDate.toISOString() : "")
      await updateTask(formData)
      toast({
        title: "Task updated successfully",
        description: "Your task has been updated.",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete() {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("id", task._id)
      await deleteTask(formData)
      toast({
        title: "Task deleted successfully",
        description: "Your task has been removed.",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Task</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleUpdate(new FormData(e.currentTarget))
          }}
        >
          <input type="hidden" name="id" value={task._id} />
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={task.title} required />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={task.description} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="dueDate">Due Date</Label>
              <DatePicker date={dueDate} setDate={setDueDate} />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="completed" name="completed" defaultChecked={task.completed} />
              <Label htmlFor="completed">Completed</Label>
            </div>
          </div>
          <CardFooter className="px-0 mt-4 flex justify-between">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Task"}
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete Task"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}

