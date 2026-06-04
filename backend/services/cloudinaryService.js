import cloudinary from '../config/cloudinary.js';

const pastaPerfis = process.env.CLOUDINARY_FOLDER || 'prodsync/usuarios/perfis';

export const isCloudinaryPublicId = (valor) => {
    return Boolean(valor && !String(valor).startsWith('http') && !String(valor).startsWith('/uploads/'));
};

export const montarUrlImagemLocal = (imagem) => {
    if (!imagem) return null;

    const valor = String(imagem);
    if (valor.startsWith('http')) return valor;
    if (valor.startsWith('/uploads/')) return valor;

    return `/uploads/imagens/${valor}`;
};

export const uploadImagemPerfil = (buffer, { id_empresa, id_usuario }) => {
    if (!buffer) {
        throw new Error('Buffer da imagem nao informado');
    }

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: pastaPerfis,
                public_id: `empresa_${id_empresa}_usuario_${id_usuario}`,
                overwrite: true,
                resource_type: 'image',
                transformation: [
                    { width: 400, height: 400, crop: 'fill', gravity: 'face' },
                    { quality: 'auto', fetch_format: 'auto' }
                ]
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        stream.end(buffer);
    });
};

export const removerImagemCloudinary = async (publicId) => {
    if (!publicId || !isCloudinaryPublicId(publicId)) return null;

    return cloudinary.uploader.destroy(publicId, {
        resource_type: 'image',
        invalidate: true
    });
};
