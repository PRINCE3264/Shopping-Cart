const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function seed() {
    try {
        const productsData = JSON.parse(fs.readFileSync('./products.json', 'utf8'));
        console.log(`Found ${productsData.length} products to seed.`);

        for (const p of productsData) {
            const slug = p.name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(2, 7);

            await prisma.product.upsert({
                where: { slug: slug }, // Using unique slug for upsert
                update: {},
                create: {
                    name: p.name,
                    slug: slug,
                    description: p.description,
                    price: p.price,
                    stock: p.stock,
                    category: p.category,
                    rating: p.rating,
                    images: p.images,
                },
            });
            console.log(`Seeded: ${p.name}`);
        }

        console.log('Seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding products:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
