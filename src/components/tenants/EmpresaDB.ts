export type EmpresaInterface = EmpresaDB;

export default class EmpresaDB {
  public id: number = 0;
  public razao_social: string = "";
  public nome_fantasia: string = "";
  public telefone: string | null = null;
  public tipo_telefone: 'fixo' | 'celular' | 'outro' = 'fixo';
  public email: string | null = null;
  public tipo_email: 'pessoal' | 'profissional' | 'outro' = 'pessoal';
  public rede_social: string | null = null;
  public tipo_rede_social: 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'outro' = 'facebook';
  public endereco: string | null = null;
  public cep: string = "";
  public cidade: string = "";
  public ddd: string = "";
  public estado: string = "";
  public pais: string = "";
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
    id,
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
    this.id = id;
    this.razao_social = razao_social;
    this.nome_fantasia = nome_fantasia;
    this.telefone = telefone;
    this.tipo_telefone = tipo_telefone;
    this.email = email;
    this.tipo_email = tipo_email;
    this.rede_social = rede_social;
    this.tipo_rede_social = tipo_rede_social;
    this.endereco = endereco;
    this.cep = cep;
    this.cidade = cidade;
    this.ddd = ddd;
    this.estado = estado;
    this.pais = pais;
    this.data_limite_faturamento = data_limite_faturamento;
    this.data_limite_pagamento = data_limite_pagamento;
    this.inscricao_estadual = inscricao_estadual;
    this.inscricao_municipal = inscricao_municipal;
    this.contribuinte_icms = contribuinte_icms;
    this.operacao_triangular = operacao_triangular;
    this.aceita_quarteirizacao = aceita_quarteirizacao;
    this.cepom_contrato_social = cepom_contrato_social;
    this.demonstrativo_financeiro = demonstrativo_financeiro;
    this.referencias_comerciais = referencias_comerciais;
    this.referencias_bancarias = referencias_bancarias;
    this.termo_contribuinte_icms = termo_contribuinte_icms;
    this.anexos = anexos;
    this.minuta_previa_contrato = minuta_previa_contrato;
    this.modelo_nota_fiscal = modelo_nota_fiscal;
  }
}
