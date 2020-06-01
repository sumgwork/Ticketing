import bcrypt from "bcrypt";
const SALT_ROUNDS: number = 10;

export class Password {
  static async toHash(password: string): string {
    const hashed: string = await bcrypt.hash(password, SALT_ROUNDS);
    return hashed;
  }

  static async compare(
    storedPassword: string,
    suppliedPassword: string
  ): boolean {
    const match: boolean = await bcrypt.compare(
      suppliedPassword,
      storedPassword
    );
    return match;
  }
}
