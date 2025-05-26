import { PredictionForm } from "@/components/predictions/prediction-form"

export default function NewPredictionPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Create New Prediction</h1>
      <PredictionForm />
    </div>
  )
}
