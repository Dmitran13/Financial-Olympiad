import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ─── Business Templates ──────────────────────────────────────────────────

  await prisma.businessTemplate.upsert({
    where: { slug: "shop" },
    update: {},
    create: {
      slug: "shop",
      name: "Магазин",
      description: "Небольшой продуктовый магазин в спальном районе",
      emoji: "🛒",
      config: {
        startCash: 50000,
        startStaff: 3,
        fixedCosts: 15000,
        staffCostPerUnit: 25000,
        cogsRatio: 0.45,
        baseCustomers: 200,
        priceRange: [50, 300],
        adRange: [0, 30000],
        marketPrice: 150,
      },
    },
  });

  await prisma.businessTemplate.upsert({
    where: { slug: "cafe" },
    update: {},
    create: {
      slug: "cafe",
      name: "Кафе",
      description: "Уютное кафе рядом со школой",
      emoji: "☕",
      config: {
        startCash: 60000,
        startStaff: 4,
        fixedCosts: 20000,
        staffCostPerUnit: 28000,
        cogsRatio: 0.35,
        baseCustomers: 150,
        priceRange: [100, 500],
        adRange: [0, 25000],
        marketPrice: 250,
      },
    },
  });

  // ─── Game Events ─────────────────────────────────────────────────────────

  const events = [
    // JUNIOR — простые события
    {
      slug: "summer_sale",
      name: "Летний сезон",
      description: "Лето! Больше людей на улицах — клиентов стало на 20% больше.",
      type: "SEASONAL" as const,
      effectConfig: { customerMultiplier: 1.2, description: "Летний наплыв покупателей увеличил выручку." },
      probability: 0.4,
      minAgeGroup: "JUNIOR" as const,
      turnRange: [1, 3],
    },
    {
      slug: "holiday_boost",
      name: "Праздники",
      description: "Новогодние праздники — люди активно делают покупки.",
      type: "HOLIDAY" as const,
      effectConfig: { revenueMultiplier: 1.3, description: "Праздничный спрос поднял выручку на 30%." },
      probability: 0.35,
      minAgeGroup: "JUNIOR" as const,
      turnRange: [5, 6],
    },
    {
      slug: "bad_weather",
      name: "Плохая погода",
      description: "Дожди и холода — покупатели сидят дома.",
      type: "SEASONAL" as const,
      effectConfig: { customerMultiplier: 0.7, description: "Плохая погода снизила поток клиентов на 30%." },
      probability: 0.3,
      minAgeGroup: "JUNIOR" as const,
    },
    // MIDDLE — сложнее
    {
      slug: "competitor_opens",
      name: "Конкурент открылся",
      description: "Рядом открылся новый магазин — часть клиентов ушла к ним.",
      type: "COMPETITOR" as const,
      effectConfig: {
        customerMultiplier: 0.8,
        satisfactionDelta: -5,
        description: "Конкурент забрал 20% ваших клиентов. Подумайте о снижении цены или усилении рекламы.",
      },
      probability: 0.25,
      minAgeGroup: "MIDDLE" as const,
      turnRange: [2, 5],
    },
    {
      slug: "supplier_crisis",
      name: "Кризис поставок",
      description: "Поставщики подняли цены — себестоимость выросла.",
      type: "CRISIS" as const,
      effectConfig: { costDelta: 8000, description: "Кризис поставок добавил 8 000 ₽ к расходам." },
      probability: 0.2,
      minAgeGroup: "MIDDLE" as const,
    },
    {
      slug: "good_review",
      name: "Вирусный отзыв",
      description: "Довольный клиент написал хвалебный пост — о вас узнали новые люди.",
      type: "OPPORTUNITY" as const,
      effectConfig: {
        customerMultiplier: 1.25,
        satisfactionDelta: 10,
        description: "Вирусный отзыв привлёк 25% новых клиентов и поднял лояльность.",
      },
      probability: 0.2,
      minAgeGroup: "MIDDLE" as const,
    },
    // SENIOR — реалистичные
    {
      slug: "economic_crisis",
      name: "Экономический кризис",
      description: "Кризис — покупатели экономят, спрос падает.",
      type: "CRISIS" as const,
      effectConfig: {
        customerMultiplier: 0.6,
        revenueMultiplier: 0.85,
        satisfactionDelta: -10,
        description: "Экономический кризис резко снизил покупательную способность. Оптимизируйте расходы.",
      },
      probability: 0.15,
      minAgeGroup: "SENIOR" as const,
      turnRange: [3, 5],
    },
    {
      slug: "competitor_closes",
      name: "Конкурент закрылся",
      description: "Ближайший конкурент не пережил кризис — его клиенты идут к вам.",
      type: "COMPETITOR" as const,
      effectConfig: {
        customerMultiplier: 1.35,
        description: "Банкротство конкурента привело к вам 35% новых клиентов.",
      },
      probability: 0.2,
      minAgeGroup: "SENIOR" as const,
      turnRange: [4, 6],
    },
  ];

  for (const event of events) {
    await prisma.gameEvent.upsert({
      where: { slug: event.slug },
      update: {},
      create: event,
    });
  }

  console.log("✅ Seed завершён: 2 шаблона, ", events.length, " событий");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
