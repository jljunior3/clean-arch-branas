import Signup from "../src/Signup";
import GetAccount from "../src/GetAccount";
import sinon from "sinon";
import AccountRepositoryDatabase from "../src/AccountRepositoryDatabase";
import LoggerConsole from "../src/LoggerConsole";
import AccountRepository from "../src/AccountRepository";
import Logger from "../src/Logger";
import Account from "../src/Account";

let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
  const accountDAO = new AccountRepositoryDatabase();
  const logger = new LoggerConsole();
  signup = new Signup(accountDAO, logger);
  getAccount = new GetAccount(accountDAO);
});

test("Deve criar uma conta para o passageiro com stub", async function () {
  const stubAccountDAOSave = sinon
    .stub(AccountRepositoryDatabase.prototype, "save")
    .resolves();
  const stubAccountDAOGetByEmail = sinon
    .stub(AccountRepositoryDatabase.prototype, "getByEmail")
    .resolves(undefined);

  // given
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };
  // when
  const outputSignup = await signup.execute(inputSignup);
  expect(outputSignup.accountId).toBeDefined();
  const stubAccountDAOGetById = sinon
    .stub(AccountRepositoryDatabase.prototype, "getById")
    .resolves(
      Account.create(
        inputSignup.name,
        inputSignup.email,
        inputSignup.cpf,
        "",
        inputSignup.isPassenger,
        false
      )
    );
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  // then
  expect(outputGetAccount?.name).toBe(inputSignup.name);
  expect(outputGetAccount?.email).toBe(inputSignup.email);

  stubAccountDAOSave.restore();
  stubAccountDAOGetByEmail.restore();
  stubAccountDAOGetById.restore();
});

test("Deve criar uma conta para o passageiro com mock", async function () {
  const mockLogger = sinon.mock(LoggerConsole.prototype);
  mockLogger.expects("log").withArgs("signup John Doe").once();
  // given
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };
  // when
  const outputSignup = await signup.execute(inputSignup);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  // then
  expect(outputGetAccount?.name).toBe(inputSignup.name);
  expect(outputGetAccount?.email).toBe(inputSignup.email);
  mockLogger.verify();
});

test("Não deve criar uma conta se o nome for inválido", async function () {
  // given
  const inputSignup = {
    name: "John",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };
  // when
  await expect(() => signup.execute(inputSignup)).rejects.toThrow(
    new Error("Invalid name")
  );
});

test("Não deve criar uma conta se o email for inválido", async function () {
  // given
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };
  // when
  await expect(() => signup.execute(inputSignup)).rejects.toThrow(
    new Error("Invalid email")
  );
});

test.each(["", undefined, null, "11111111111", "111", "11111111111111"])(
  "Não deve criar uma conta se o cpf for inválido",
  async function (cpf: any) {
    // given
    const inputSignup = {
      name: "John Doe",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf,
      isPassenger: true,
      password: "123456",
    };
    // when
    await expect(() => signup.execute(inputSignup)).rejects.toThrow(
      new Error("Invalid cpf")
    );
  }
);

test("Não deve criar uma conta se o email for duplicado", async function () {
  // given
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };
  // when
  await signup.execute(inputSignup);
  await expect(() => signup.execute(inputSignup)).rejects.toThrow(
    new Error("Duplicated account")
  );
});

test("Deve criar uma conta para o motorista", async function () {
  const spyLoggerLog = sinon.spy(LoggerConsole.prototype, "log");
  // given
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    carPlate: "AAA9999",
    isPassenger: false,
    isDriver: true,
    password: "123456",
  };
  // when
  const outputSignup = await signup.execute(inputSignup);
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  // then
  expect(outputSignup.accountId).toBeDefined();
  expect(outputGetAccount?.name).toBe(inputSignup.name);
  expect(outputGetAccount?.email).toBe(inputSignup.email);
  expect(spyLoggerLog.calledOnce).toBeTruthy();
  expect(spyLoggerLog.calledWith("signup John Doe")).toBeTruthy();
});

test("Não deve criar uma conta para o motorista com a placa inválida", async function () {
  // given
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    carPlate: "AAA999",
    isPassenger: false,
    isDriver: true,
    password: "123456",
  };
  // when
  await expect(() => signup.execute(inputSignup)).rejects.toThrow(
    new Error("Invalid car plate")
  );
});

test("Deve criar uma conta para o passageiro com fake", async function () {
  // given
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };

  const accountDAO: AccountRepository = {
    save: async (input: any) => {
      return input;
    },
    getByEmail: async (email: string) => {
      return undefined;
    },
    getById: async (id: string): Promise<Account | undefined> => {
      return Account.create(
        inputSignup.name,
        inputSignup.email,
        inputSignup.cpf,
        "",
        inputSignup.isPassenger,
        false
      );
    },
  };
  const logger: Logger = {
    log: (message: string) => {},
  };
  // when
  const signup = new Signup(accountDAO, logger);
  const getAccount = new GetAccount(accountDAO);
  const outputSignup = await signup.execute(inputSignup);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  // then
  expect(outputGetAccount?.name).toBe(inputSignup.name);
  expect(outputGetAccount?.email).toBe(inputSignup.email);
});
