import StatusRepository, { StatusRepositoryInterface } from "./statusRepository";

export type StatusInterface = Status;
export default class Status {
  private id: number = 0;
  private type: number = 0;
  private name: string = "";
  private description: string = "";
  private enabled: boolean = false;
  private created_at: string = "";
  private updated_at: string = "";
  public repository: StatusRepositoryInterface;

  constructor({ type, name, description, enabled }: StatusInterface) {
    this.type = type;
    this.name = name;
    this.description = description;
    this.enabled = enabled;
    this.repository = new StatusRepository();
  }

  async register(): Promise<number> {
    if (this.repository != null) {
      return await this.repository.insertStatus(this);
    }

    return 0;
  }

  public getId(): number {
    return this.id;
  }

  public setId(id: number): void {
    this.id = id;
  }

  public getType(): number {
    return this.type;
  }

  public setType(type: number): void {
    this.type = type;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getDescription(): string {
    return this.description;
  }

  public setDescription(description: string): void {
    this.description = description;
  }

  public getEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public getCreatedAt(): string {
    return this.created_at;
  }

  public setCreatedAt(created_at: string): void {
    this.created_at = created_at;
  }

  public getUpdatedAt(): string {
    return this.updated_at;
  }

  public setUpdatedAt(updated_at: string): void {
    this.updated_at = updated_at;
  }
}
