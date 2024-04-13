import Signup from "../src/Signup";
import GetAccount from "../src/GetAccount";
import AccountDAODatabase from "../src/AccountDAODatabase";
import LoggerConsole from "../src/LoggerConsole";
import RequestRide from "../src/RequestRide";
import GetRide from "../src/GetRide";
import RideDAODatabase from "../src/RideDAODatabase";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;

beforeEach(() => {
  const accountDAO = new AccountDAODatabase();
  const logger = new LoggerConsole();
  const rideDAO = new RideDAODatabase();
  signup = new Signup(accountDAO, logger);
  getAccount = new GetAccount(accountDAO);
  requestRide = new RequestRide(rideDAO, accountDAO, logger);
  getRide = new GetRide(rideDAO, logger);
});

test("Deve solicitar uma corrida", async function () {
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
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -23.55065,
    fromLong: -46.633382,
    toLat: -23.55065,
    toLong: -46.633382,
  };
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  expect(outputRequestRide.rideId).toBeDefined();
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.status).toBe("REQUESTED");
});

test("Não deve solicitar uma corrida se a conta não existir", async function () {
  const inputRequestRide = {
    passengerId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    fromLat: -23.55065,
    fromLong: -46.633382,
    toLat: -23.55065,
    toLong: -46.633382,
  };

  await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(
    new Error("Account does not exist")
  );
});

test("Não deve poder solicitar uma corrida se a conta não for de um passageiro", async function () {
  // given
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: false,
    isDriver: true,
    carPlate: "AAA9999",
    password: "123456",
  };
  // when
  const outputSignup = await signup.execute(inputSignup);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -23.55065,
    fromLong: -46.633382,
    toLat: -23.55065,
    toLong: -46.633382,
  };
  await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(
    new Error("Only passengers can request a ride")
  );
});

test("Não deve poder solicitar uma corrrida se o passageiro já estiver em outra corrida", async function () {
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
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -23.55065,
    fromLong: -46.633382,
    toLat: -23.55065,
    toLong: -46.633382,
  };
  await requestRide.execute(inputRequestRide);
  await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(
    "Passenger has an active ride"
  );
});
