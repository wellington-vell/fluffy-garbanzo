CREATE TABLE `ClienteProduto` (
	`Id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ClienteId` integer NOT NULL,
	`ProdutoId` integer NOT NULL,
	`Quantidade` integer DEFAULT 1 NOT NULL,
	`DataVinculo` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Produto` (
	`Id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`Nome` text NOT NULL,
	`Descricao` text,
	`Preco` real DEFAULT 0 NOT NULL,
	`Ativo` integer DEFAULT true NOT NULL
);
