import db from "../config/database";

const Usuario = {
    async getByID(id_usuario) {
        const [rows] = await db.query(
            "SELECT id_usuario, id_empresa, nome, identificador, tipo, cpf, email FROM Usuarios WHERE id_usuario = ?",
            [id_usuario]
        );
        return rows[0];
    },

    async getByEmail(email) {
        const [rows] = await db.query(
            "SELECT id_usuario, id_empresa, nome, identificador, tipo, cpf, email FROM Usuarios WHERE email = ?",
            [email]
        );
        return rows[0];
    },

    async getByCPF(cpf) {
        const [rows] = await db.query(
            "SELECT id_usuario, id_empresa, nome, identificador, tipo, cpf, email FROM Usuarios WHERE cpf = ?",
            [cpf]
        );
        return rows[0];
    },

    async getByIdentificador(identificador) {
        const [rows] = await db.query(
            "SELECT id_usuario, id_empresa, nome, identificador, tipo, cpf, email FROM Usuarios WHERE identificador = ?",
            [identificador]
        );
        return rows[0];
    },

    async getByEmpresa(id_empresa) {
        const [rows] = await db.query(
            "SELECT id_usuario, id_empresa, nome, identificador, tipo, cpf, email FROM Usuarios WHERE id_empresa = ?",
            [id_empresa]
        );
        return rows;
    },

    async create(usuarioData) {
        const { id_empresa, nome, identificador, tipo, cpf, email } = usuarioData;
        const [result] = await db.query(
            "INSERT INTO Usuarios (id_empresa, nome, identificador, tipo, cpf, email) VALUES (?, ?, ?, ?, ?, ?)",
            [id_empresa, nome, identificador, tipo, cpf, email]
        );
        return result.insertId;
    },

    async update(id_usuario, usuarioData) {
        const { nome, tipo, email } = usuarioData;
        await db.query(
            "UPDATE Usuarios SET nome = ?, tipo = ?, email = ? WHERE id_usuario = ?",
            [nome, tipo, email, id_usuario]
        );
        return true;
    },

    async delete(id_usuario) {
        await db.query("DELETE FROM Usuarios WHERE id_usuario = ?", [id_usuario]);
        return true;
    },

    async getGestorSetores(id_usuario) {
        const [rows] = await db.query(
            "SELECT s.id_setor, s.nome_setor FROM Setor_Gestor sg JOIN Setores s ON sg.id_setor = s.id_setor WHERE sg.id_gestor = ?",
            [id_usuario]
        );
        return rows;
    }
};

export default Usuario;