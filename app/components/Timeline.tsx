import { Card, CardContent } from "@/components/ui/card"
import type { Task } from "../../lib/mongodb"
import { format } from "date-fns"

export function Timeline({ tasks }: { tasks: Task[] }) {
  const sortedTasks = [...tasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="space-y-8">
      {sortedTasks.map((task, index) => (
        <div key={task._id} className="flex">
          <div className="flex flex-col items-center mr-4">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            {index !== sortedTasks.length - 1 && <div className="w-0.5 h-full bg-blue-300"></div>}
          </div>
          <Card className="flex-grow">
            <CardContent className="pt-6">
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-sm text-muted-foreground">{format(new Date(task.createdAt), "PPpp")}</p>
              <p className="mt-2">{task.description}</p>
              {task.dueDate && (
                <p className="mt-2 text-sm text-muted-foreground">Due: {format(new Date(task.dueDate), "PPP")}</p>
              )}
              <p className="mt-2 text-sm font-medium">Status: {task.completed ? "Completed" : "Pending"}</p>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}

