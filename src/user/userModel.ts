const validate = require("../validation/validate");
import UserRepository, { UserRepositoryInterface } from "./userRepository";

export type UserInterface = User;

export type UserAuth = {
  senha: string;
  cpf: number;
  cnpj: number;
};
export default class User {
  private nome: string = "";
  private email: string = "";
  private senha: string = "";
  private cpf: number = 0;
  private cnpj: number = 0;
  public repository: UserRepositoryInterface;

  constructor({ nome, email, senha, cpf, cnpj }: UserInterface) {
    this.setNome(nome);
    this.setEmail(email);

    this.setCpf(String(cpf));
    this.setCnpj(String(cnpj));
    this.setSenha(senha);
    this.repository = new UserRepository();
  }

  public static async authUser(obj: UserAuth): Promise<boolean> {
    if (
      obj == null ||
      !obj.cnpj ||
      !obj.cpf ||
      !obj.senha ||
      !validate.isValidSenha(String(obj.senha)) ||
      !validate.isValidCNPJ(String(obj.cnpj)) ||
      !validate.isValidCPF(String(obj.cpf))
    ) {
      return await false;
    }
    return await new UserRepository().findUser(obj);
  }
  async register(): Promise<boolean> {
    if (this.repository != null) {
      return await this.repository.insertUserBanco(this);
    }

    return true;
  }

  public getNome(): string {
    return this.nome;
  }

  public setNome(nome: string): void {
    if (nome.trim().length === 0) {
      throw new Error("Nome não pode ser vazio.");
    }
    this.nome = nome;
  }

  public getEmail(): string {
    return this.email;
  }

  public setEmail(email: string): void {
    if (email && !validate.isValidEmail(email)) {
      throw new Error("E-mail inválido.");
    }
    this.email = email;
  }

  public getSenha(): string {
    return this.senha;
  }

  public setSenha(senha: string): void {
    console.log(senha);
    if (senha && !validate.isValidSenha(senha)) {
      throw new Error("Senha inválida");
    }
    this.senha = senha;
  }

  public getCpf(): number {
    return this.cpf;
  }

  public setCpf(cpf: string): void {
    if (cpf && !validate.isValidCPF(cpf)) {
      throw new Error("CPF inválido.");
    }
    this.cpf = Number(cpf.replace(/\D/g, ""));
  }

  public getCnpj(): number {
    return this.cnpj;
  }

  public setCnpj(cnpj: string): void {
    if (cnpj && !validate.isValidCNPJ(cnpj)) {
      throw new Error("CNPJ inválido.");
    }
    this.cnpj = Number(cnpj.replace(/\D/g, ""));
  }
}
