import Logger from "./LoggerConsole";
import AccountRepository from "./AccountRepository";
import Account from "./Account";

export default class Signup {
  constructor(
    private accountDAO: AccountRepository,
    private logger: Logger
  ) {}
  async execute(input: any) {
    this.logger.log(`signup ${input.name}`);
    const existAccount = await this.accountDAO.getByEmail(input.email);
    if (existAccount) throw new Error("Duplicated account");
    const account = Account.create(
      input.name,
      input.email,
      input.cpf,
      input.carPlate,
      input.isPassenger,
      input.isDriver
    );
    await this.accountDAO.save(account);
    return {
      accountId: account.accountId,
    };
  }
}
