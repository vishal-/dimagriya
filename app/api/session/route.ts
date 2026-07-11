import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import logger from '../../../lib/logger';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, avatar, userId } = body;

    logger.info({ name, avatar, userId }, 'Processing user session request');

    let user;

    if (userId) {
      try {
        user = await prisma.user.findUnique({
          where: { id: userId },
        });
      } catch (e) {
        // Suppress and fall back
      }
    }

    if (!user && name) {
      try {
        // Find the user by name to maintain profile persistence in the demo
        user = await prisma.user.findFirst({
          where: { name: name },
        });
      } catch (e) {
        // Suppress and fall back
      }
    }

    if (user) {
      // Update existing user profile details
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: name || user.name,
          avatar: avatar || user.avatar,
        },
      });
      logger.info({ userId: user.id }, 'Existing user profile updated');
    } else {
      // Create a brand new user profile
      user = await prisma.user.create({
        data: {
          name: name || 'Pavi',
          avatar: avatar || 'rocket',
        },
      });
      logger.info({ userId: user.id }, 'New user profile created');
    }

    // Log the game activity session
    const session = await prisma.gameSession.create({
      data: {
        userId: user.id,
        gameType: 'brain-gym-adventure',
        score: Math.floor(Math.random() * 50) + 100, // Dynamic score
        duration: Math.floor(Math.random() * 20) + 40, // Dynamic duration in seconds
      },
    });

    logger.info({ userId: user.id, sessionId: session.id }, 'GameSession created successfully');

    return NextResponse.json({
      success: true,
      user,
      session,
    });
  } catch (error: any) {
    logger.error({ err: error }, 'Failed database operations in session API route');
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Database operation failed',
        details: 'Check if PostgreSQL server is running and schema migrations are applied.',
      },
      { status: 500 }
    );
  }
}
