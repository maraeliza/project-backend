import CountryRepository, {
  CountryRepositoryInterface,
} from "./countryRepository";

export type CountryInterface = Country;
export default class Country {
  private id: number = 0;
  private name: string = "";
  private iso_code: string = "";
  private created_at: string = "";
  private updated_at: string = "";
  private logo_url: string = "";
  public repository: CountryRepositoryInterface;

  constructor({ name, iso_code, logo_url }: CountryInterface) {
    this.name = name;
    this.iso_code = iso_code;
    this.logo_url = logo_url;
    this.repository = new CountryRepository();
  }
  async register(): Promise<number> {
    if (this.repository != null) {
      return await this.repository.insertCountry(this);
    }

    return 0;
  }
  public getId(): number {
    return this.id;
  }

  public setId(id: number): void {
    this.id = id;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getIsoCode(): string {
    return this.iso_code;
  }

  public setIsoCode(iso_code: string): void {
    this.iso_code = iso_code;
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

  public getLogoUrl(): string {
    return this.logo_url;
  }

  public setLogoUrl(logo_url: string): void {
    this.logo_url = logo_url;
  }
}
