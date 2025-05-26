"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smartphone, Tablet, Monitor, CheckCircle, AlertCircle } from "lucide-react"

export function MobileTestHelper() {
  const [testResults, setTestResults] = useState<Record<string, boolean>>({})

  const tests = [
    {
      id: "touch-targets",
      name: "Touch Targets (44px minimum)",
      description: "All buttons and interactive elements are large enough for touch",
      icon: <Smartphone className="h-4 w-4" />,
    },
    {
      id: "input-zoom",
      name: "Input Zoom Prevention",
      description: "Input fields don't trigger zoom on iOS devices",
      icon: <Smartphone className="h-4 w-4" />,
    },
    {
      id: "responsive-grid",
      name: "Responsive Grid Layout",
      description: "Cards adapt properly across different screen sizes",
      icon: <Tablet className="h-4 w-4" />,
    },
    {
      id: "sticky-header",
      name: "Sticky Header",
      description: "Header stays visible when scrolling on mobile",
      icon: <Monitor className="h-4 w-4" />,
    },
    {
      id: "badge-interactions",
      name: "Badge Remove Buttons",
      description: "Easy to tap X buttons without accidental triggers",
      icon: <Smartphone className="h-4 w-4" />,
    },
    {
      id: "loading-states",
      name: "Loading States",
      description: "Proper loading indicators and smooth transitions",
      icon: <Monitor className="h-4 w-4" />,
    },
  ]

  const toggleTest = (testId: string) => {
    setTestResults((prev) => ({
      ...prev,
      [testId]: !prev[testId],
    }))
  }

  const getTestIcon = (testId: string) => {
    const passed = testResults[testId]
    if (passed === undefined) return <AlertCircle className="h-4 w-4 text-yellow-500" />
    return passed ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-500" />
    )
  }

  const passedTests = Object.values(testResults).filter(Boolean).length
  const totalTests = Object.keys(testResults).length

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-neon" />
            Mobile Testing Dashboard
          </CardTitle>
          {totalTests > 0 && (
            <div className="text-sm text-muted-foreground">
              Progress: {passedTests}/{totalTests} tests passed
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {tests.map((test) => (
              <div
                key={test.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  {test.icon}
                  <div>
                    <div className="font-medium text-sm">{test.name}</div>
                    <div className="text-xs text-muted-foreground">{test.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getTestIcon(test.id)}
                  <Button size="sm" variant="outline" onClick={() => toggleTest(test.id)} className="text-xs">
                    {testResults[test.id] === undefined ? "Test" : testResults[test.id] ? "Pass" : "Fail"}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-2">Testing Instructions:</h3>
            <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
              <li>Open this page on your mobile device</li>
              <li>Test each interaction listed above</li>
              <li>Mark each test as Pass/Fail based on your experience</li>
              <li>Report any issues you encounter</li>
            </ol>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-neon">320px</div>
              <div className="text-xs text-muted-foreground">Min Width</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-neon">44px</div>
              <div className="text-xs text-muted-foreground">Touch Target</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-neon">16px</div>
              <div className="text-xs text-muted-foreground">Base Font</div>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Device-Specific Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                iPhone Tests
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                <li>• Input fields don't trigger zoom (font-size: 16px)</li>
                <li>• Safe area handling for notched devices</li>
                <li>• Smooth scrolling and touch interactions</li>
                <li>• PWA installation from Safari</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Android Tests
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                <li>• Touch targets meet Material Design guidelines</li>
                <li>• Proper keyboard behavior</li>
                <li>• PWA installation from Chrome</li>
                <li>• Back button navigation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
