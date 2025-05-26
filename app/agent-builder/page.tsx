import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot, Plus, Trash } from "lucide-react"

export default function AgentBuilder() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">AI Agent Builder</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Bot
        </Button>
      </div>

      <p className="text-muted-foreground">
        Create and configure AI agents to collect, analyze, and distribute intelligence.
      </p>

      <Tabs defaultValue="builder" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="builder">Agent Builder</TabsTrigger>
          <TabsTrigger value="active">Active Agents</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Agent</CardTitle>
              <CardDescription>Configure your agent's role, skills, and knowledge sources.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="agent-name">Agent Name</Label>
                  <Input id="agent-name" placeholder="e.g., FinanceAnalyst" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agent-role">Role</Label>
                  <Select>
                    <SelectTrigger id="agent-role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="analyst">Analyst</SelectItem>
                      <SelectItem value="router">Router</SelectItem>
                      <SelectItem value="scraper">Scraper</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agent-industry">Industry</Label>
                  <Select>
                    <SelectTrigger id="agent-industry">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="energy">Energy</SelectItem>
                      <SelectItem value="defense">Defense</SelectItem>
                      <SelectItem value="ai">AI & Data</SelectItem>
                      <SelectItem value="retail">Retail & Ecom</SelectItem>
                      <SelectItem value="realestate">Real Estate</SelectItem>
                      <SelectItem value="legal">Legal/Regulation</SelectItem>
                      <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                      <SelectItem value="supplychain">Supply Chain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confidence">Confidence Level</Label>
                  <div className="flex items-center gap-4">
                    <Input id="confidence" type="range" min="1" max="10" defaultValue="7" className="w-full" />
                    <span className="w-8 text-center">7</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {["NLP", "Parser", "Watcher", "Summarizer", "Classifier", "Translator"].map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <input type="checkbox" id={skill.toLowerCase()} />
                      <label htmlFor={skill.toLowerCase()} className="text-sm">
                        {skill}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Knowledge Sources</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input placeholder="URL or file path" className="flex-1" />
                    <Button variant="outline" size="icon">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="URL or file path" className="flex-1" />
                    <Button variant="outline" size="icon">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="outline" className="w-full gap-2">
                    <Plus className="h-4 w-4" />
                    Add Knowledge Source
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-instructions">Custom Instructions</Label>
                <textarea
                  id="custom-instructions"
                  className="w-full min-h-[100px] p-2 rounded-md bg-secondary border border-border"
                  placeholder="Enter any specific instructions for this agent..."
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset</Button>
              <Button>Create Agent</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Bot className="h-5 w-5 text-neon" />
                        Agent {i}
                      </CardTitle>
                      <CardDescription>{["Analyst", "Router", "Scraper", "Analyst", "Router"][i - 1]}</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-neon border-neon">
                      Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Industry:</span>
                      <span>{["Finance", "Healthcare", "Energy", "Defense", "AI & Data"][i - 1]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Confidence:</span>
                      <span>{[8, 7, 6, 9, 8][i - 1]}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Knowledge Sources:</span>
                      <span>{[4, 3, 2, 5, 3][i - 1]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Active:</span>
                      <span>{new Date(Date.now() - i * 1000000).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full">
                    Manage Agent
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Financial Analyst",
              "Healthcare Researcher",
              "Energy Trend Watcher",
              "Defense Intelligence",
              "AI Trend Analyzer",
              "Retail Market Watcher",
            ].map((template) => (
              <Card key={template}>
                <CardHeader>
                  <CardTitle>{template}</CardTitle>
                  <CardDescription>Pre-configured agent template</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    This template includes pre-configured skills, knowledge sources, and instructions optimized for{" "}
                    {template.split(" ")[0]} intelligence gathering.
                  </p>
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
