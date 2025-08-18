"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
	BookOpen,
	Clock,
	Star,
	Users,
	Play,
	Lock,
	CheckCircle,
	ArrowLeft,
	Download,
	Share2,
	Trophy,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getCourseById, getLessonsByCourseId } from "@/lib/courses"

export default function CourseDetailPage() {
	const params = useParams() as { id: string }
	const courseId = params.id
	const [showPayment, setShowPayment] = useState(false)
	const [course, setCourse] = useState<any | null>(null)
	const [lessons, setLessons] = useState<any[]>([])

	useEffect(() => {
		;(async () => {
			const data = await getCourseById(courseId)
			setCourse(data)
			if (data?.id) {
				const ls = await getLessonsByCourseId(data.id)
				setLessons(ls)
			}
		})()
	}, [courseId])

	const courseFallback = {
		id: 1,
		title: "Cours",
		description: "",
		longDescription: "",
		instructor: "Instructeur",
		instructorBio: "",
		duration: "",
		rating: 0,
		reviewsCount: 0,
		price: "",
		originalPrice: "",
		level: "",
		category: "",
		image: "/placeholder.svg",
		students: 0,
		language: "",
		lastUpdated: "",
		certificate: false,
		isPaid: false,
		isEnrolled: false,
		lessons: [],
	}

	const handleEnroll = () => {
		if ((course?.price ?? courseFallback.price) === "Gratuit") {
			console.log("Inscription gratuite")
		} else {
			setShowPayment(true)
		}
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Breadcrumb */}
			<div className="border-b bg-muted/30">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center space-x-2 text-sm">
						<Link href="/courses" className="text-muted-foreground hover:text-[#141835] transition-colors">
							Cours
						</Link>
						<span className="text-muted-foreground">/</span>
						<Link href="/courses" className="text-muted-foreground hover:text-[#141835] transition-colors">
							{typeof (course?.category ?? courseFallback.category) === "string"
								? (course?.category ?? courseFallback.category)
								: (course?.category as any)?.name}
						</Link>
						<span className="text-muted-foreground">/</span>
						<span className="text-foreground font-medium">{course?.title ?? courseFallback.title}</span>
					</div>
				</div>
			</div>

			{/* Hero Section */}
			<section className="relative py-16 overflow-hidden">
				<div className="absolute inset-0">
					<Image
						src={(course?.image_url ?? courseFallback.image) || "/placeholder.svg"}
						alt={(course?.title ?? courseFallback.title) as string}
						fill
						className="object-cover"
					/>
					<div className="absolute inset-0 bg-[#141835]/60" />
				</div>

				<div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid lg:grid-cols-3 gap-8 items-start">
						{/* Informations du cours */}
						<div className="lg:col-span-2 text-white space-y-6">
							<div className="space-y-4">
								<div className="flex items-center space-x-2">
									<Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/20">
										<Link href="/courses">
											<ArrowLeft className="w-4 h-4 mr-2" />
											Retour aux cours
										</Link>
									</Button>
								</div>

								<Badge className="bg-[#141835] text-white">
									{typeof (course?.category ?? courseFallback.category) === "string"
										? (course?.category ?? courseFallback.category)
										: (course?.category as any)?.name}
								</Badge>

								<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
									{course?.title ?? courseFallback.title}
								</h1>

								<p className="text-base sm:text-lg text-white/90 max-w-2xl">
									{course?.description ?? courseFallback.description}
								</p>
							</div>

							{/* Stats du cours */}
							<div className="flex flex-wrap gap-4 sm:gap-6 text-sm">
								<div className="flex items-center space-x-2">
									<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
									<span className="font-medium">{course?.rating ?? "-"}</span>
									{course?.reviewsCount && <span className="text-white/70">({course.reviewsCount} avis)</span>}
								</div>
								<div className="flex items-center space-x-2">
									<Users className="w-4 h-4" />
									<span>{course?.students ?? 0} étudiants</span>
								</div>
								<div className="flex items-center space-x-2">
									<Clock className="w-4 h-4" />
									<span>{course?.duration ?? ""}</span>
								</div>
								<div className="flex items-center space-x-2">
									<BookOpen className="w-4 h-4" />
									<span>{(lessons?.length ?? 0) || courseFallback.lessons.length} leçons</span>
								</div>
							</div>

							{/* Instructeur */}
							<div className="flex items-center space-x-3">
								<Avatar className="w-12 h-12">
									<AvatarImage src="/instructor-avatar.png" alt="Avatar instructeur" />
									<AvatarFallback>
										{(course?.admin?.full_name ?? courseFallback.instructor)
											.split(" ")
											.filter(Boolean)
											.map((n: string) => n[0])
											.join("")}
									</AvatarFallback>
								</Avatar>
								<div>
									<p className="font-medium">{course?.admin?.full_name ?? courseFallback.instructor}</p>
									<p className="text-sm text-white/70"></p>
								</div>
							</div>
						</div>

						{/* Card d'inscription */}
						<div className="lg:col-span-1">
							<Card className="sticky top-24 shadow-2xl">
								<CardHeader className="text-center">
									<div className="space-y-2">
										<div className="flex items-center justify-center space-x-2">
											{(course?.originalPrice ?? null) && (
												<span className="text-lg text-muted-foreground line-through">{course?.originalPrice}</span>
											)}
											<span className="text-3xl font-bold text-[#141835]">
												{course?.price ?? courseFallback.price}
											</span>
										</div>
										{(course?.originalPrice ?? null) && (
											<Badge className="bg-red-500 text-white">
												-
												{Math.round(
													(1 - Number.parseInt(course?.price) / Number.parseInt(course?.originalPrice)) * 100,
												)}
												% de réduction
											</Badge>
										)}
									</div>
								</CardHeader>

								<CardContent className="space-y-4">
									<Button size="lg" className="w-full bg-[#141835] text-white hover:bg-[#1a1f4a]" onClick={handleEnroll}>
										{(course?.price ?? courseFallback.price) === "Gratuit" ? "S'inscrire gratuitement" : "Acheter maintenant"}
									</Button>

									<div className="text-center text-sm text-muted-foreground">Garantie satisfait ou remboursé 30 jours</div>

									<div className="space-y-3 pt-4 border-t">
										<h4 className="font-semibold text-[#141835]">Ce cours inclut :</h4>
										<ul className="space-y-2 text-sm">
											<li className="flex items-center space-x-2">
												<CheckCircle className="w-4 h-4 text-green-500" />
												<span>{(course?.duration ?? courseFallback.duration) as string} de vidéo à la demande</span>
											</li>
											<li className="flex items-center space-x-2">
												<CheckCircle className="w-4 h-4 text-green-500" />
												<span>Accès à vie</span>
											</li>
											<li className="flex items-center space-x-2">
												<CheckCircle className="w-4 h-4 text-green-500" />
												<span>Accès sur mobile et TV</span>
											</li>
											{(course?.certificate ?? courseFallback.certificate) && (
												<li className="flex items-center space-x-2">
													<CheckCircle className="w-4 h-4 text-green-500" />
													<span>Certificat de fin de formation</span>
												</li>
											)}
										</ul>
									</div>

									<div className="flex space-x-2 pt-4">
										<Button
											variant="outline"
											size="sm"
											className="flex-1 border-[#141835] text-[#141835] hover:bg-[#141835] hover:text-white bg-transparent"
										>
											<Share2 className="w-4 h-4 mr-2" />
											Partager
										</Button>
										<Button
											variant="outline"
											size="sm"
											className="flex-1 border-[#141835] text-[#141835] hover:bg-[#141835] hover:text-white bg-transparent"
										>
											<Download className="w-4 h-4 mr-2" />
											Wishlist
										</Button>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</section>

			{/* Contenu du cours */}
			<section className="py-12">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid lg:grid-cols-3 gap-8">
						{/* Description et leçons */}
						<div className="lg:col-span-2 space-y-8">
							{/* Description */}
							<div>
								<h2 className="text-2xl font-bold mb-4 text[#141835]">Description du cours</h2>
								<p className="text-muted-foreground leading-relaxed">{course?.longDescription ?? ""}</p>
							</div>

							{/* Contenu du cours */}
							<div>
								<h2 className="text-2xl font-bold mb-6 text-[#141835]">Contenu du cours</h2>
								<div className="space-y-3">
									{(lessons.length ? lessons : courseFallback.lessons).map((lesson: any) => (
										<Card key={lesson.id} className="hover:shadow-md transition-shadow">
											<CardContent className="p-4">
												<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
													<div className="flex items-center space-x-4">
														<div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
															<Play className="w-4 h-4" />
														</div>
														<div>
															<h3 className="font-medium text-[#141835]">{lesson.title}</h3>
															<p className="text-sm text-muted-foreground"></p>
														</div>
													</div>
													<div className="flex items-center justify-between sm:justify-end space-x-4">
														<span className="text-sm text-muted-foreground"></span>
														<Button size="sm" asChild className="bg-[#141835] text-white hover:bg-[#1a1f4a]">
															<Link href={`/courses/${courseId}/lessons/${lesson.id}`}>Regarder</Link>
														</Button>
													</div>
												</div>
											</CardContent>
										</Card>
									))}
									{/* Quiz card */}
									<Card className="hover:shadow-md transition-shadow border-[#141835]/20 bg-[#141835]/5">
										<CardContent className="p-4">
											<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
												<div className="flex items-center space-x-4">
													<div className="w-10 h-10 rounded-full bg-[#141835] flex items-center justify-center">
														<Trophy className="w-4 h-4 text-white" />
													</div>
													<div>
														<h3 className="font-medium text-[#141835]">Quiz Final</h3>
														<p className="text-sm text-muted-foreground">Validez vos connaissances sur l'ensemble du cours</p>
													</div>
												</div>
												<div className="flex items-center justify-between sm:justify-end space-x-4">
													<Badge className="bg-[#141835] text-white">Final</Badge>
													<span className="text-sm text-muted-foreground">5 questions</span>
													<Button size="sm" asChild className="bg-[#141835] text-white hover:bg-[#1a1f4a]">
														<Link href={`/courses/${courseId}/lessons/quiz`}>Commencer</Link>
													</Button>
												</div>
											</div>
										</CardContent>
									</Card>
								</div>
							</div>

							{/* Sidebar infos */}
							<div className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle className="text-[#141835]">Détails du cours</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										<div className="flex justify-between">
											<span className="text-muted-foreground">Niveau</span>
											<span className="font-medium text-[#141835]">{course?.level ?? courseFallback.level}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Durée</span>
											<span className="font-medium text-[#141835]">{course?.duration ?? courseFallback.duration}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Langue</span>
											<span className="font-medium text-[#141835]">{course?.language ?? courseFallback.language}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Dernière mise à jour</span>
											<span className="font-medium text-[#141835]">{course?.lastUpdated ?? courseFallback.lastUpdated}</span>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</div>
				</div>
				</section>

			{/* Modal de paiement */}
			{showPayment && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<Card className="w-full max-w-md">
						<CardHeader>
							<CardTitle className="text-[#141835]">Finaliser l'achat</CardTitle>
							<CardDescription>Vous êtes sur le point d'acheter "{course?.title ?? courseFallback.title}"</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex justify-between items-center p-4 bg-muted rounded-lg">
								<span className="font-medium text-[#141835]">{course?.title ?? courseFallback.title}</span>
								<span className="font-bold text-[#141835]">{course?.price ?? courseFallback.price}</span>
							</div>
							<Button className="w-full bg-[#141835] text-white hover:bg-[#1a1f4a]" size="lg">
								Procéder au paiement
							</Button>
							<Button
								variant="outline"
								className="w-full border-[#141835] text-[#141835] hover:bg-[#141835] hover:text-white bg-transparent"
								onClick={() => setShowPayment(false)}
							>
								Annuler
							</Button>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	)
}
