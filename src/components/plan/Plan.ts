import PlanRepository, { PlanRepositoryInterface } from "./planRepository";


export type PlanInterface = Plan;

export default class Plan {
  private id:number = 0;
  private name: string = "";
  private description: string = "";
  private price: number = 0.0;
  public repository: PlanRepositoryInterface;

  constructor({ name, description, price }: PlanInterface) {
    this.setName(name);
    this.setDescription(description);
    this.setPrice(price);
    this.repository = new PlanRepository();
  }

  async register(): Promise<number> {
    if (this.repository != null) {
      return await this.repository.insertPlan(this);
    }
    return 0;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    if (name.trim().length === 0) {
      throw new Error("O nome do plano não pode ser vazio.");
    }
    this.name = name;
  }

  public getDescription(): string {
    return this.description;
  }

  public setDescription(description: string): void {
    if (description.trim().length === 0) {
      throw new Error("A descrição do plano não pode ser vazia.");
    }
    this.description = description;
  }
  public getId(): number {
    return this.id;
  }

  public setId(id: number): void {
    if (id < 0) {
      throw new Error("O preço deve ser maior que zero.");
    }
    this.id = id;
  }
  
  public getPrice(): number {
    return this.price;
  }

  public setPrice(price: number): void {
    if (price < 0) {
      throw new Error("O preço deve ser maior que zero.");
    }
    this.price = price;
  }
}
