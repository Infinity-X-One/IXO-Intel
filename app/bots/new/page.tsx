import { BotForm } from "@/components/bots/bot-form"

export default function NewBotPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Create New Bot</h1>
      <BotForm />
    </div>
  )
}
