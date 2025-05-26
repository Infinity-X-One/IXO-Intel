import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Bot, FileText, Globe } from "lucide-react"

export default function IndustryIntelligence() {
  const industries = [
    { name: "Finance", agents: 3, scrapers: 5, files: 12, confidence: 87 },
    { name: "Healthcare", agents: 2, scrapers: 4, files: 8, confidence: 82 },
    { name: "Energy", agents: 1, scrapers: 3, files: 6, confidence: 75 },
    { name: "Defense", agents: 4, scrapers: 2, files: 15, confidence: 91 },
    { name: "AI & Data", agents: 5, scrapers: 7, files: 20, confidence: 94 },
    { name: "Retail & Ecom", agents: 2, scrapers: 6, files: 10, confidence: 79 },
    { name: "Real Estate", agents: 1, scrapers: 2, files: 5, confidence: 72 },
    { name: "Legal/Regulation", agents: 3, scrapers: 4, files: 14, confidence: 85 },
    { name: "Cybersecurity", agents: 4, scrapers: 3, files: 16, confidence: 89 },
    { name: "Supply Chain", agents: 2, scrapers: 5, files: 9, confidence: 77 },
  ]

  return (
    <div className="p-6 space-y-6 w-full h-full overflow-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Industry Intelligence</h1>
        <Button>Add New Industry</Button>
      </div>

      <p className="text-muted-foreground">
        Access industry-specific intelligence collected by your agents and scrapers.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {industries.map((industry) => (
          <Card key={industry.name} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle>{industry.name}</CardTitle>
              <CardDescription>
                Confidence Score:
                <Badge
                  variant="outline"
                  className={`ml-2 ${
                    industry.confidence >= 85
                      ? "text-neon border-neon"
                      : industry.confidence >= 75
                        ? "text-yellow-400 border-yellow-400"
                        : "text-orange-400 border-orange-400"
                  }`}
                >
                  {industry.confidence}%
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <span>Agents</span>
                  </div>
                  <span>{industry.agents}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>Scrapers</span>
                  </div>
                  <span>{industry.scrapers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Files</span>
                  </div>
                  <span>{industry.files}</span>
                </div>

                <Button variant="ghost" className="w-full mt-2 justify-between">
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
