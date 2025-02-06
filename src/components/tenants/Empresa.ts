import EmpresaRepository from "./EmpresaRepository";

export type EmpresaInterface = Empresa;

export default class Empresa {
  private id: number = 0;
  private razao_social: string = "";
  private nome_fantasia: string = "";
  public telefone: string | null = null;
  private tipo_telefone: 'fixo' | 'celular' | 'outro' = 'fixo';
  public email: string | null = null;
  private tipo_email: 'pessoal' | 'profissional' | 'outro' = 'pessoal';
  public rede_social: string | null = null;
  private tipo_rede_social: 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'outro' = 'facebook';
  public endereco: string | null = null;
  public cep: string = "";
  public cidade: string = "";
  public ddd: string = "";
  public estado: string = "";
  public pais: string = "";
  public cnpj: string = "";
  public data_limite_faturamento: number = 1; // Número do dia
  public data_limite_pagamento: number = 1; // Número do dia
  public inscricao_estadual: string | null = null;
  public inscricao_municipal: string | null = null;
  public contribuinte_icms: boolean = false;
  public operacao_triangular: boolean = false;
  public aceita_quarteirizacao: boolean = false;
  public cepom_contrato_social: Buffer | null = null; // Para armazenar arquivo
  public demonstrativo_financeiro: Buffer | null = null; // Para armazenar arquivo
  public referencias_comerciais: string | null = null;
  public referencias_bancarias: string | null = null;
  public termo_contribuinte_icms: Buffer | null = null; // Para armazenar arquivo
  public anexos: Buffer | null = null; // Para armazenar arquivo
  public minuta_previa_contrato: Buffer | null = null; // Para armazenar arquivo
  public modelo_nota_fiscal: Buffer | null = null; // Para armazenar arquivo

  constructor({
    razao_social,
    nome_fantasia,
    telefone,
    tipo_telefone,
    email,
    tipo_email,
    rede_social,
    tipo_rede_social,
    endereco,
    cep,
    cidade,
    ddd,
    estado,
    pais,
    data_limite_faturamento,
    data_limite_pagamento,
    inscricao_estadual,
    inscricao_municipal,
    contribuinte_icms,
    operacao_triangular,
    aceita_quarteirizacao,
    cepom_contrato_social,
    demonstrativo_financeiro,
    referencias_comerciais,
    referencias_bancarias,
    termo_contribuinte_icms,
    anexos,
    minuta_previa_contrato,
    modelo_nota_fiscal,
  }: EmpresaInterface) {
    this.setRazaoSocial(razao_social);
    this.setNomeFantasia(nome_fantasia);
    this.setTelefone(telefone);
    this.setTipoTelefone(tipo_telefone);
    this.setEmail(email);
    this.setTipoEmail(tipo_email);
    this.setRedeSocial(rede_social);
    this.setTipoRedeSocial(tipo_rede_social);
    this.setEndereco(endereco);
    this.setCep(cep);
    this.setCidade(cidade);
    this.setDdd(ddd);
    this.setEstado(estado);
    this.setPais(pais);
    this.setDataLimiteFaturamento(data_limite_faturamento);
    this.setDataLimitePagamento(data_limite_pagamento);
    this.setInscricaoEstadual(inscricao_estadual);
    this.setInscricaoMunicipal(inscricao_municipal);
    this.setContribuinteIcms(contribuinte_icms);
    this.setOperacaoTriangular(operacao_triangular);
    this.setAceitaQuarteirizacao(aceita_quarteirizacao);
    this.setCepomContratoSocial(cepom_contrato_social);
    this.setDemonstrativoFinanceiro(demonstrativo_financeiro);
    this.setReferenciasComerciais(referencias_comerciais);
    this.setReferenciasBancarias(referencias_bancarias);
    this.setTermoContribuinteIcms(termo_contribuinte_icms);
    this.setAnexos(anexos);
    this.setMinutaPreviaContrato(minuta_previa_contrato);
    this.setModeloNotaFiscal(modelo_nota_fiscal);
  }

