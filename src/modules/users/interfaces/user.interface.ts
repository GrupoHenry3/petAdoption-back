import { ERole } from "../enum/role.enum";

interface IUser {
  id: number;
  username: string;
  passwordHash: string;
  phoneNumber?: string | null;  // <-- aceptar null
  name?: string | null;
  email: string;
  role: ERole;
  city?: string | null;
  country?: string | null;
  address?: string | null;
  avatarURL?: string | null;
  googleID?: string | null;
}

export default IUser;










// import { ERole } from "../enum/role.enum";

// interface IUser {
//   id: number,
//   name: string,
//   email: string,
//   userName: string,
//   password: string,
//   phone: string,
//   address: string,
//   city?: string | undefined,
//   country?: string | undefined,
//   createdAt: Date,
//   role: ERole,
// };

// export default IUser;