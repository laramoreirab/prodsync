import fs from 'fs';
import path from 'path';

export function removerArquivoAntigo(caminhoArquivo, tipo) {
    if (caminhoArquivo) {
        const caminhoCompleto = path.join(process.cwd(), 'uploads', tipo, caminhoArquivo);
        fs.unlink(caminhoCompleto, (err) => {
            if (err) {
                console.error('Erro ao remover arquivo antigo:', err);
            }
        });
    }
}