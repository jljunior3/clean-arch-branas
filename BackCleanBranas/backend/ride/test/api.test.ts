import axios from "axios";

// test.only("Deve testar o signup pela API", async function () {
//   //const response = await axios.post("http://localhost:3000/signup");
// });

axios.defaults.validateStatus = () => true;

test("Deve criar uma conta para o passageiro pela API", async function () {
  // given
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };
  // when
  const responseSignup = await axios.post(
    "http://localhost:3000/signup",
    inputSignup
  );
  const outputSignup = responseSignup.data;
  const responseGetAccount = await axios.get(
    `http://localhost:3000/accounts/${outputSignup.accountId}`
  );
  const outputGetAccount = responseGetAccount.data;
  // then
  expect(outputSignup.accountId).toBeDefined();
  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
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
  const responseSignup = await axios.post(
    "http://localhost:3000/signup",
    inputSignup
  );
  expect(responseSignup.status).toBe(422);
  expect(responseSignup.data.message).toBe("Invalid name");
});

test("Deve criar uma conta para o motorista", async function () {
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
  const outputSignup = await axios.post(
    "http://localhost:3000/signup",
    inputSignup
  );
  const outputGetAccount = await axios.get(
    `http://localhost:3000/accounts/${outputSignup.data.accountId}`
  );
  // then
  expect(outputSignup.data.accountId).toBeDefined();
  expect(outputGetAccount.data.name).toBe(inputSignup.name);
  expect(outputGetAccount.data.email).toBe(inputSignup.email);
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
  const responseSignup = await axios.post(
    "http://localhost:3000/signup",
    inputSignup
  );
  expect(responseSignup.status).toBe(422);
  expect(responseSignup.data.message).toBe("Invalid car plate");
});
