import Signup from "../src/Signup";
import GetAccount from "../src/GetAccount";
import AccountDAODatabase from "../src/AccountDAODatabase";
import LoggerConsole from "../src/LoggerConsole";
import RequestRide from "../src/RequestRide";
import GetRide from "../src/GetRide";
import RideDAODatabase from "../src/RideDAODatabase";
import AcceptRide from "../src/AcceptRide";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;

beforeEach(() => {
  const accountDAO = new AccountDAODatabase();
  const logger = new LoggerConsole();
  const rideDAO = new RideDAODatabase();
  signup = new Signup(accountDAO, logger);
  getAccount = new GetAccount(accountDAO);
  requestRide = new RequestRide(rideDAO, accountDAO, logger);
  getRide = new GetRide(rideDAO, logger);
  acceptRide = new AcceptRide(rideDAO, accountDAO);
});

test("Deve aceitar uma corrida", async function () {
  const inputSignupPassenger = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };

  const outputSignupPassenger = await signup.execute(inputSignupPassenger);

  const inputRequestRide = {
    passengerId: outputSignupPassenger.accountId,
    fromLat: -23.55065,
    fromLong: -46.633382,
    toLat: -23.55065,
    toLong: -46.633382,
  };
  const outputRequestRide = await requestRide.execute(inputRequestRide);

  const inputSignupDriver = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isDriver: true,
    carPlate: "ABC1234",
    password: "123456",
  };
  const outputSignupDriver = await signup.execute(inputSignupDriver);
  const inputAcceptRide = {
    driverId: outputSignupDriver.accountId,
    rideId: outputRequestRide.rideId,
  };
  await acceptRide.execute(inputAcceptRide);
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.status).toBe("ACCEPTED");
  expect(outputGetRide.driver_id).toBe(outputSignupDriver.accountId);
});

test("Não pode aceitar uma corrida se a conta não for de um motorista", async function () {
  const inputSignupPassenger = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };

  const outputSignupPassenger = await signup.execute(inputSignupPassenger);

  const inputRequestRide = {
    passengerId: outputSignupPassenger.accountId,
    fromLat: -23.55065,
    fromLong: -46.633382,
    toLat: -23.55065,
    toLong: -46.633382,
  };
  const outputRequestRide = await requestRide.execute(inputRequestRide);

  const inputSignupDriver = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };
  const outputSignupDriver = await signup.execute(inputSignupDriver);
  const inputAcceptRide = {
    driverId: outputSignupDriver.accountId,
    rideId: outputRequestRide.rideId,
  };
  await expect(() => acceptRide.execute(inputAcceptRide)).rejects.toThrow(
    new Error("Only drivers can accept rides")
  );
});
