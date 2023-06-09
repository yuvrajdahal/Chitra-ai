import "next-auth";

declare module "next-auth" {
  // interface AdapterUser {
  //   id: string;
  //   credit: number;
  //   email: string | null;
  //   password?: string;
  //   createdAt: Date;
  //   updatedAt: Date;
  // }
  interface User {
    id: string;
    credit: number;
    email: string | null;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
    timeout: Data | null;
  }
  interface Session {
    user: {
      id: string;
      credit: number;
      email: string | null;
      createdAt: Date;
      updatedAt: Date;
      timeout: Data | null;
    };
    expires: ISODateString;
  }
}
