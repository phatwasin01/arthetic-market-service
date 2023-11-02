import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Define some categories related to arts
  const categories = [
    { name: "General" },
    { name: "Painting" },
    { name: "Accessories" },
    { name: "Embroidery" },
    { name: "Paintings" },
    { name: "Sculptures" },
    { name: "Photography" },
    { name: "Drawings" },
    { name: "Printmaking" },
    { name: "Digital Art" },
    { name: "Mixed Media" },
    { name: "Ceramics" },
    { name: "Folk Art" },
    { name: "Architecture" },
    { name: "Conceptual Art" },
    { name: "Graphic Design" },
    { name: "Illustrations" },
    { name: "Textiles" },
    { name: "Jewelry" },
    { name: "Candles" },
    { name: "Pottery" },
  ];
  console.log(`Checking if there are any categories ...`);
  const check = await prisma.category.findFirst();
  if (check) {
    console.log("Categories already exist. Skipping seeding.");
    return;
  }

  console.log("Start seeding ...");

  for (const category of categories) {
    const createdCategory = await prisma.category.create({
      data: category,
    });
    console.log(`Created category with id: ${createdCategory.id}`);
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
