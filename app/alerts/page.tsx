"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Plus, Trash, Mail } from "lucide-react"

interface EmailAlert {
  id: string
  user_email: string
  alert_type: string
  conditions: any
  active: boolean
  created_at: string
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<EmailAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    userEmail: "",
    alertType: "",
    symbol: "",
    condition: "",
    value: "",
  })

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      const response = await fetch("/api/alerts")
      if (!response.ok) throw new Error("Failed to fetch alerts")
      const data = await response.json()
      setAlerts(data)
    } catch (error) {
      console.error("Error fetching alerts:", error)
    } finally {
      setLoading(false)
    }
  }

  const createAlert = async () => {
    try {
      const conditions = {
        symbol: formData.symbol,
        condition: formData.condition,
        value: Number.parseFloat(formData.value),
      }

      const response = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: formData.userEmail,
          alertType: formData.alertType,
          conditions,
        }),
      })

      if (!response.ok) throw new Error("Failed to create alert")

      await fetchAlerts()
      setShowCreateForm(false)
      setFormData({ userEmail: "", alertType: "", symbol: "", condition: "", value: "" })
    } catch (error) {
      console.error("Error creating alert:", error)
    }
  }

  const deleteAlert = async (id: string) => {
    try {
      const response = await fetch(`/api/alerts/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete alert")
      await fetchAlerts()
    } catch (error) {
      console.error("Error deleting alert:", error)
    }
  }

  const toggleAlert = async (id: string, active: boolean) => {
    try {
      const response = await fetch(`/api/alerts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active }),
      })
      if (!response.ok) throw new Error("Failed to update alert")
      await fetchAlerts()
    } catch (error) {
      console.error("Error updating alert:", error)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading alerts...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bell className="h-6 w-6 text-neon" />
          Email Alerts
        </h1>
        <Button onClick={() => setShowCreateForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Alert
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Alert</CardTitle>
            <CardDescription>Set up email notifications for market conditions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.userEmail}
                  onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                  placeholder="your@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alertType">Alert Type</Label>
                <Select
                  value={formData.alertType}
                  onValueChange={(value) => setFormData({ ...formData, alertType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select alert type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price_alert">Price Alert</SelectItem>
                    <SelectItem value="prediction_alert">Prediction Alert</SelectItem>
                    <SelectItem value="volume_alert">Volume Alert</SelectItem>
                    <SelectItem value="change_alert">Change Alert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="symbol">Symbol</Label>
                <Input
                  id="symbol"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  placeholder="BTC, AAPL, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) => setFormData({ ...formData, condition: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">Above</SelectItem>
                    <SelectItem value="below">Below</SelectItem>
                    <SelectItem value="change_above">Change Above</SelectItem>
                    <SelectItem value="change_below">Change Below</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="Enter threshold value"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowCreateForm(false)}>
              Cancel
            </Button>
            <Button onClick={createAlert}>Create Alert</Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alerts.map((alert) => (
          <Card key={alert.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-neon" />
                    {alert.alert_type.replace("_", " ").toUpperCase()}
                  </CardTitle>
                  <CardDescription>{alert.user_email}</CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className={alert.active ? "text-neon border-neon" : "text-red-400 border-red-400"}
                >
                  {alert.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Symbol:</span>
                  <span>{alert.conditions.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Condition:</span>
                  <span>{alert.conditions.condition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Value:</span>
                  <span>{alert.conditions.value}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(alert.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => toggleAlert(alert.id, !alert.active)}>
                {alert.active ? "Disable" : "Enable"}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => deleteAlert(alert.id)}>
                <Trash className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {alerts.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No alerts configured. Create your first alert to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
