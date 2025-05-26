"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bot, Plus, ZoomIn, ZoomOut, RefreshCw } from "lucide-react"

export default function HierarchyTree() {
  const [zoomLevel, setZoomLevel] = useState(100)

  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 150))
  }

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 50))
  }

  return (
    <div className="p-6 space-y-6 w-full h-full overflow-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Hierarchy Tree</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={zoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm">{zoomLevel}%</span>
          <Button variant="outline" size="icon" onClick={zoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Node
          </Button>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="View" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Nodes</SelectItem>
            <SelectItem value="agents">Agents Only</SelectItem>
            <SelectItem value="data">Data Sources Only</SelectItem>
            <SelectItem value="industry">By Industry</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="hierarchical">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Layout" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hierarchical">Hierarchical</SelectItem>
            <SelectItem value="force">Force-Directed</SelectItem>
            <SelectItem value="radial">Radial</SelectItem>
            <SelectItem value="tree">Tree</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Agent Hierarchy Visualization</CardTitle>
          <CardDescription>
            Visual representation of relationships between agents, data sources, and outputs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="w-full h-[600px] bg-secondary/30 rounded-md flex items-center justify-center"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            <div className="relative w-full h-full">
              {/* Root Node */}
              <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-20 h-20 rounded-full bg-neon flex items-center justify-center text-black font-bold">
                  X1
                </div>
                <div className="text-center mt-2 text-sm font-medium">Root</div>
              </div>

              {/* Level 1 Nodes */}
              {[
                { name: "Finance", angle: 0, distance: 150 },
                { name: "Healthcare", angle: 72, distance: 150 },
                { name: "Energy", angle: 144, distance: 150 },
                { name: "Defense", angle: 216, distance: 150 },
                { name: "AI & Data", angle: 288, distance: 150 },
              ].map((node, i) => {
                const x = 50 + Math.cos((node.angle * Math.PI) / 180) * node.distance
                const y = 50 + Math.sin((node.angle * Math.PI) / 180) * node.distance
                return (
                  <div
                    key={i}
                    className="absolute w-16 h-16 rounded-full bg-secondary border border-neon flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <Bot className="h-6 w-6 text-neon" />
                    <div className="absolute -bottom-6 text-center text-xs font-medium w-20">{node.name}</div>
                  </div>
                )
              })}

              {/* Level 2 Nodes */}
              {[
                { name: "Analyst 1", parent: 0, offset: -30, distance: 80 },
                { name: "Analyst 2", parent: 0, offset: 30, distance: 80 },
                { name: "Researcher", parent: 1, offset: 0, distance: 80 },
                { name: "Watcher", parent: 2, offset: 0, distance: 80 },
                { name: "Intel 1", parent: 3, offset: -30, distance: 80 },
                { name: "Intel 2", parent: 3, offset: 30, distance: 80 },
                { name: "Trend Bot", parent: 4, offset: 0, distance: 80 },
              ].map((node, i) => {
                const parentAngle = [0, 72, 144, 216, 288][node.parent]
                const angle = parentAngle + node.offset
                const parentX = 50 + Math.cos((parentAngle * Math.PI) / 180) * 150
                const parentY = 50 + Math.sin((parentAngle * Math.PI) / 180) * 150
                const x = parentX + Math.cos((angle * Math.PI) / 180) * node.distance
                const y = parentY + Math.sin((angle * Math.PI) / 180) * node.distance
                return (
                  <div
                    key={i}
                    className="absolute w-12 h-12 rounded-full bg-secondary/80 border border-neon/50 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <Bot className="h-4 w-4 text-neon/80" />
                    <div className="absolute -bottom-6 text-center text-xs font-medium w-20">{node.name}</div>
                  </div>
                )
              })}

              {/* Connection Lines */}
              <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: -1 }}>
                {/* Root to Level 1 connections */}
                {[0, 72, 144, 216, 288].map((angle, i) => {
                  const x2 = 50 + Math.cos((angle * Math.PI) / 180) * 150
                  const y2 = 50 + Math.sin((angle * Math.PI) / 180) * 150
                  return (
                    <line
                      key={i}
                      x1="50%"
                      y1="50%"
                      x2={`${x2}%`}
                      y2={`${y2}%`}
                      stroke="#39FF14"
                      strokeWidth="1"
                      strokeOpacity="0.3"
                    />
                  )
                })}

                {/* Level 1 to Level 2 connections */}
                {[
                  { parent: 0, angle: -30 },
                  { parent: 0, angle: 30 },
                  { parent: 1, angle: 0 },
                  { parent: 2, angle: 0 },
                  { parent: 3, angle: -30 },
                  { parent: 3, angle: 30 },
                  { parent: 4, angle: 0 },
                ].map((conn, i) => {
                  const parentAngle = [0, 72, 144, 216, 288][conn.parent]
                  const angle = parentAngle + conn.angle
                  const x1 = 50 + Math.cos((parentAngle * Math.PI) / 180) * 150
                  const y1 = 50 + Math.sin((parentAngle * Math.PI) / 180) * 150
                  const x2 = x1 + Math.cos((angle * Math.PI) / 180) * 80
                  const y2 = y1 + Math.sin((angle * Math.PI) / 180) * 80
                  return (
                    <line
                      key={i}
                      x1={`${x1}%`}
                      y1={`${y1}%`}
                      x2={`${x2}%`}
                      y2={`${y2}%`}
                      stroke="#39FF14"
                      strokeWidth="1"
                      strokeOpacity="0.2"
                    />
                  )
                })}
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hierarchy Details</CardTitle>
          <CardDescription>Information about the selected node and its connections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            <p>Select a node in the hierarchy tree to view its details</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
