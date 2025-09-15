export class ResponseUserAdminDto {
  id: string;
  fullName?: string | null;
  email: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  avatarURL?: string | null;
  siteAdmin: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  constructor(partial: Partial<ResponseUserAdminDto>) {
    const { id, fullName, email, phone, address, city, country, avatarURL, siteAdmin, isActive, createdAt, updatedAt } = partial;
    this.id = id!;
    this.fullName = fullName;
    this.email = email!;
    this.phone = phone;
    this.address = address;
    this.city = city;
    this.country = country;
    this.avatarURL = avatarURL;
    this.siteAdmin = siteAdmin!;
    this.isActive = isActive!;
    this.createdAt = createdAt!;
    this.updatedAt = updatedAt!;
  };
};