"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, Upload, File, Bot, Database, X, Check, AlertCircle } from "lucide-react"

export default function FileUploader() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files))
    }
  }

  const simulateUpload = () => {
    setUploading(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="p-6 space-y-6 w-full h-full overflow-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">File Knowledge Uploader</h1>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Files
        </Button>
      </div>

      <p className="text-muted-foreground">
        Upload files to train your AI agents and enhance your intelligence database.
      </p>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
          <TabsTrigger value="history">Upload History</TabsTrigger>
          <TabsTrigger value="library">Knowledge Library</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Knowledge Files</CardTitle>
              <CardDescription>
                Upload documents, PDFs, spreadsheets, and other files to train your AI agents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Input
                  type="file"
                  multiple
                  className="hidden"
                  id="file-upload"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.json,.md"
                />
                <Label htmlFor="file-upload" className="flex flex-col items-center justify-center cursor-pointer h-32">
                  <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    Drag and drop files here, or <span className="text-neon">browse</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports PDF, DOC, DOCX, TXT, CSV, XLSX, JSON, MD
                  </p>
                </Label>
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Selected Files ({files.length})</div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {files.map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-secondary/50 rounded-md">
                        <div className="flex items-center gap-2">
                          <File className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm truncate max-w-[200px] md:max-w-[300px]">{file.name}</div>
                            <div className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeFile(i)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Select>
                    <SelectTrigger id="destination">
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agent">AI Agent</SelectItem>
                      <SelectItem value="database">Knowledge Database</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agent">Target Agent (if applicable)</Label>
                  <Select>
                    <SelectTrigger id="agent">
                      <SelectValue placeholder="Select agent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="finance">Finance Analyst</SelectItem>
                      <SelectItem value="healthcare">Healthcare Researcher</SelectItem>
                      <SelectItem value="energy">Energy Trend Watcher</SelectItem>
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
                    <SelectItem value="extract">Extract Text Only</SelectItem>
                    <SelectItem value="summarize">Extract and Summarize</SelectItem>
                    <SelectItem value="analyze">Full Analysis</SelectItem>
                    <SelectItem value="raw">Store Raw File</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (Optional)</Label>
                <Input id="tags" placeholder="e.g., finance, report, 2023" />
                <p className="text-xs text-muted-foreground">Separate tags with commas</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" disabled={files.length === 0 || uploading}>
                Clear All
              </Button>
              <Button disabled={files.length === 0 || uploading} onClick={simulateUpload}>
                {uploading ? "Uploading..." : "Upload Files"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload History</CardTitle>
              <CardDescription>Recent file uploads and their processing status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "Financial Report Q2 2023.pdf",
                    size: "2.4 MB",
                    date: new Date(Date.now() - 3600000),
                    status: "completed",
                    destination: "Finance Analyst Agent",
                  },
                  {
                    name: "Healthcare Market Analysis.docx",
                    size: "1.8 MB",
                    date: new Date(Date.now() - 86400000),
                    status: "completed",
                    destination: "Healthcare Researcher Agent",
                  },
                  {
                    name: "Energy Sector Data.xlsx",
                    size: "3.2 MB",
                    date: new Date(Date.now() - 172800000),
                    status: "processing",
                    destination: "Knowledge Database",
                  },
                  {
                    name: "Competitor Analysis.pdf",
                    size: "5.1 MB",
                    date: new Date(Date.now() - 259200000),
                    status: "failed",
                    destination: "All Agents",
                  },
                  {
                    name: "Industry Trends 2023.pdf",
                    size: "4.3 MB",
                    date: new Date(Date.now() - 345600000),
                    status: "completed",
                    destination: "Knowledge Database",
                  },
                ].map((file, i) => (
                  <div key={i} className="flex items-start space-x-4 p-3 rounded-md bg-secondary/50">
                    <div className="h-10 w-10 rounded-md bg-secondary flex items-center justify-center">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div className="font-medium">{file.name}</div>
                        <Badge
                          variant="outline"
                          className={
                            file.status === "completed"
                              ? "text-neon border-neon"
                              : file.status === "processing"
                                ? "text-yellow-400 border-yellow-400"
                                : "text-red-400 border-red-400"
                          }
                        >
                          {file.status === "completed" && <Check className="h-3 w-3 mr-1" />}
                          {file.status === "processing" && <AlertCircle className="h-3 w-3 mr-1" />}
                          {file.status === "failed" && <X className="h-3 w-3 mr-1" />}
                          {file.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {file.date.toLocaleString()} • {file.size}
                      </div>
                      <div className="mt-1 text-sm flex items-center gap-2">
                        <span className="text-muted-foreground">Destination:</span>
                        <span className="flex items-center gap-1">
                          {file.destination.includes("Agent") ? (
                            <Bot className="h-3 w-3" />
                          ) : (
                            <Database className="h-3 w-3" />
                          )}
                          {file.destination}
                        </span>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                        {file.status === "completed" && (
                          <Button variant="ghost" size="sm">
                            View in Library
                          </Button>
                        )}
                        {file.status === "failed" && (
                          <Button variant="ghost" size="sm">
                            Retry
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

        <TabsContent value="library" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Library</CardTitle>
              <CardDescription>Browse and manage your uploaded knowledge files</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Input placeholder="Search files..." className="max-w-xs" />
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="doc">Word Documents</SelectItem>
                      <SelectItem value="spreadsheet">Spreadsheets</SelectItem>
                      <SelectItem value="text">Text Files</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by agent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Agents</SelectItem>
                      <SelectItem value="finance">Finance Analyst</SelectItem>
                      <SelectItem value="healthcare">Healthcare Researcher</SelectItem>
                      <SelectItem value="energy">Energy Trend Watcher</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      name: "Financial Report Q2 2023.pdf",
                      type: "pdf",
                      size: "2.4 MB",
                      date: new Date(Date.now() - 3600000),
                      agents: ["Finance Analyst"],
                      tags: ["finance", "report", "2023"],
                    },
                    {
                      name: "Healthcare Market Analysis.docx",
                      type: "doc",
                      size: "1.8 MB",
                      date: new Date(Date.now() - 86400000),
                      agents: ["Healthcare Researcher"],
                      tags: ["healthcare", "market", "analysis"],
                    },
                    {
                      name: "Energy Sector Data.xlsx",
                      type: "spreadsheet",
                      size: "3.2 MB",
                      date: new Date(Date.now() - 172800000),
                      agents: ["Energy Trend Watcher"],
                      tags: ["energy", "data", "trends"],
                    },
                    {
                      name: "Industry Trends 2023.pdf",
                      type: "pdf",
                      size: "4.3 MB",
                      date: new Date(Date.now() - 345600000),
                      agents: ["Finance Analyst", "Energy Trend Watcher"],
                      tags: ["industry", "trends", "2023"],
                    },
                    {
                      name: "Competitor Analysis.pdf",
                      type: "pdf",
                      size: "5.1 MB",
                      date: new Date(Date.now() - 259200000),
                      agents: ["Finance Analyst", "Healthcare Researcher"],
                      tags: ["competitors", "analysis", "market"],
                    },
                    {
                      name: "Research Notes.txt",
                      type: "text",
                      size: "0.3 MB",
                      date: new Date(Date.now() - 432000000),
                      agents: ["Healthcare Researcher"],
                      tags: ["research", "notes"],
                    },
                  ].map((file, i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base truncate">{file.name}</CardTitle>
                        <CardDescription>
                          {file.date.toLocaleDateString()} • {file.size}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            {file.tags.map((tag, j) => (
                              <Badge key={j} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Agents: </span>
                            {file.agents.join(", ")}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          Manage
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Load More Files
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
