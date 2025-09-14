export class ResponseUserAdminDto {
  id: number;
  name: string;
  email: string;
  userName: string;
  phone: string;
  address: string;
  city?: string | undefined;
  country?: string | undefined;
  role: string;
  createdAt: string;

  constructor(partial: Partial<ResponseUserAdminDto>) {
    const { id, name, email, userName, phone, address, city, country, role, createdAt } = partial;
    this.id = id!;
    this.name = name!;
    this.email = email!;
    this.userName = userName!;
    this.address = address!;
    this.phone = phone!;
    this.country = country;
    this.city = city;
    this.role = role!;
    this.createdAt = createdAt!;
  };
};