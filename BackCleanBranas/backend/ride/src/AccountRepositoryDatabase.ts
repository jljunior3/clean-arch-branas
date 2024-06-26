import pgp from "pg-promise";
import AccountRepository from "./AccountRepository";
import Account from "./Account";

export default class AccountRepositoryDatabase implements AccountRepository {
  async save(account: Account) {
    const connection = pgp()(
      "postgres://postgres:password@localhost:5432/postgres"
    );
    await connection.query(
      "insert into public.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2," +
        " $3," +
        " $4, $5, $6, $7)",
      [
        account.accountId,
        account.name,
        account.email,
        account.cpf,
        account.carPlate,
        !!account.isPassenger,
        !!account.isDriver,
      ]
    );
    await connection.$pool.end();
  }

  async getById(accountId: string): Promise<Account | undefined> {
    const connection = pgp()(
      "postgres://postgres:password@localhost:5432/postgres"
    );
    const [account] = await connection.query(
      "select * from public.account where account_id = $1",
      [accountId]
    );
    await connection.$pool.end();
    if (!account) return undefined;
    return Account.restore(
      account.account_id,
      account.name,
      account.email,
      account.cpf,
      account.car_plate,
      account.is_passenger,
      account.is_driver
    );
  }

  async getByEmail(email: string): Promise<Account | undefined> {
    const connection = pgp()(
      "postgres://postgres:password@localhost:5432/postgres"
    );
    const [account] = await connection.query(
      "select * from public.account where email = $1",
      [email]
    );
    await connection.$pool.end();
    if (!account) return undefined;
    return Account.restore(
      account.account_id,
      account.name,
      account.email,
      account.cpf,
      account.car_plate,
      account.is_passenger,
      account.is_driver
    );
  }
}
