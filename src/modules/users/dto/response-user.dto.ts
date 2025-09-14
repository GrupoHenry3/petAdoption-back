export class ResponseUserDto {
  id: number;
  name: string;
  email: string;
  userName: string;
  phone: string;
  address: string;
  city?: string | undefined;
  country?: string | undefined;
  createdAt: string;

  constructor(partial: Partial<ResponseUserDto>) {
    const { id, name, email, userName, phone, address, city, country, createdAt } = partial;
    this.id = id!;
    this.name = name!;
    this.email = email!;
    this.userName = userName!;
    this.address = address!;
    this.phone = phone!;
    this.country = country;
    this.city = city;
    this.createdAt = createdAt!;
  };
};