import ContactForm from "@/components/contact-form"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  return (
    <main>
      <section className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-10 sm:py-14">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#141835]">Contact</h1>
        <p className="mt-3 text-muted-foreground">Une question, une suggestion, ou besoin d’aide ? Écrivez-nous.</p>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Infos de contact */}
          <div className="rounded-2xl border bg-white p-5 sm:p-6">
            <ul className="grid gap-5">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-[#141835] mt-0.5" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">support@ay-e-campus.com</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-[#141835] mt-0.5" />
                <div>
                  <p className="font-medium">Téléphone</p>
                  <p className="text-muted-foreground">+221 00 00 00 00</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#141835] mt-0.5" />
                <div>
                  <p className="font-medium">Adresse</p>
                  <p className="text-muted-foreground">Dakar, Sénégal</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Formulaire */}
          <div className="rounded-2xl border bg-white p-5 sm:p-6">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  )
}
