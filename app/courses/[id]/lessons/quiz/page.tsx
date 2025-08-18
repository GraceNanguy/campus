"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ChevronLeft, Award, CheckCircle, Trophy } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useParams } from "next/navigation"

export default function CourseQuizPage() {
  const params = useParams()
  const { id: courseId } = params
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)

  // Quiz final du cours
  const courseQuiz = {
    title: "Quiz Final - Développement Web avec React",
    description: "Testez vos connaissances sur l'ensemble du cours React",
    questions: [
      {
        id: 1,
        question: "Qu'est-ce que React ?",
        options: [
          "Un framework JavaScript complet",
          "Une bibliothèque JavaScript pour créer des interfaces utilisateur",
          "Un langage de programmation",
          "Un serveur web",
        ],
        correctAnswer: 1,
        points: 10,
      },
      {
        id: 2,
        question: "Quel est l'avantage principal du Virtual DOM ?",
        options: [
          "Il rend le code plus lisible",
          "Il améliore les performances en minimisant les manipulations du DOM réel",
          "Il permet d'écrire du CSS en JavaScript",
          "Il gère automatiquement les erreurs",
        ],
        correctAnswer: 1,
        points: 10,
      },
      {
        id: 3,
        question: "Que signifie JSX ?",
        options: ["JavaScript eXtended", "Java Syntax eXtension", "JavaScript XML", "JSON eXtended"],
        correctAnswer: 2,
        points: 10,
      },
      {
        id: 4,
        question: "Quel hook permet de gérer l'état local d'un composant ?",
        options: ["useEffect", "useState", "useContext", "useReducer"],
        correctAnswer: 1,
        points: 15,
      },
      {
        id: 5,
        question: "À quoi sert useEffect ?",
        options: [
          "À gérer l'état du composant",
          "À créer des composants",
          "À gérer les effets de bord et le cycle de vie",
          "À styliser les composants",
        ],
        correctAnswer: 2,
        points: 15,
      },
    ],
    passingScore: 40, // Sur 60 points total
    certificateScore: 50, // Score pour obtenir le certificat
  }

  const course = {
    id: 1,
    title: "Développement Web avec React",
    lessons: [
      { id: 1, title: "Introduction à React", isCompleted: true },
      { id: 2, title: "Installation et configuration", isCompleted: true },
      { id: 3, title: "Votre premier composant", isCompleted: true },
      { id: 4, title: "Props et State", isCompleted: true },
      { id: 5, title: "Exercice pratique - Todo App", isCompleted: true },
      { id: 6, title: "Les Hooks essentiels", isCompleted: true },
    ],
  }

  const totalPoints = courseQuiz.questions.reduce((sum, q) => sum + q.points, 0)
  const completedLessons = course.lessons.filter((l) => l.isCompleted).length
  const courseProgress = (completedLessons / course.lessons.length) * 100

  const handleQuizAnswer = (questionId, answerIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }))
  }

  const submitQuiz = () => {
    let totalScore = 0
    courseQuiz.questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        totalScore += question.points
      }
    })

    setScore(totalScore)
    setQuizCompleted(true)
  }

  const resetQuiz = () => {
    setSelectedAnswers({})
    setQuizCompleted(false)
    setScore(0)
  }

  const getScoreColor = () => {
    if (score >= courseQuiz.certificateScore) return "text-green-600"
    if (score >= courseQuiz.passingScore) return "text-blue-600"
    return "text-red-600"
  }

  const getScoreBadge = () => {
    if (score >= courseQuiz.certificateScore) return { text: "Excellent", color: "bg-green-500" }
    if (score >= courseQuiz.passingScore) return { text: "Validé", color: "bg-blue-500" }
    return { text: "Non validé", color: "bg-red-500" }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Contenu principal */}
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 max-w-4xl mx-auto">
          <div className="p-4 sm:p-6 space-y-8">
            {/* En-tête du quiz */}
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-[#141835]/10 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="w-10 h-10 text-[#141835]" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[#141835]">{courseQuiz.title}</h1>
                <p className="text-muted-foreground text-base sm:text-lg">{courseQuiz.description}</p>
              </div>

              {/* Statistiques du quiz */}
              <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-lg text-[#141835]">{courseQuiz.questions.length}</div>
                  <div className="text-muted-foreground">Questions</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg text-[#141835]">{totalPoints}</div>
                  <div className="text-muted-foreground">Points total</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg text-[#141835]">{courseQuiz.passingScore}</div>
                  <div className="text-muted-foreground">Score requis</div>
                </div>
              </div>
            </div>

            {/* Quiz */}
            {!quizCompleted ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-[#141835]" />
                    <span className="text-[#141835]">Questions du quiz final</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {courseQuiz.questions.map((question, index) => (
                    <div key={question.id} className="space-y-4 p-4 border rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h3 className="font-medium text-base sm:text-lg text-[#141835]">Question {index + 1}</h3>
                        <Badge variant="outline" className="border-[#141835] text-[#141835] w-fit">
                          {question.points} points
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{question.question}</p>
                      <RadioGroup
                        value={selectedAnswers[question.id]?.toString()}
                        onValueChange={(value) => handleQuizAnswer(question.id, Number.parseInt(value))}
                      >
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <RadioGroupItem value={optionIndex.toString()} id={`q${question.id}-${optionIndex}`} />
                            <Label htmlFor={`q${question.id}-${optionIndex}`} className="cursor-pointer">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ))}

                  <div className="text-center pt-4">
                    <Button
                      onClick={submitQuiz}
                      size="lg"
                      className="px-8 bg-[#141835] text-white hover:bg-[#1a1f4a]"
                      disabled={Object.keys(selectedAnswers).length !== courseQuiz.questions.length}
                    >
                      Valider le quiz final
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Résultats du quiz */
              <Card>
                <CardContent className="p-4 sm:p-8">
                  <div className="text-center space-y-6">
                    <div
                      className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${
                        score >= courseQuiz.certificateScore
                          ? "bg-green-100"
                          : score >= courseQuiz.passingScore
                            ? "bg-blue-100"
                            : "bg-red-100"
                      }`}
                    >
                      {score >= courseQuiz.certificateScore ? (
                        <Trophy className="w-12 h-12 text-green-600" />
                      ) : score >= courseQuiz.passingScore ? (
                        <CheckCircle className="w-12 h-12 text-blue-600" />
                      ) : (
                        <Award className="w-12 h-12 text-red-600" />
                      )}
                    </div>

                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold mb-2 text-[#141835]">
                        {score >= courseQuiz.certificateScore
                          ? "Félicitations ! 🎉"
                          : score >= courseQuiz.passingScore
                            ? "Cours validé !"
                            : "Quiz non validé"}
                      </h2>
                      <p className={`text-2xl sm:text-3xl font-bold mb-4 ${getScoreColor()}`}>
                        {score}/{totalPoints} points
                      </p>

                      <Badge className={`${getScoreBadge().color} text-white text-base sm:text-lg px-4 py-2`}>
                        {getScoreBadge().text}
                      </Badge>
                    </div>

                    {/* Messages selon le score */}
                    <div className="max-w-md mx-auto">
                      {score >= courseQuiz.certificateScore ? (
                        <div className="space-y-4">
                          <p className="text-muted-foreground">
                            Score excellent ! Vous maîtrisez parfaitement React. Votre certificat est disponible.
                          </p>
                          <div className="space-y-2">
                            <Button size="lg" className="bg-green-600 hover:bg-green-700 w-full">
                              <Trophy className="w-4 h-4 mr-2" />
                              Télécharger le certificat
                            </Button>
                            <Button size="lg" asChild className="w-full bg-[#141835] text-white hover:bg-[#1a1f4a]">
                              <Link href={`/courses/${courseId}`}>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Cours terminé
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ) : score >= courseQuiz.passingScore ? (
                        <div className="space-y-4">
                          <p className="text-muted-foreground">Bien joué ! Vous avez validé le cours avec succès.</p>
                          <Button size="lg" asChild className="w-full bg-[#141835] text-white hover:bg-[#1a1f4a]">
                            <Link href={`/courses/${courseId}`}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Cours terminé
                            </Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-muted-foreground">
                            Score insuffisant. Révisez le cours et recommencez le quiz.
                          </p>
                          <Button
                            onClick={resetQuiz}
                            variant="outline"
                            size="lg"
                            className="border-[#141835] text-[#141835] hover:bg-[#141835] hover:text-white bg-transparent"
                          >
                            Recommencer le quiz
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Détail des réponses */}
                    <div className="text-left max-w-2xl mx-auto pt-6 border-t">
                      <h3 className="font-semibold mb-4 text-[#141835]">Détail de vos réponses :</h3>
                      <div className="space-y-3">
                        {courseQuiz.questions.map((question, index) => {
                          const isCorrect = selectedAnswers[question.id] === question.correctAnswer
                          return (
                            <div
                              key={question.id}
                              className={`p-3 rounded-lg border ${
                                isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">Question {index + 1}</span>
                                <div className="flex items-center space-x-2">
                                  {isCorrect ? (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <span className="w-4 h-4 rounded-full bg-red-600"></span>
                                  )}
                                  <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                                    {isCorrect ? `+${question.points}` : "0"} pts
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">{question.question}</p>
                              {!isCorrect && (
                                <p className="text-sm text-green-600 mt-1">
                                  Bonne réponse : {question.options[question.correctAnswer]}
                                </p>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-between py-6 border-t gap-4">
              <Button
                variant="outline"
                asChild
                className="border-[#141835] text-[#141835] hover:bg-[#141835] hover:text-white bg-transparent"
              >
                <Link href={`/courses/${courseId}/lessons/6`}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Dernière leçon
                </Link>
              </Button>

              {quizCompleted && score >= courseQuiz.passingScore ? (
                <Button asChild className="bg-[#141835] text-white hover:bg-[#1a1f4a]">
                  <Link href={`/courses/${courseId}`}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Cours terminé
                  </Link>
                </Button>
              ) : (
                <Button disabled>Terminer le quiz pour finir le cours</Button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar avec progression */}
        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l bg-muted/30">
          <div className="p-4 border-b">
            <h2 className="font-semibold mb-2 text-[#141835]">{course.title}</h2>
            <div className="space-y-2">
              <Progress value={courseProgress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {completedLessons} sur {course.lessons.length} leçons terminées
              </p>
            </div>
          </div>

          <div className="p-4 space-y-2">
            {course.lessons.map((lesson, index) => (
              <Card key={lesson.id} className="cursor-pointer transition-colors hover:bg-muted/50">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        lesson.isCompleted ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {lesson.isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium line-clamp-2">{lesson.title}</h4>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Quiz final dans la sidebar */}
            <Card className="ring-2 ring-[#141835] bg-[#141835]/5">
              <CardContent className="p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-[#141835] text-white flex items-center justify-center">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-[#141835]">Quiz Final</h4>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
