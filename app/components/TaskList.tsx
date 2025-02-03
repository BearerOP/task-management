import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import type { Task } from "../../lib/mongodb"
import { format } from "date-fns"

export default function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {tasks.map((task) => (
        <Card key={task._id} className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              <span className="truncate">{task.title}</span>
              <Checkbox checked={task.completed} disabled />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm truncate">{task.description}</p>
            {task.dueDate && (
              <p className="mt-2 text-xs text-muted-foreground">Due: {format(new Date(task.dueDate), "PPP")}</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button asChild size="sm">
              <Link href={`/api/tasks/${task._id}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

