import { getTasks } from "./actions"
import TaskList from "./components/TaskList"
import { Timeline } from "./components/Timeline"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function Home() {
  const token = cookies().get("token")
  if (!token) {
    redirect("/login")
  }

  const tasks = await getTasks()

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Task Manager</h1>
        <div className="space-x-4">
          <Button asChild>
            <Link href="/add-task">Add New Task</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/logout">Logout</Link>
          </Button>
        </div>
      </div>
      <Tabs defaultValue="grid" className="w-full">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        <TabsContent value="grid">
          <TaskList tasks={tasks} />
        </TabsContent>
        <TabsContent value="timeline">
          <Timeline tasks={tasks} />
        </TabsContent>
      </Tabs>
    </main>
  )
}

