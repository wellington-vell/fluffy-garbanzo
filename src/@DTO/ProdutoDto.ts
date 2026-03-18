export interface ProdutoDto {
  id: number;
  nome: string;
  descricao: string | null;
  preco: number;
  ativo: boolean;
  imagemUri: string | null;
}

