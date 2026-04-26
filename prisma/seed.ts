import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const databaseUrl = process.env.DATABASE_URL!;
const prisma = new PrismaClient({ adapter: new PrismaPg(databaseUrl) });

async function main() {
  // ─── Business Templates ──────────────────────────────────────────────────

  const shopConfig = {
    startCash: 50000,
    startStaff: 3,
    fixedCosts: 15000,
    staffCostPerUnit: 6000,
    cogsRatio: 0.42,
    baseCustomers: 600,
    priceRange: [50, 300],
    adRange: [0, 30000],
    marketPrice: 150,
  };
  await prisma.businessTemplate.upsert({
    where: { slug: "shop" },
    update: { config: shopConfig },
    create: {
      slug: "shop",
      name: "Магазин",
      description: "Небольшой продуктовый магазин в спальном районе",
      emoji: "🛒",
      config: shopConfig,
    },
  });

  const cafeConfig = {
    startCash: 60000,
    startStaff: 4,
    fixedCosts: 20000,
    staffCostPerUnit: 7000,
    cogsRatio: 0.35,
    baseCustomers: 500,
    priceRange: [100, 500],
    adRange: [0, 25000],
    marketPrice: 250,
  };
  await prisma.businessTemplate.upsert({
    where: { slug: "cafe" },
    update: { config: cafeConfig },
    create: {
      slug: "cafe",
      name: "Кафе",
      description: "Уютное кафе рядом со школой",
      emoji: "☕",
      config: cafeConfig,
    },
  });

  const bakeryConfig = {
    startCash: 45000,
    startStaff: 2,
    fixedCosts: 10000,
    staffCostPerUnit: 5000,
    cogsRatio: 0.30,
    baseCustomers: 500,
    priceRange: [50, 250],
    adRange: [0, 20000],
    marketPrice: 120,
  };
  await prisma.businessTemplate.upsert({
    where: { slug: "bakery" },
    update: { config: bakeryConfig },
    create: {
      slug: "bakery",
      name: "Пекарня",
      description: "Мини-пекарня с домашней выпечкой у метро",
      emoji: "🥐",
      config: bakeryConfig,
    },
  });

  const barberConfig = {
    startCash: 40000,
    startStaff: 2,
    fixedCosts: 18000,
    staffCostPerUnit: 8000,
    cogsRatio: 0.10,
    baseCustomers: 80,
    priceRange: [400, 2000],
    adRange: [0, 20000],
    marketPrice: 800,
  };
  await prisma.businessTemplate.upsert({
    where: { slug: "barber" },
    update: { config: barberConfig },
    create: {
      slug: "barber",
      name: "Барбершоп",
      description: "Стильная мужская парикмахерская в центре",
      emoji: "✂️",
      config: barberConfig,
    },
  });

  const onlineConfig = {
    startCash: 30000,
    startStaff: 1,
    fixedCosts: 5000,
    staffCostPerUnit: 10000,
    cogsRatio: 0.50,
    baseCustomers: 400,
    priceRange: [100, 500],
    adRange: [0, 40000],
    marketPrice: 200,
  };
  await prisma.businessTemplate.upsert({
    where: { slug: "online" },
    update: { config: onlineConfig },
    create: {
      slug: "online",
      name: "Онлайн-магазин",
      description: "Интернет-магазин товаров для школьников",
      emoji: "💻",
      config: onlineConfig,
    },
  });

  const sportsConfig = {
    startCash: 70000,
    startStaff: 3,
    fixedCosts: 25000,
    staffCostPerUnit: 12000,
    cogsRatio: 0.05,
    baseCustomers: 60,
    priceRange: [1000, 5000],
    adRange: [0, 30000],
    marketPrice: 2500,
    priceLabel: "Цена абонемента",
    adLabel: "Продвижение",
  };
  await prisma.businessTemplate.upsert({
    where: { slug: "sports_school" },
    update: { config: sportsConfig },
    create: {
      slug: "sports_school",
      name: "Спортивная школа",
      description: "Секции футбола, баскетбола и плавания для детей",
      emoji: "⚽",
      config: sportsConfig,
    },
  });

  const itSchoolConfig = {
    startCash: 60000,
    startStaff: 3,
    fixedCosts: 25000,
    staffCostPerUnit: 15000,
    cogsRatio: 0.05,
    baseCustomers: 30,
    priceRange: [2000, 12000],
    adRange: [0, 40000],
    marketPrice: 5000,
    priceLabel: "Стоимость курса",
    adLabel: "Маркетинг",
  };
  await prisma.businessTemplate.upsert({
    where: { slug: "it_school" },
    update: { config: itSchoolConfig },
    create: {
      slug: "it_school",
      name: "IT-школа",
      description: "Курсы программирования и робототехники для школьников",
      emoji: "🖥️",
      config: itSchoolConfig,
    },
  });

  const restaurantConfig = {
    startCash: 80000,
    startStaff: 5,
    fixedCosts: 30000,
    staffCostPerUnit: 8000,
    cogsRatio: 0.38,
    baseCustomers: 400,
    priceRange: [300, 1500],
    adRange: [0, 35000],
    marketPrice: 600,
    priceLabel: "Средний чек",
    adLabel: "Реклама",
  };
  await prisma.businessTemplate.upsert({
    where: { slug: "restaurant" },
    update: { config: restaurantConfig },
    create: {
      slug: "restaurant",
      name: "Ресторан",
      description: "Авторский ресторан с уникальным меню",
      emoji: "🍽️",
      config: restaurantConfig,
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

  console.log("✅ Seed завершён: 8 шаблонов,", events.length, "событий");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
