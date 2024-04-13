import AccountDAODatabase from "./AccountDAODatabase";
import AccountDAO from "./AccountDAO";

export default class GetAccount {
  constructor(private accountDAO: AccountDAO) {}

  async execute(accountId: string) {
    return await this.accountDAO.getById(accountId);
  }
}
