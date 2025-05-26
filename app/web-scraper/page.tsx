import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Bot, Database, FileUp, Globe, Link2, Play, RefreshCw, Repeat, Search } from "lucide-react"

export default function WebScraper() {
  return (
    <div className="p-6 space-y-6 w-full h-full overflow-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Web Scraper Tool</h1>
        <Button className="gap-2">
          <Play className="h-4 w-4" />
          Run Scraper
        </Button>
      </div>

      <p className="text-muted-foreground">
        Configure and run web scrapers to collect data from websites and online sources.
      </p>

      <Tabs defaultValue="new" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="new">New Scraper</TabsTrigger>
          <TabsTrigger value="active">Active Scrapers</TabsTrigger>
          <TabsTrigger value="history">Scraper History</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configure Web Scraper</CardTitle>
              <CardDescription>Set up a new web scraper to collect data from websites.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="scraper-name">Scraper Name</Label>
                <Input id="scraper-name" placeholder="e.g., FinanceNewsScraper" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scraper-input">Input</Label>
                <div className="flex gap-2">
                  <Select defaultValue="url">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Input Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="url">URL</SelectItem>
                      <SelectItem value="keyword">Keyword</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input id="scraper-input" placeholder="https://example.com or search keyword" className="flex-1" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scraper-tool">Scraper Tool</Label>
                <Select>
                  <SelectTrigger id="scraper-tool">
                    <SelectValue placeholder="Select tool" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="playwright">Playwright</SelectItem>
                    <SelectItem value="puppeteer">Puppeteer</SelectItem>
                    <SelectItem value="apify">Apify</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Scraper Mode</Label>
                <RadioGroup defaultValue="passive" className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="passive" id="passive" />
                    <Label htmlFor="passive" className="cursor-pointer">
                      Passive (once)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="active" id="active" />
                    <Label htmlFor="active" className="cursor-pointer">
                      Active (recurring)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scraper-delay">Delay (seconds)</Label>
                  <Input id="scraper-delay" type="number" min="0" defaultValue="2" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scraper-pages">Max Pages</Label>
                  <Input id="scraper-pages" type="number" min="1" defaultValue="10" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scraper-captcha">Captcha Bypass</Label>
                  <Select defaultValue="auto">
                    <SelectTrigger id="scraper-captcha">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Automatic</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scraper-schedule">Schedule (if Active)</Label>
                  <Select>
                    <SelectTrigger id="scraper-schedule">
                      <SelectValue placeholder="Select schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Output Selector</Label>
                <RadioGroup defaultValue="file" className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="file" id="file" />
                    <Label htmlFor="file" className="cursor-pointer flex items-center gap-1">
                      <FileUp className="h-4 w-4" />
                      File Uploader
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="database" id="database" />
                    <Label htmlFor="database" className="cursor-pointer flex items-center gap-1">
                      <Database className="h-4 w-4" />
                      Supabase Table
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="agent" id="agent" />
                    <Label htmlFor="agent" className="cursor-pointer flex items-center gap-1">
                      <Bot className="h-4 w-4" />
                      Agent Inbox
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="external" id="external" />
                    <Label htmlFor="external" className="cursor-pointer flex items-center gap-1">
                      <Link2 className="h-4 w-4" />
                      External API
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="css-selector">CSS Selector (Optional)</Label>
                <Input id="css-selector" placeholder="e.g., article.content, div.news-item" />
                <p className="text-xs text-muted-foreground">
                  Specify CSS selectors to target specific content on the page.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset</Button>
              <Button>Create Scraper</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-neon" />
                        Scraper {i}
                      </CardTitle>
                      <CardDescription>
                        {["Finance News", "Healthcare Updates", "Energy Reports", "AI Research"][i - 1]}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className={i % 2 === 0 ? "text-neon border-neon" : "text-yellow-400 border-yellow-400"}
                    >
                      {i % 2 === 0 ? "Active" : "Scheduled"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Target:</span>
                      <span className="truncate max-w-[200px]">
                        {
                          [
                            "https://finance-news.example.com",
                            "healthcare industry updates",
                            "https://energy-reports.example.com",
                            "ai research papers",
                          ][i - 1]
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tool:</span>
                      <span>{["Playwright", "Puppeteer", "Apify", "Playwright"][i - 1]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mode:</span>
                      <span className="flex items-center gap-1">
                        {i % 2 === 0 ? (
                          <>
                            <Repeat className="h-3 w-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <Play className="h-3 w-3" />
                            Passive
                          </>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Output:</span>
                      <span>{["File", "Database", "Agent", "External API"][i - 1]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Next Run:</span>
                      <span>{new Date(Date.now() + i * 3600000).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" className="gap-1">
                    <RefreshCw className="h-3 w-3" />
                    Run Now
                  </Button>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm">
                    Pause
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Scraper History</CardTitle>
              <CardDescription>View the history of your web scraper runs.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-start space-x-4 p-3 rounded-md bg-secondary/50">
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                      <Search className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div className="font-medium">Scraper {i} completed</div>
                        <Badge
                          variant="outline"
                          className={i % 3 === 0 ? "text-red-400 border-red-400" : "text-neon border-neon"}
                        >
                          {i % 3 === 0 ? "Failed" : "Success"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(Date.now() - i * 3600000).toLocaleString()}
                      </div>
                      <div className="mt-1 text-sm">
                        {i % 3 === 0
                          ? "Failed to access target URL. Captcha detected."
                          : `Successfully scraped ${i * 5} pages and extracted ${i * 12} data points.`}
                      </div>
                      <div className="mt-2 flex gap-2">
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                        {i % 3 !== 0 && (
                          <Button variant="ghost" size="sm">
                            View Data
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Load More
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
