import { validateCpf } from "../src/CpfValidator";

test.each(["97456321558", "71428793860", "87748248800"])(
  "Deve testar cpfs validos",
  (cpf: string) => {
    expect(validateCpf(cpf)).toBe(true);
  }
);

test.each(["", undefined, null, "11111111111", "111", "11111111111111"])(
  "Deve testar cpfs invalidos",
  (cpf: any) => {
    expect(validateCpf(cpf)).toBe(false);
  }
);
