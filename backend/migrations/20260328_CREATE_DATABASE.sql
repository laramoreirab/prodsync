CREATE DATABASE IF NOT EXISTS ProdSync_db;
USE ProdSync_db;

-- 1. Tabela Empresas
CREATE TABLE Empresas (
    id_empresa INT AUTO_INCREMENT PRIMARY KEY,
    nome_empresa VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) NOT NULL UNIQUE,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    email VARCHAR(255),
    telefone VARCHAR(20),
    endereco VARCHAR(255),
    nome_representante VARCHAR(255),
    cpf_representante VARCHAR(14)
);

-- 2. Tabela Usuários
CREATE TABLE Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    identificador VARCHAR(50) UNIQUE NOT NULL, -- Matrícula ou login
    tipo ENUM('Adm', 'Gestor', 'Operador') NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    email VARCHAR(255),
    FOREIGN KEY (id_empresa) REFERENCES Empresas(id_empresa) ON DELETE CASCADE
);

-- 3. Tabela Setores
CREATE TABLE Setores (
    id_setor INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    nome_setor VARCHAR(100) NOT NULL,
    FOREIGN KEY (id_empresa) REFERENCES Empresas(id_empresa) ON DELETE CASCADE
);

-- 4. Tabela Categoria_Maquina
CREATE TABLE Categoria_Maquina (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    FOREIGN KEY (id_empresa) REFERENCES Empresas(id_empresa) ON DELETE CASCADE
);

-- 5. Tabela Máquinas
CREATE TABLE Maquinas (
    id_maquina INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    serie VARCHAR(50) UNIQUE,
    status_atual ENUM('Produzindo', 'Parada', 'Manutencao', 'Setup') DEFAULT 'Parada',
    id_setor INT NOT NULL,
    id_categoria INT NOT NULL,
    data_ativacao DATE,
    FOREIGN KEY (id_empresa) REFERENCES Empresas(id_empresa) ON DELETE CASCADE,
    FOREIGN KEY (id_setor) REFERENCES Setores(id_setor),
    FOREIGN KEY (id_categoria) REFERENCES Categoria_Maquina(id_categoria)
);

-- 6. Tabela Setor_Gestor (Relacionamento N:N entre Setor e Gestor)
CREATE TABLE Setor_Gestor (
    id_setor INT NOT NULL,
    id_gestor INT NOT NULL,
    id_empresa INT NOT NULL,
    PRIMARY KEY (id_setor, id_gestor),
    FOREIGN KEY (id_setor) REFERENCES Setores(id_setor) ON DELETE CASCADE,
    FOREIGN KEY (id_gestor) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_empresa) REFERENCES Empresas(id_empresa) ON DELETE CASCADE
);

-- 7. Tabela Turno
CREATE TABLE Turno (
    id_turno INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    nome_turno VARCHAR(50) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    FOREIGN KEY (id_empresa) REFERENCES Empresas(id_empresa) ON DELETE CASCADE
);

-- 8. Tabela EscalaTrabalho
CREATE TABLE EscalaTrabalho (
    id_operador INT NOT NULL,
    id_turno INT NOT NULL,
    dia_semana ENUM('Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado') NOT NULL,
    PRIMARY KEY (id_operador, id_turno, dia_semana),
    FOREIGN KEY (id_operador) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_turno) REFERENCES Turno(id_turno) ON DELETE CASCADE
);

-- 9. Tabela Motivos_Parada (Criada para sustentar o Histórico de Eventos)
CREATE TABLE Motivos_Parada (
    id_motivo INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    tipo ENUM('Programada', 'Nao Programada') DEFAULT 'Nao Programada',
    FOREIGN KEY (id_empresa) REFERENCES Empresas(id_empresa) ON DELETE CASCADE
);

-- 10. Tabela OrdemProducao
CREATE TABLE OrdemProducao (
    id_ordem INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_maquina INT NOT NULL,
    codigo_lote VARCHAR(100) NOT NULL,
    produto VARCHAR(150) NOT NULL,
    data_inicio DATETIME,
    data_fim DATETIME,
    qtd_planejada INT NOT NULL,
    FOREIGN KEY (id_empresa) REFERENCES Empresas(id_empresa) ON DELETE CASCADE,
    FOREIGN KEY (id_maquina) REFERENCES Maquinas(id_maquina)
);

-- 11. Tabela Historico_Eventos (Andon e Paradas)
CREATE TABLE Historico_Eventos (
    id_evento INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_maquina INT NOT NULL,
    id_ordemProducao INT,
    id_turno INT NOT NULL,
    id_motivo_parada INT,
    status_atual ENUM('Produzindo', 'Parada', 'Manutencao', 'Setup') NOT NULL,
    inicio DATETIME NOT NULL,
    termino DATETIME,
    duracao INT COMMENT 'Duração em minutos',
    FOREIGN KEY (id_empresa) REFERENCES Empresas(id_empresa) ON DELETE CASCADE,
    FOREIGN KEY (id_maquina) REFERENCES Maquinas(id_maquina) ON DELETE CASCADE,
    FOREIGN KEY (id_ordemProducao) REFERENCES OrdemProducao(id_ordem),
    FOREIGN KEY (id_turno) REFERENCES Turno(id_turno),
    FOREIGN KEY (id_motivo_parada) REFERENCES Motivos_Parada(id_motivo)
);

-- 12. Tabela Apontamento
CREATE TABLE Apontamento (
    id_apontamento INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_ordemProducao INT NOT NULL,
    id_maquina INT NOT NULL,
    id_operador INT NOT NULL,
    id_turno INT NOT NULL,
    qtd_boa INT NOT NULL DEFAULT 0,
    qtd_refugo INT NOT NULL DEFAULT 0,
    data_hora_inicio DATETIME NOT NULL,
    data_hora_fim DATETIME NOT NULL,
    observacao TEXT,
    FOREIGN KEY (id_empresa) REFERENCES Empresas(id_empresa) ON DELETE CASCADE,
    FOREIGN KEY (id_ordemProducao) REFERENCES OrdemProducao(id_ordem) ON DELETE CASCADE,
    FOREIGN KEY (id_maquina) REFERENCES Maquinas(id_maquina),
    FOREIGN KEY (id_operador) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_turno) REFERENCES Turno(id_turno)
);