import { useState, useRef } from 'react';

export const useUsuarios = () => {
  const fileInputLoteRef = useRef(null);
  const fileInputFotoRef = useRef(null);

  const estadoInicialForm = {
    nomeUser: "",
    cpfUser: "",
    emailUser: "",
    setorUser: "",
    funcaoUser: "",
    turnoUser: "",
    maquinaUser: ""
  };

  const [formData, setFormData] = useState(estadoInicialForm);
  
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [arquivoLote, setArquivoLote] = useState(null);
  
  const [usuarioEditandoId, setUsuarioEditandoId] = useState(null); 

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoPerfil({
        raw: file,
        preview: URL.createObjectURL(file),
        nome: file.name
      });
    }
  };

  const handleLoteChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.csv')) {
      setArquivoLote({
        raw: file,
        nome: file.name
      });
    } else {
      alert("Por favor, selecione um arquivo CSV válido.");
      if (fileInputLoteRef.current) fileInputLoteRef.current.value = "";
    }
  };

  const preencherParaEdicao = (usuario) => {
    setUsuarioEditandoId(usuario.id); 
    setFormData({
      nome: usuario.nome || "",
      cpf: usuario.cpf || "",
      email: usuario.email || "",
      setor: usuario.setor || "",
      funcao: usuario.funcao || "",
      turno: usuario.turno || "",
      maquina_id: usuario.maquina_id || ""
    });
  };

  const limparFormularios = () => {
    setFormData(estadoInicialForm);
    setFotoPerfil(null);
    setArquivoLote(null);
    setUsuarioEditandoId(null); 
    
    if (fileInputLoteRef.current) fileInputLoteRef.current.value = "";
    if (fileInputFotoRef.current) fileInputFotoRef.current.value = "";
  };

  return {
    formData,
    fotoPerfil,
    arquivoLote,
    usuarioEditandoId,
    fileInputLoteRef,
    fileInputFotoRef,
    handleInputChange,
    handleFotoChange,
    handleLoteChange,
    preencherParaEdicao,
    limparFormularios,
    setFormData
  };
};