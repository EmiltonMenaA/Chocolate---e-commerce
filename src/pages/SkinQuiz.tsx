import { useState } from 'react'

export default function SkinQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)

  const questions = [
    {
      id: 1,
      question: "¿Cuál es tu tipo de piel?",
      options: ["Seca", "Grasa", "Mixta", "Normal", "Sensible"]
    },
    {
      id: 2,
      question: "¿Cuáles son tus principales preocupaciones?",
      options: ["Acné", "Arrugas", "Hiperpigmentación", "Sequedad", "Sensibilidad"]
    },
    {
      id: 3,
      question: "¿Con qué frecuencia usas protector solar?",
      options: ["Diariamente", "A veces", "Nunca", "Solo en verano", "No uso"]
    },
    {
      id: 4,
      question: "¿Tienes alguna alergia conocida?",
      options: ["No", "Sí, a fragancia", "Sí, a ácido salicílico", "Sí, otro", "Prefiero no decir"]
    },
    {
      id: 5,
      question: "¿Cuál es tu presupuesto mensual para skincare?",
      options: ["Menos de $50", "$50-100", "$100-200", "Más de $200", "Flexible"]
    }
  ]

  const recommendations: { [key: string]: string[] } = {
    "Seca": ["Serum Facial Premium", "Crema Hidratante de Chocolate", "Aceite Corporal Aromático"],
    "Grasa": ["Limpiador Facial Suave", "Tónico Equilibrante", "Máscara Facial Detox"],
    "Mixta": ["Serum Facial Premium", "Limpiador Facial Suave", "Tónico Equilibrante"],
    "Normal": ["Serum Facial Premium", "Crema Hidratante de Chocolate", "Máscara Facial Detox"],
    "Sensible": ["Crema Hidratante de Chocolate", "Aceite Corporal Aromático", "Serum Facial Premium"]
  }

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const recommendedProducts = answers[0] ? recommendations[answers[0]] : []

  return (
    <div className="px-6 lg:px-20 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-cocoa-900 dark:text-white text-center mb-4">
          Descubre Tu Tipo de Piel
        </h1>
        <p className="text-center text-cocoa-700 dark:text-slate-300 mb-12 text-lg">
          Responde nuestro cuestionario para obtener recomendaciones personalizadas
        </p>

        {!showResults ? (
          <div className="bg-white dark:bg-cocoa-800 rounded-xl p-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-cocoa-700 dark:text-slate-300">
                  Pregunta {currentQuestion + 1} de {questions.length}
                </span>
                <span className="text-sm font-semibold text-primary">
                  {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-cocoa-200 dark:bg-cocoa-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-cocoa-900 dark:text-white mb-6">
                {questions[currentQuestion].question}
              </h2>

              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="w-full p-3 text-left border-2 border-cocoa-200 dark:border-cocoa-700 rounded-lg hover:border-primary hover:bg-cocoa-50 dark:hover:bg-cocoa-700 transition-colors font-semibold"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-4">
              {currentQuestion > 0 && (
                <button
                  onClick={() => setCurrentQuestion(currentQuestion - 1)}
                  className="flex-1 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
                >
                  Atrás
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-cocoa-800 rounded-xl p-8">
            <div className="text-center mb-8">
              <span className="material-symbols-outlined text-6xl text-green-500 mb-4 block">
                check_circle
              </span>
              <h2 className="text-2xl font-bold text-cocoa-900 dark:text-white">
                ¡Gracias por completar el cuestionario!
              </h2>
            </div>

            {/* Results */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-cocoa-900 dark:text-white mb-4">
                Tipo de Piel: <span className="text-primary">{answers[0]}</span>
              </h3>
              <p className="text-cocoa-700 dark:text-slate-300">
                Basado en tus respuestas, te recomendamos los siguientes productos:
              </p>
            </div>

            {/* Recommended Products */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {recommendedProducts.map((product, index) => (
                <div key={index} className="bg-cocoa-50 dark:bg-cocoa-700 p-4 rounded-lg text-center">
                  <p className="font-semibold text-cocoa-900 dark:text-white">
                    {product}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setCurrentQuestion(0)
                setAnswers([])
                setShowResults(false)
              }}
              className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              Realizar Cuestionario Nuevamente
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
