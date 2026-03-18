CREATE TABLE `Cliente` (
	`Id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`Nome` text NOT NULL,
	`Sobrenome` text NOT NULL,
	`Email` text NOT NULL,
	`DataCadastro` text NOT NULL,
	`Ativo` integer DEFAULT false
);