  async register(): Promise<number> {
    try {
      return await new EmpresaRepository().insertCompany(this);
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  public getId(): number {
    return this.id;
  }

  public setId(id: number): void {
    if (id < 0) {
      throw new Error("O ID deve ser maior ou igual a zero.");
    }
    this.id = id;
  }

  public getRazaoSocial(): string {
    return this.razao_social;
  }

  public setRazaoSocial(razao_social: string): void {
    if (razao_social.trim().length === 0) {
      throw new Error("A razão social não pode ser vazia.");
    }
    this.razao_social = razao_social;
  }

  public getNomeFantasia(): string {
    return this.nome_fantasia;
  }

  public setNomeFantasia(nome_fantasia: string): void {
    if (nome_fantasia.trim().length === 0) {
      throw new Error("O nome fantasia não pode ser vazio.");
    }
    this.nome_fantasia = nome_fantasia;
  }

  public getTelefone(): string | null {
    return this.telefone;
  }

  public setTelefone(telefone: string | null): void {
    this.telefone = telefone;
  }

  public getTipoTelefone(): 'fixo' | 'celular' | 'outro' {
    return this.tipo_telefone;
  }

  public setTipoTelefone(tipo_telefone: 'fixo' | 'celular' | 'outro'): void {
    this.tipo_telefone = tipo_telefone;
  }

  public getEmail(): string | null {
    return this.email;
  }

  public setEmail(email: string | null): void {
    this.email = email;
  }

  public getTipoEmail(): 'pessoal' | 'profissional' | 'outro' {
    return this.tipo_email;
  }

  public setTipoEmail(tipo_email: 'pessoal' | 'profissional' | 'outro'): void {
    this.tipo_email = tipo_email;
  }

  public getRedeSocial(): string | null {
    return this.rede_social;
  }

  public setRedeSocial(rede_social: string | null): void {
    this.rede_social = rede_social;
  }

  public getTipoRedeSocial(): 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'outro' {
    return this.tipo_rede_social;
  }

  public setTipoRedeSocial(tipo_rede_social: 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'outro'): void {
    this.tipo_rede_social = tipo_rede_social;
  }

  public getEndereco(): string | null {
    return this.endereco;
  }

  public setEndereco(endereco: string | null): void {
    this.endereco = endereco;
  }

  public getCep(): string {
    return this.cep;
  }

  public setCep(cep: string): void {
    this.cep = cep;
  }

  public getCidade(): string {
    return this.cidade;
  }

  public setCidade(cidade: string): void {
    this.cidade = cidade;
  }

  public getDdd(): string {
    return this.ddd;
  }

  public setDdd(ddd: string): void {
    this.ddd = ddd;
  }

  public getEstado(): string {
    return this.estado;
  }

  public setEstado(estado: string): void {
    this.estado = estado;
  }

  public getPais(): string {
    return this.pais;
  }

  public setPais(pais: string): void {
    this.pais = pais;
  }

  public getDataLimiteFaturamento(): number {
    return this.data_limite_faturamento;
  }

  public setDataLimiteFaturamento(data_limite_faturamento: number): void {
    if (data_limite_faturamento < 1 || data_limite_faturamento > 31) {
      throw new Error("O limite de faturamento deve ser entre 1 e 31.");
    }
    this.data_limite_faturamento = data_limite_faturamento;
  }

  public getDataLimitePagamento(): number {
    return this.data_limite_pagamento;
  }

  public setDataLimitePagamento(data_limite_pagamento: number): void {
    if (data_limite_pagamento < 1 || data_limite_pagamento > 31) {
      throw new Error("O limite de pagamento deve ser entre 1 e 31.");
    }
    this.data_limite_pagamento = data_limite_pagamento;
  }

  public getInscricaoEstadual(): string | null {
    return this.inscricao_estadual;
  }

  public setInscricaoEstadual(inscricao_estadual: string | null): void {
    this.inscricao_estadual = inscricao_estadual;
  }

  public getInscricaoMunicipal(): string | null {
    return this.inscricao_municipal;
  }

  public setInscricaoMunicipal(inscricao_municipal: string | null): void {
    this.inscricao_municipal = inscricao_municipal;
  }

  public getContribuinteIcms(): boolean {
    return this.contribuinte_icms;
  }

  public setContribuinteIcms(contribuinte_icms: boolean): void {
    this.contribuinte_icms = contribuinte_icms;
  }

  public getOperacaoTriangular(): boolean {
    return this.operacao_triangular;
  }

  public setOperacaoTriangular(operacao_triangular: boolean): void {
    this.operacao_triangular = operacao_triangular;
  }

  public getAceitaQuarteirizacao(): boolean {
    return this.aceita_quarteirizacao;
  }

  public setAceitaQuarteirizacao(aceita_quarteirizacao: boolean): void {
    this.aceita_quarteirizacao = aceita_quarteirizacao;
  }

  public getCepomContratoSocial(): Buffer | null {
    return this.cepom_contrato_social;
  }

  public setCepomContratoSocial(cepom_contrato_social: Buffer | null): void {
    this.cepom_contrato_social = cepom_contrato_social;
  }

  public getDemonstrativoFinanceiro(): Buffer | null {
    return this.demonstrativo_financeiro;
  }

  public setDemonstrativoFinanceiro(demonstrativo_financeiro: Buffer | null): void {
    this.demonstrativo_financeiro = demonstrativo_financeiro;
  }

  public getReferenciasComerciais(): string | null {
    return this.referencias_comerciais;
  }

  public setReferenciasComerciais(referencias_comerciais: string | null): void {
    this.referencias_comerciais = referencias_comerciais;
  }

  public getReferenciasBancarias(): string | null {
    return this.referencias_bancarias;
  }

  public setReferenciasBancarias(referencias_bancarias: string | null): void {
    this.referencias_bancarias = referencias_bancarias;
  }

  public getTermoContribuinteIcms(): Buffer | null {
    return this.termo_contribuinte_icms;
  }

  public setTermoContribuinteIcms(termo_contribuinte_icms: Buffer | null): void {
    this.termo_contribuinte_icms = termo_contribuinte_icms;
  }

  public getAnexos(): Buffer | null {
    return this.anexos;
  }

  public setAnexos(anexos: Buffer | null): void {
    this.anexos = anexos;
  }

  public getMinutaPreviaContrato(): Buffer | null {
    return this.minuta_previa_contrato;
  }

  public setMinutaPreviaContrato(minuta_previa_contrato: Buffer | null): void {
    this.minuta_previa_contrato = minuta_previa_contrato;
  }

  public getModeloNotaFiscal(): Buffer | null {
    return this.modelo_nota_fiscal;
  }

  public setModeloNotaFiscal(modelo_nota_fiscal: Buffer | null): void {
    this.modelo_nota_fiscal = modelo_nota_fiscal;
  }
}
