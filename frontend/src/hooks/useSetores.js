import { useState, useCallback } from 'react';
import { setorService } from '@/services/setorService';

export const useSetores = () => {
  const [setores, setSetores] = useState([]);
  const [loading, setLoading] = useState(false);

  const [setorEmEdicaoId, setSetorEmEdicaoId] = useState(null); // Se tiver ID, estamos editando
  const [nomeSetor, setNomeSetor] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [maquinaAtual, setMaquinaAtual] = useState("");
  const [maquinasSelecionadas, setMaquinasSelecionadas] = useState([]);
  const [usuarioAtual, setUsuarioAtual] = useState("");
  const [funcaoAtual, setFuncaoAtual] = useState("");
  const [equipeSelecionada, setEquipeSelecionada] = useState([]);


 //criar
  const submeterSetor = async () => {
    const payload = {
      nome: nomeSetor,
      localizacao: localizacao,
      maquinas: maquinasSelecionadas,
      equipe: equipeSelecionada
    };

    try {
      if (setorEmEdicaoId) {
        await setorService.editarSetor(setorEmEdicaoId, payload);
        alert("Setor atualizado!");
      } else {
            await setorService.criarSetor(payload);
            alert("Setor criado!");
      }
      limparFormulario();
      carregarSetores(); 
      return true;
    } catch (error) {
      return false;
    }
  };

  // excluir
  const excluirSetor = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este setor?")) return;
    
    try {
      await setorService.excluirSetor(id);
      carregarSetores(); // Atualiza a lista após deletar
    } catch (error) {
      alert("Erro ao excluir setor.");
    }
  };

    const prepararEdicao = (setor) => {
    setSetorEmEdicaoId(setor.id);
    setNomeSetor(setor.nome);
    setLocalizacao(setor.localizacao);
    setMaquinasSelecionadas(setor.maquinas || []);
    setEquipeSelecionada(setor.equipe || []);
  };


  const handleAdicionarMaquina = () => {
    if (maquinaAtual && !maquinasSelecionadas.includes(maquinaAtual)) {
      setMaquinasSelecionadas([...maquinasSelecionadas, maquinaAtual]);
      setMaquinaAtual(""); 
    }
  };

  const handleRemoverMaquina = (maquina) => setMaquinasSelecionadas(m => m.filter(item => item !== maquina));

  const handleAdicionarMembro = () => {
    if (usuarioAtual && funcaoAtual) {
      setEquipeSelecionada([...equipeSelecionada, { usuario: usuarioAtual, funcao: funcaoAtual }]);
      setUsuarioAtual(""); setFuncaoAtual("");
    }
  };

  const handleRemoverMembro = (usuario) => setEquipeSelecionada(e => e.filter(m => m.usuario !== usuario));

  const limparFormulario = () => {
    setSetorEmEdicaoId(null);
    setNomeSetor("");
    setLocalizacao("");
    setMaquinasSelecionadas([]);
    setEquipeSelecionada([]);
  };

  return {    
    // para formulário
    nomeSetor, setNomeSetor,
    localizacao, setLocalizacao,
    maquinaAtual, setMaquinaAtual,
    maquinasSelecionadas,
    usuarioAtual, setUsuarioAtual,
    funcaoAtual, setFuncaoAtual,
    equipeSelecionada,
    setorEmEdicaoId,

    // ações
    handleAdicionarMaquina, handleRemoverMaquina,
    handleAdicionarMembro, handleRemoverMembro,
    submeterSetor, prepararEdicao, limparFormulario
  };
};