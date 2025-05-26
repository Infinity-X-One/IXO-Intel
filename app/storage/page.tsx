import type React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Database, FileText, Bot, Globe, Filter, Download, Share2 } from "lucide-react"

export default function Storage() {
  return (
    <div className="p-6 space-y-6 w-full h-full overflow-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Storage</h1>
        <Button className="gap-2">
          <Filter className="h-4 w-4" />
          Advanced Filter
        </Button>
      </div>

      <p className="text-muted-foreground">Browse, manage, and route all collected and uploaded data sources.</p>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Data</TabsTrigger>
          <TabsTrigger value="scraped">Scraped Data</TabsTrigger>
          <TabsTrigger value="agent">Agent Generated</TabsTrigger>
          <TabsTrigger value="uploaded">Uploaded Files</TabsTrigger>
        </TabsList>

        <div className="mt-4 flex flex-wrap gap-2">
          <Input placeholder="Search data..." className="max-w-xs" />
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="data">Structured Data</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="scraper">Web Scraper</SelectItem>
              <SelectItem value="agent">AI Agent</SelectItem>
              <SelectItem value="upload">File Upload</SelectItem>
              <SelectItem value="api">External API</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="size">Size (Largest)</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Financial News Dataset",
                type: "data",
                source: "Web Scraper",
                size: "12.4 MB",
                date: new Date(Date.now() - 3600000),
                items: 342,
                icon: Globe,
              },
              {
                name: "Market Analysis Report",
                type: "document",
                source: "AI Agent",
                size: "1.8 MB",
                date: new Date(Date.now() - 86400000),
                items: 1,
                icon: Bot,
              },
              {
                name: "Healthcare Research Papers",
                type: "document",
                source: "File Upload",
                size: "45.2 MB",
                date: new Date(Date.now() - 172800000),
                items: 23,
                icon: FileText,
              },
              {
                name: "Competitor Websites Data",
                type: "data",
                source: "Web Scraper",
                size: "8.7 MB",
                date: new Date(Date.now() - 259200000),
                items: 156,
                icon: Globe,
              },
              {
                name: "Energy Sector Analysis",
                type: "document",
                source: "AI Agent",
                size: "2.3 MB",
                date: new Date(Date.now() - 345600000),
                items: 1,
                icon: Bot,
              },
              {
                name: "Industry Database",
                type: "data",
                source: "External API",
                size: "67.1 MB",
                date: new Date(Date.now() - 432000000),
                items: 1205,
                icon: Database,
              },
            ].map((item, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <item.icon className="h-5 w-5 text-neon" />
                      {item.name}
                    </CardTitle>
                    <Badge variant="outline">{item.type}</Badge>
                  </div>
                  <CardDescription>
                    {item.date.toLocaleDateString()} • {item.size}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Source:</span>
                      <span>{item.source}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Items:</span>
                      <span>{item.items}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Download className="h-3 w-3" />
                    Download
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Share2 className="h-3 w-3" />
                    Route
                  </Button>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scraped" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Financial News Dataset",
                type: "data",
                source: "Web Scraper: Finance News",
                size: "12.4 MB",
                date: new Date(Date.now() - 3600000),
                items: 342,
              },
              {
                name: "Competitor Websites Data",
                type: "data",
                source: "Web Scraper: Competitor Monitor",
                size: "8.7 MB",
                date: new Date(Date.now() - 259200000),
                items: 156,
              },
              {
                name: "Healthcare News Articles",
                type: "data",
                source: "Web Scraper: Healthcare Monitor",
                size: "5.2 MB",
                date: new Date(Date.now() - 432000000),
                items: 87,
              },
            ].map((item, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Globe className="h-5 w-5 text-neon" />
                      {item.name}
                    </CardTitle>
                    <Badge variant="outline">{item.type}</Badge>
                  </div>
                  <CardDescription>
                    {item.date.toLocaleDateString()} • {item.size}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Source:</span>
                      <span>{item.source}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Items:</span>
                      <span>{item.items}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Download className="h-3 w-3" />
                    Download
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Share2 className="h-3 w-3" />
                    Route
                  </Button>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="agent" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Market Analysis Report",
                type: "document",
                source: "AI Agent: Market Analyst",
                size: "1.8 MB",
                date: new Date(Date.now() - 86400000),
                items: 1,
              },
              {
                name: "Energy Sector Analysis",
                type: "document",
                source: "AI Agent: Energy Trend Watcher",
                size: "2.3 MB",
                date: new Date(Date.now() - 345600000),
                items: 1,
              },
              {
                name: "Competitor Intelligence",
                type: "document",
                source: "AI Agent: Competitive Analyst",
                size: "3.1 MB",
                date: new Date(Date.now() - 518400000),
                items: 1,
              },
            ].map((item, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Bot className="h-5 w-5 text-neon" />
                      {item.name}
                    </CardTitle>
                    <Badge variant="outline">{item.type}</Badge>
                  </div>
                  <CardDescription>
                    {item.date.toLocaleDateString()} • {item.size}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Source:</span>
                      <span>{item.source}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Items:</span>
                      <span>{item.items}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Download className="h-3 w-3" />
                    Download
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Share2 className="h-3 w-3" />
                    Route
                  </Button>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="uploaded" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Healthcare Research Papers",
                type: "document",
                source: "File Upload",
                size: "45.2 MB",
                date: new Date(Date.now() - 172800000),
                items: 23,
              },
              {
                name: "Financial Reports Q2 2023",
                type: "document",
                source: "File Upload",
                size: "12.8 MB",
                date: new Date(Date.now() - 604800000),
                items: 8,
              },
              {
                name: "Market Research Data",
                type: "data",
                source: "File Upload",
                size: "7.5 MB",
                date: new Date(Date.now() - 691200000),
                items: 3,
              },
            ].map((item, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <FileText className="h-5 w-5 text-neon" />
                      {item.name}
                    </CardTitle>
                    <Badge variant="outline">{item.type}</Badge>
                  </div>
                  <CardDescription>
                    {item.date.toLocaleDateString()} • {item.size}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Source:</span>
                      <span>{item.source}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Items:</span>
                      <span>{item.items}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Download className="h-3 w-3" />
                    Download
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Share2 className="h-3 w-3" />
                    Route
                  </Button>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Data Routing</CardTitle>
          <CardDescription>Route selected data to agents or external destinations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="destination-type">Destination Type</Label>
              <Select>
                <SelectTrigger id="destination-type">
                  <SelectValue placeholder="Select destination type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agent">AI Agent</SelectItem>
                  <SelectItem value="webhook">External Webhook</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="dashboard">Public Dashboard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Select>
                <SelectTrigger id="destination">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="finance">Finance Analyst Agent</SelectItem>
                  <SelectItem value="healthcare">Healthcare Researcher Agent</SelectItem>
                  <SelectItem value="energy">Energy Trend Watcher Agent</SelectItem>
                  <SelectItem value="all">All Agents</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="processing">Processing Options</Label>
            <Select>
              <SelectTrigger id="processing">
                <SelectValue placeholder="Select processing option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="raw">Send Raw Data</SelectItem>
                <SelectItem value="summarize">Summarize Before Sending</SelectItem>
                <SelectItem value="analyze">Analyze and Send Insights</SelectItem>
                <SelectItem value="transform">Transform to Structured Format</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Route Selected Data</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

// Label component
function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {children}
    </label>
  )
}
