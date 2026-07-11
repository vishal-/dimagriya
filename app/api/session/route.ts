import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import logger from '../../../lib/logger';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, avatar } = body;

    logger.info({ name, avatar }, 'Creating user and session');

    // Attempt database operations using Prisma client with PG adapter
    const user = await prisma.user.create({
      data: {
        name: name || 'Little Explorer',
        avatar: avatar || '🚀',
      },
    });

    const session = await prisma.gameSession.create({
      data: {
        userId: user.id,
        gameType: 'memory-match',
        score: 120,
        duration: 45,
      },
    });

    logger.info({ userId: user.id, sessionId: session.id }, 'User and session created successfully');

    return NextResponse.json({
      success: true,
      user,
      session,
    });
  } catch (error: any) {
    // Log the error details with pino
    logger.error({ err: error }, 'Failed database operation in session API route');
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Database operation failed',
        details: 'Check if PostgreSQL server is running and migrations have been applied.',
      },
      { status: 500 }
    );
  }
}
