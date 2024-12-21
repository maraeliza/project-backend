const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{4,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


const isValidCNPJ = (cnpj:string):boolean => {
  // Remove caracteres não numéricos
  cnpj = cnpj.replace(/[^\d]+/g, "");

  // Verifica se possui 14 dígitos e não é uma sequência repetida
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) {
    return false;
  }

  const calculateDigit = (base:string) => {
    let weight =
      base.length === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = base
      .split("")
      .reduce((acc, num, idx):number => acc + Number(num) * weight[idx], 0);
    let remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  // Calcula os dois dígitos verificadores
  const base = cnpj.slice(0, 12);
  const firstDigit = calculateDigit(base);
  const secondDigit = calculateDigit(base + firstDigit);

  // Verifica se os dígitos calculados batem com os do CNPJ
  return cnpj === base + firstDigit + secondDigit;
};

const isValidCPF = (cpf:string):boolean => {
  cpf = cpf.replace(/\D/g, ""); // Remove caracteres não numéricos
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false; // Verifica se o CPF tem 11 dígitos e se não é repetido (e.g., "111.111.111-11")
  }

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf.charAt(10));
};

const isValidEmail = (email:string):boolean => {
  return EMAIL_REGEX.test(email);
};

const isValidSenha = (senha:string):boolean => {
  return PWD_REGEX.test(senha);
};

module.exports = { isValidCNPJ, isValidCPF, isValidEmail, isValidSenha };
