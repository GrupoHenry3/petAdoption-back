export class ResponseUserDto {
  id: string;
  fullName?: string | null;
  email: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  avatarURL?: string | null;
  createdAt: Date;

  constructor(partial: Partial<ResponseUserDto>) {
    const { id, fullName, email, phone, address, city, country, avatarURL, createdAt } = partial;
    this.id = id!;
    this.fullName = fullName!;
    this.email = email!;
    this.phone = phone;
    this.address = address!;
    this.city = city;
    this.country = country;
    this.avatarURL = avatarURL!;
    this.createdAt = createdAt!;
  };
};