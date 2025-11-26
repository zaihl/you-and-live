import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { MAX_FREE_COUNTS, MAX_GUEST_COUNTS } from "@/contants";
import { cookies } from "next/headers";

// Helper to distinguish between Clerk User and Guest
const getIdentifier = () => {
    const { userId } = auth();
    if (userId) return { userId, isGuest: false };

    // Fallback to guest cookie
    const guestId = cookies().get("guest_id")?.value;
    if (guestId) return { userId: `guest_${guestId}`, isGuest: true };

    return { userId: null, isGuest: true };
};

export const increaseApiLimit = async () => {
    const { userId } = getIdentifier();

    if (!userId) return;

    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where: { userId }
    });

    if (userApiLimit) {
        await prismadb.userApiLimit.update({
            where: { userId },
            data: { count: userApiLimit.count + 1 }
        });
    } else {
        await prismadb.userApiLimit.create({
            data: { userId: userId, count: 1 }
        });
    }
};

export const checkApiLimit = async () => {
    const { userId, isGuest } = getIdentifier();

    if (!userId) return false;

    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where: { userId }
    });

    const limit = isGuest ? MAX_GUEST_COUNTS : MAX_FREE_COUNTS;

    if (!userApiLimit || userApiLimit.count < limit) {
        return true;
    } else {
        return false;
    }
};

export const getApiLimitCount = async () => {
    const { userId } = getIdentifier();
    if (!userId) return 0;

    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where: { userId }
    });

    return userApiLimit?.count || 0;
};