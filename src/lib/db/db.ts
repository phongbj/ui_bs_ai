'use server'

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


const basicInfo = async (userId: string) => {
    const user = await prisma.serviceUser.findUnique({
        where: {
            userId: userId
        },
        select: {
            credits: {
                select: {
                    balance: true
                }
            }
        }
    });
    return user;
}


export { basicInfo };