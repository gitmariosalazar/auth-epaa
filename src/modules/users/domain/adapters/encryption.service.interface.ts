export interface IEncryptionService {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}
