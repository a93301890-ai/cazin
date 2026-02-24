import Image from "next/image"
import { Gamepad2, TrendingUp, Shield, Zap } from "lucide-react"

export function FeaturesSection() {
  return (
    <section id="about" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-[var(--font-playfair)] text-3xl font-bold text-foreground md:text-5xl">
            {"Почему "}
            <span className="text-gold">Royal Fortune?</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Мы создали платформу, где азарт встречается с безопасностью и комфортом
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-gold/50 hover:shadow-[0_0_30px_rgba(212,165,32,0.1)]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10">
              <Gamepad2 className="h-6 w-6 text-gold" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">500+ Слотов</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Огромная коллекция слот-автоматов от лучших провайдеров с высоким RTP
            </p>
          </div>

          <div className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-gold/50 hover:shadow-[0_0_30px_rgba(212,165,32,0.1)]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10">
              <TrendingUp className="h-6 w-6 text-gold" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">Ставки Live</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Делайте ставки на спортивные события в реальном времени с лучшими коэффициентами
            </p>
          </div>

          <div className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-gold/50 hover:shadow-[0_0_30px_rgba(212,165,32,0.1)]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10">
              <Shield className="h-6 w-6 text-gold" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">Безопасность</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Шифрование данных и безопасные транзакции. Ваши средства под надежной защитой
            </p>
          </div>

          <div className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-gold/50 hover:shadow-[0_0_30px_rgba(212,165,32,0.1)]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10">
              <Zap className="h-6 w-6 text-gold" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">Быстрые выплаты</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Мгновенные депозиты и выводы средств на любой удобный способ оплаты
            </p>
          </div>
        </div>

        <div className="mt-20 grid items-center gap-12 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl">
            <Image
              src="/images/slot-machine.jpg"
              alt="Premium slot machines"
              width={600}
              height={400}
              className="h-auto w-full object-cover"
            />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gold/20" />
          </div>
          <div>
            <h3 id="slots" className="mb-4 font-[var(--font-playfair)] text-2xl font-bold text-foreground md:text-3xl">
              {"Лучшие "}
              <span className="text-gold">слот-автоматы</span>
            </h3>
            <p className="mb-6 leading-relaxed text-muted-foreground">
              Более 500 слот-игр от ведущих провайдеров. Классические фруктовые слоты,
              современные видео-слоты с бонусными раундами, прогрессивные джекпоты
              и многое другое. Каждый найдет игру по душе.
            </p>
            <ul className="space-y-3">
              {["RTP до 98%", "Бесплатные вращения", "Прогрессивные джекпоты", "Новые игры каждую неделю"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-foreground">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/20 text-xs text-gold">
                    {"✓"}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <h3 id="betting" className="mb-4 font-[var(--font-playfair)] text-2xl font-bold text-foreground md:text-3xl">
              {"Спортивные "}
              <span className="text-gold">ставки</span>
            </h3>
            <p className="mb-6 leading-relaxed text-muted-foreground">
              Делайте ставки на любимые спортивные события. Футбол, баскетбол, теннис,
              хоккей и многое другое. Live-ставки в реальном времени с мгновенным
              обновлением коэффициентов.
            </p>
            <ul className="space-y-3">
              {["Ставки в реальном времени", "Лучшие коэффициенты", "Широкая линия событий", "Быстрые расчеты"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-foreground">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/20 text-xs text-gold">
                    {"✓"}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative order-1 overflow-hidden rounded-2xl lg:order-2">
            <Image
              src="/images/betting.jpg"
              alt="Casino table with chips and cards"
              width={600}
              height={400}
              className="h-auto w-full object-cover"
            />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gold/20" />
          </div>
        </div>
      </div>
    </section>
  )
}
