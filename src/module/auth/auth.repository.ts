import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, RoleName } from '../../../generated/prisma/client';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
  }

  async findUserByIdentifier(identifier: string) {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
      include: {
        role: true,
      },
    });
  }

  async findRoleByName(name: RoleName) {
    return this.prisma.role.findUnique({
      where: { name },
    });
  }

  async createUserWithProfile(userData: Prisma.UserUncheckedCreateInput) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: userData,
        include: {
          role: true,
        },
      });

      await tx.profile.create({
        data: {
          userId: user.id,
        },
      });

      return user;
    });
  }

  // --- Verification Methods ---

  async upsertVerification(data: {
    email: string;
    username: string;
    passwordHash: string;
    code: string;
    codeExpiresAt: Date;
    sessionExpiresAt: Date;
  }) {
    return this.prisma.registerVerification.upsert({
      where: { email: data.email },
      update: data,
      create: data,
    });
  }

  async findVerificationByEmail(email: string) {
    return this.prisma.registerVerification.findUnique({
      where: { email },
    });
  }

  async deleteVerification(email: string) {
    return this.prisma.registerVerification.delete({
      where: { email },
    });
  }

  async deleteExpiredSessions(now: Date) {
    return this.prisma.registerVerification.deleteMany({
      where: {
        sessionExpiresAt: {
          lt: now,
        },
      },
    });
  }

  async updateUserPassword(userId: string, passwordHash: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }
}
