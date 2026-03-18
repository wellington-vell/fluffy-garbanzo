export interface ClienteDto {
    id: number;
    nome: string;
    sobrenome: string;
    email: string;
    dataCadastro: string;
    ativo: boolean | null;
}