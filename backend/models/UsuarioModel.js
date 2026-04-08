import prisma from '../config/prisma.js';

class UsuarioModel{
    //Listar todos os usuários com paginacção
    static async listarTodos(page = 1, pageSize = 10){
        try{
         const skip = (page-1) * pageSize;

         const[usuarios, totalUsuarios] = await Promise.all([
            prisma.Usuarios.findMany({
                skip: skip,
                take: pageSize,
                orderBy: {
                    name: 'asc' //ordena a paginação
                },
            }),
            prisma.Usuarios.count(),
         ]);

         const totalPaginas = Math.ceil(totalUsuarios/ pageSize);

         return{
            data: usuarios,
            meta: {
                totalUsuarios,
                totalPaginas,
                currentPages: page, pageSize,
            },
         };

        }catch(error){
            console.error('Erro ao listar usuários:', error);
            throw error;
        }
    };
}
export default UsuarioModel