"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Key, RefreshCw, Webhook } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

export default function ApiAccess() {
  const [apiKey, setApiKey] = useState("sk_live_infinityx1_7f8a9d6e5c3b2a1")

  const generateNewKey = () => {
    // In a real app, this would call a server action to generate a new key
    const newKey = `sk_live_infinityx1_${Math.random().toString(36).substring(2, 15)}`
    setApiKey(newKey)
    toast({
      title: "API Key Generated",
      description: "Your new API key has been created successfully.",
      action: <ToastAction altText="Copy">Copy</ToastAction>,
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The content has been copied to your clipboard.",
    })
  }

  return (
    <div className="p-6 space-y-6 w-full h-full overflow-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">API Access</h1>
        <Button variant="outline" className="gap-2">
          <Key className="h-4 w-4" />
          View Documentation
        </Button>
      </div>

      <p className="text-muted-foreground">
        Integrate Infinity X One Intelligence with your applications using our API. Generate API keys, view endpoints,
        and access documentation.
      </p>

      <Tabs defaultValue="keys" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="examples">Code Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Your API Keys</CardTitle>
              <CardDescription>
                Manage your API keys for authentication with the Infinity X One Intelligence API.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">Live API Key</Label>
                <div className="flex gap-2">
                  <Input id="api-key" value={apiKey} readOnly className="font-mono" />
                  <Button variant="outline" size="icon" onClick={() => copyToClipboard(apiKey)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  This key has full access to your account. Keep it secure and never share it publicly.
                </p>
              </div>

              <div className="pt-2">
                <Button variant="outline" className="gap-2" onClick={generateNewKey}>
                  <RefreshCw className="h-4 w-4" />
                  Generate New Key
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Key Permissions</CardTitle>
              <CardDescription>Configure what your API keys can access.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Web Scraper", enabled: true },
                  { name: "Agent Inbox", enabled: true },
                  { name: "File Trainer", enabled: true },
                  { name: "Storage", enabled: true },
                ].map((permission) => (
                  <div key={permission.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div>{permission.name}</div>
                      {permission.enabled && (
                        <Badge variant="outline" className="text-neon border-neon">
                          Enabled
                        </Badge>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">
                      Configure
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
              <CardDescription>Available endpoints for integrating with Infinity X One Intelligence.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  name: "Web Scraper",
                  endpoint: "POST https://infinityx.one/api/scraper",
                  description: "Submit URLs or keywords for scraping",
                  params: [
                    { name: "url", type: "string", description: "Target URL to scrape" },
                    { name: "mode", type: "string", description: "passive or active" },
                    { name: "output", type: "string", description: "Destination for scraped data" },
                  ],
                },
                {
                  name: "Agent Inbox",
                  endpoint: "POST https://infinityx.one/api/agent",
                  description: "Send data to an agent for processing",
                  params: [
                    { name: "name", type: "string", description: "Agent name" },
                    { name: "data", type: "object", description: "Data to process" },
                    { name: "priority", type: "number", description: "Processing priority (1-10)" },
                  ],
                },
                {
                  name: "File Trainer",
                  endpoint: "POST https://infinityx.one/api/file",
                  description: "Upload files for agent training",
                  params: [
                    { name: "file", type: "binary", description: "File to upload" },
                    { name: "agent", type: "string", description: "Agent to train" },
                    { name: "type", type: "string", description: "File type" },
                  ],
                },
                {
                  name: "Storage",
                  endpoint: "POST https://infinityx.one/api/storage",
                  description: "Store data in Infinity X One",
                  params: [
                    { name: "data", type: "object", description: "Data to store" },
                    { name: "path", type: "string", description: "Storage path" },
                    { name: "access", type: "string", description: "public or private" },
                  ],
                },
              ].map((api) => (
                <div key={api.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{api.name}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1"
                      onClick={() => copyToClipboard(api.endpoint)}
                    >
                      <Copy className="h-3 w-3" />
                      Copy
                    </Button>
                  </div>
                  <div className="font-mono text-sm bg-secondary p-2 rounded-md overflow-x-auto">{api.endpoint}</div>
                  <p className="text-sm text-muted-foreground">{api.description}</p>

                  <div className="text-sm">
                    <div className="font-medium mb-1">Parameters:</div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="font-medium">Name</div>
                      <div className="font-medium">Type</div>
                      <div className="font-medium">Description</div>
                      {api.params.map((param, index) => (
                        <React.Fragment key={index}>
                          <div>{param.name}</div>
                          <div className="text-muted-foreground">{param.type}</div>
                          <div className="text-muted-foreground">{param.description}</div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                  <Separator className="my-4" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Webhooks
              </CardTitle>
              <CardDescription>
                Configure webhooks to receive real-time notifications when events occur.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <div className="flex gap-2">
                  <Input id="webhook-url" placeholder="https://your-app.com/webhooks/infinityx1" className="flex-1" />
                  <Button>Save</Button>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <Label>Events to Trigger Webhook</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    "Agent Created",
                    "Agent Updated",
                    "Scraper Completed",
                    "File Uploaded",
                    "Intelligence Generated",
                    "API Key Created",
                    "Storage Updated",
                    "Hierarchy Changed",
                  ].map((event) => (
                    <div key={event} className="flex items-center space-x-2">
                      <input type="checkbox" id={event.replace(/\s+/g, "-").toLowerCase()} />
                      <label htmlFor={event.replace(/\s+/g, "-").toLowerCase()} className="text-sm">
                        {event}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Update Webhook Configuration</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Code Examples</CardTitle>
              <CardDescription>Examples of how to integrate with the Infinity X One Intelligence API.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">JavaScript / Node.js</h3>
                <pre className="bg-secondary p-4 rounded-md overflow-x-auto text-sm">
                  {`// Send data to an agent
const response = await fetch('https://infinityx.one/api/agent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${apiKey}'
  },
  body: JSON.stringify({
    name: 'pickybot',
    data: {
      source: 'external-api',
      content: 'Data to analyze'
    }
  })
});

const result = await response.json();
console.log(result);`}
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() =>
                    copyToClipboard(`// Send data to an agent
const response = await fetch('https://infinityx.one/api/agent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${apiKey}'
  },
  body: JSON.stringify({
    name: 'pickybot',
    data: {
      source: 'external-api',
      content: 'Data to analyze'
    }
  })
});

const result = await response.json();
console.log(result);`)
                  }
                >
                  Copy Code
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Python</h3>
                <pre className="bg-secondary p-4 rounded-md overflow-x-auto text-sm">
                  {`import requests
import json

# Start a web scraper job
url = "https://infinityx.one/api/scraper"
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer ${apiKey}"
}
payload = {
    "url": "https://example.com",
    "mode": "passive",
    "output": "agent:analyzer"
}

response = requests.post(url, headers=headers, data=json.dumps(payload))
print(response.json())`}
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() =>
                    copyToClipboard(`import requests
import json

# Start a web scraper job
url = "https://infinityx.one/api/scraper"
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer ${apiKey}"
}
payload = {
    "url": "https://example.com",
    "mode": "passive",
    "output": "agent:analyzer"
}

response = requests.post(url, headers=headers, data=json.dumps(payload))
print(response.json())`)
                  }
                >
                  Copy Code
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">cURL</h3>
                <pre className="bg-secondary p-4 rounded-md overflow-x-auto text-sm">
                  {`# Upload a file for agent training
curl -X POST \\
  https://infinityx.one/api/file \\
  -H "Authorization: Bearer ${apiKey}" \\
  -F "file=@/path/to/document.pdf" \\
  -F "agent=research-bot" \\
  -F "type=training"`}
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() =>
                    copyToClipboard(`# Upload a file for agent training
curl -X POST \\
  https://infinityx.one/api/file \\
  -H "Authorization: Bearer ${apiKey}" \\
  -F "file=@/path/to/document.pdf" \\
  -F "agent=research-bot" \\
  -F "type=training"`)
                  }
                >
                  Copy Code
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
