import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Database, Globe, Network, TrendingUp } from "lucide-react"
import { ChatInterface } from "@/components/chat/chat-interface"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Home</h1>
        <div className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleString()}</div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* AI Chat Interface - Prominently displayed at the top */}
        <div className="h-[500px]">
          <ChatInterface />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Agentic Bots</CardTitle>
              <CardDescription>Manage your AI agents</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-neon" />
                <span>Create and manage intelligent AI agents</span>
              </div>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href="/bots">View Bots</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/bots/new">Create Bot</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Predictions</CardTitle>
              <CardDescription>Market predictions and signals</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-neon" />
                <span>Generate and track market predictions</span>
              </div>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href="/predictions">View Predictions</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/predictions/new">Create Prediction</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Data Sources</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">36</div>
              <p className="text-xs text-muted-foreground">+5 from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Scrapers</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">+1 from last week</p>
            </CardContent>
          </Card>
        </div>

        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Intelligence Activity</CardTitle>
            <CardDescription>Data processing over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground flex flex-col items-center">
              <Network className="h-16 w-16 mb-2" />
              <p>Activity chart will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
