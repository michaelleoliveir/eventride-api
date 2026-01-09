import { prisma } from "./lib/prisma";

async function main() {
    await prisma.$connect()
    console.log("Prisma connected")

    const users = await prisma.user.findMany();
    console.log(users)
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect()
    })