import { UserType } from '@prisma/client';

export interface IUser {
  id: string;
  fullName?: string;
  email: string;
  password: string;
  googleID?: string;
  phoneNumber?: string;
  city?: string;
  country?: string;
  avatarURL?: string;
  userType: UserType;
  siteAdmin: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
