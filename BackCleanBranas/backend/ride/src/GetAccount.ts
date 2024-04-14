import AccountRepository from "./AccountRepository";
import Account from "./Account";

export default class GetAccount {
  constructor(private accountDAO: AccountRepository) {}

  async execute(accountId: string): Promise<Account | undefined> {
    return await this.accountDAO.getById(accountId);
  }
}
