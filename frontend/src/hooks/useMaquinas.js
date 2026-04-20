import { useState, useRef } from 'react';

const estadoInicial = {
  nomeMaquina: "",
  idMaquina: "",
  setorMaquina: "",
  capacidadeNormalMaquina: "",
  tipoMaquina: "",
  dataAquisicaoMaquina: "",
  operadorMaquina: "",
  statusMaquina: ""
};

export function useMaquinas() {
  const [formData, setFormData] = useState(estadoInicial);
  const [arquivo, setArquivo] = useState(null);
  const fileInputRef = useRef(null);

  //manipulação dos inputs de texto e selects pelo id
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  //abre a seleção de arquivos
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  //tratamento e validação da imagem
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];

      if (!tiposPermitidos.includes(file.type)) {
        alert("Formato inválido! Por favor, envie apenas JPG, PNG ou WEBP.");
        e.target.value = ""; // Limpa o input
        return;
      }

      setArquivo({
        nome: file.name,
        preview: URL.createObjectURL(file),
        raw: file
      });
    }
  };

  //a editar -- integração com editar e excluir
  // Prepara o formulário para a EDIÇÃO (você vai usar isso no clique da tabela)
  const preencherParaEdicao = (maquina) => {
    setFormData({
      nomeMaquina: maquina.nome || "",
      idMaquina: maquina.id || "",
      setorMaquina: maquina.setor || "",
      capacidadeNormalMaquina: maquina.capacidadeNormal || "",
      tipoMaquina: maquina.tipoMaquina || "",
      dataAquisicaoMaquina: maquina.dataAquisicao || "",
      operadorMaquina: maquina.operador || "",
      statusMaquina: maquina.status || ""
    });
    // Lógica adicional para imagem existente virá aqui se necessário
  };

  //zera o form dps de salvar ou fechar o modal
  const limparFormulario = () => {
    setFormData(estadoInicial);
    setArquivo(null);
  };

  return {
    formData,
    arquivo,
    fileInputRef,
    handleInputChange,
    handleUploadClick,
    handleFileChange,
    preencherParaEdicao,
    limparFormulario
  };
}