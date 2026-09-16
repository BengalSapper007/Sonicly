import { Injectable, NotFoundException } from '@nestjs/common';
import { IsOptional, IsString, MaxLength, Matches } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  displayName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @Matches(/^(https?:\/\/|\/)/, {
    message: 'imageUrl must be a valid HTTP/HTTPS URL or relative path',
  })
  imageUrl?: string;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        imageUrl: true,
        createdAt: true,
        _count: {
          select: {
            likes: true,
            follows: true,
            playlists: true,
          },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        imageUrl: true,
        createdAt: true,
      },
    });
  }
}
