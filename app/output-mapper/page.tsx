import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Database, Mail, Webhook, Globe, Plus, ArrowRight } from "lucide-react"

export default function OutputMapper() {
  return (
    <div className="p-6 space-y-6 w-full h-full overflow-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Data Output Mapper</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Mapping
        </Button>
      </div>

      <p className="text-muted-foreground">
        Configure how data is routed from sources to destinations across your intelligence network.
      </p>

      <Tabs defaultValue="mappings" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mappings">Active Mappings</TabsTrigger>
          <TabsTrigger value="create">Create Mapping</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="mappings" className="mt-4">
          <div className="grid grid-cols-1 gap-6">
            {[
              {
                name: "Finance News to Database",
                source: "Web Scraper: Finance News",
                destination: "Supabase: finance_news",
                type: "database",
                status: "active",
                frequency: "Every 6 hours",
                lastRun: new Date(Date.now() - 3600000),
              },
              {
                name: "Market Analysis to Email",
                source: "Agent: Market Analyst",
                destination: "Email: team@example.com",
                type: "email",
                status: "active",
                frequency: "Daily at 8 AM",
                lastRun: new Date(Date.now() - 86400000),
              },
              {
                name: "Security Alerts to Webhook",
                source: "Agent: Security Monitor",
                destination: "Webhook: https://api.example.com/alerts",
                type: "webhook",
                status: "paused",
                frequency: "Real-time",
                lastRun: new Date(Date.now() - 7200000),
              },
              {
                name: "Competitor Data to Dashboard",
                source: "Web Scraper: Competitor Monitor",
                destination: "Public Dashboard: Competitor Analysis",
                type: "dashboard",
                status: "active",
                frequency: "Weekly",
                lastRun: new Date(Date.now() - 259200000),
              },
            ].map((mapping, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {mapping.type === "database" && <Database className="h-5 w-5 text-neon" />}
                        {mapping.type === "email" && <Mail className="h-5 w-5 text-neon" />}
                        {mapping.type === "webhook" && <Webhook className="h-5 w-5 text-neon" />}
                        {mapping.type === "dashboard" && <Globe className="h-5 w-5 text-neon" />}
                        {mapping.name}
                      </CardTitle>
                      <CardDescription>{mapping.frequency}</CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        mapping.status === "active" ? "text-neon border-neon" : "text-yellow-400 border-yellow-400"
                      }
                    >
                      {mapping.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-muted-foreground">Source:</div>
                      <div>{mapping.source}</div>
                    </div>
                    <div className="flex justify-center">
                      <ArrowRight className="text-neon h-5 w-5" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-muted-foreground">Destination:</div>
                      <div>{mapping.destination}</div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-muted-foreground">Last Run:</div>
                      <div>{mapping.lastRun.toLocaleString()}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    Run Now
                  </Button>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm">
                    {mapping.status === "active" ? "Pause" : "Resume"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Data Mapping</CardTitle>
              <CardDescription>Configure how data flows from sources to destinations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mapping-name">Mapping Name</Label>
                <Input id="mapping-name" placeholder="e.g., Finance News to Database" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source-type">Source Type</Label>
                  <Select>
                    <SelectTrigger id="source-type">
                      <SelectValue placeholder="Select source type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scraper">Web Scraper</SelectItem>
                      <SelectItem value="agent">AI Agent</SelectItem>
                      <SelectItem value="file">File Upload</SelectItem>
                      <SelectItem value="api">External API</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source-instance">Source Instance</Label>
                  <Select>
                    <SelectTrigger id="source-instance">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="finance-news">Finance News Scraper</SelectItem>
                      <SelectItem value="market-analyst">Market Analyst Agent</SelectItem>
                      <SelectItem value="competitor-monitor">Competitor Monitor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination-type">Destination Type</Label>
                  <Select>
                    <SelectTrigger id="destination-type">
                      <SelectValue placeholder="Select destination type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="database">Supabase Database</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="webhook">Webhook</SelectItem>
                      <SelectItem value="dashboard">Public Dashboard</SelectItem>
                      <SelectItem value="agent">AI Agent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination-details">Destination Details</Label>
                  <Input id="destination-details" placeholder="e.g., Table name or webhook URL" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Update Frequency</Label>
                <Select>
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="custom">Custom Schedule</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transformation">Data Transformation (Optional)</Label>
                <Select>
                  <SelectTrigger id="transformation">
                    <SelectValue placeholder="Select transformation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="filter">Filter Data</SelectItem>
                    <SelectItem value="aggregate">Aggregate Data</SelectItem>
                    <SelectItem value="transform">Transform Structure</SelectItem>
                    <SelectItem value="custom">Custom JavaScript</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mapping-notes">Notes (Optional)</Label>
                <textarea
                  id="mapping-notes"
                  className="w-full min-h-[100px] p-2 rounded-md bg-secondary border border-border"
                  placeholder="Add any notes or details about this mapping..."
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Create Mapping</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "News to Database",
                description: "Route scraped news articles to a database table",
                source: "Web Scraper",
                destination: "Supabase Database",
              },
              {
                name: "Alerts to Email",
                description: "Send critical alerts to email recipients",
                source: "AI Agent",
                destination: "Email",
              },
              {
                name: "Data to Webhook",
                description: "Push collected data to an external API endpoint",
                source: "Multiple Sources",
                destination: "Webhook",
              },
              {
                name: "Intelligence to Dashboard",
                description: "Display processed intelligence on a public dashboard",
                source: "AI Agent",
                destination: "Public Dashboard",
              },
              {
                name: "Scraper to Agent",
                description: "Feed scraped data directly to an AI agent for processing",
                source: "Web Scraper",
                destination: "AI Agent",
              },
              {
                name: "Multi-destination Router",
                description: "Route data to multiple destinations based on content",
                source: "Any Source",
                destination: "Multiple Destinations",
              },
            ].map((template, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Source:</span>
                      <span>{template.source}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Destination:</span>
                      <span>{template.destination}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Use Template</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
