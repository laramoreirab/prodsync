# ProdSync: Sistema Inteligente de Controle de Produção e Apontamento em Tempo Real
> Projeto desenvolvido como Trabalho de Conclusão do **Curso Técnico em Desenvolvimento de Sistemas**.

---

## 🎯 O problema:
Muitas indústrias ainda sofrem com processos manuais no chão de fábrica. O ProdSync resolve gargalos críticos como:
* Informação "Zumbi": O dado chega ao gestor "morto". Como o registro é manual e demorado, não se resolve o problema no momento em que ele acontece; apenas lamenta-se o prejuízo no dia seguinte.
* Subjetividade (O fator humano): Papel aceita tudo. Sem automação, os números de produção e tempos de parada são baseados em estimativas ou "arredondamentos" dos operadores, o que mascara a realidade.
* Custo Fantasma: Sem saber o motivo exato das paradas (quebra, falta de material, setup lento), a empresa perde dinheiro sem conseguir identificar o ralo por onde ele está escoando.
* Incapacidade de Melhoria: Não se gerencia o que não se mede. Sem indicadores por turno (KPIs), é impossível criar metas, bonificar bons desempenhos ou identificar gargalos operacionais.

## 💡 A Solução
O **ProdSync** permite o registro digital das peças produzidas em tempo real, envia alertas automáticos de paradas de máquina para a manutenção e gera dashboards com indicadores de produtividade (KPIs) por turno, eliminando o uso de papel e a comunicação verbal tardia.

---

## 🛠️ Tecnologias Usadas
| **Linguagem web** | HTML, CSS, JavaScript |

| **Framework** | ShadCN, Next.js, Express, Tailwind |

| **Linguagem Mobile** | Java, Android Studio |

| **Banco de dados** | PostgreSQL |

| **IOT** | JavaScript, Espruino |

| **Protocolo de comunicação** | MQTT |

---

## ⚡ Funcionalidades do Sistema
* Exibição do status ao vivo de cada máquina (com as cores respectivas)
* Cadastro, exclusão e alteração de funcionário 
* Login de funcionários, gestores e administradores 
* Apontamento de produção, registrando a quantidade produzida, a quantidade de refugo (defeitos) e observações
* Exibição de relatórios, mostrando o tempo total parado x produzindo no dia, e um gráfico de pizza/barras com os principais motivos de parada (gráfico de perdas)
* Gestão de paradas, exigindo que o operador selecione o motivo daquela parada na tela Web.
* Emissão de alertas quando uma máquina ficar com o status "Vermelho" (Parada)
* Lista das máquinas e seus status atuais (com cores)
* Consulta da produção por turno
* Emissão de relatórios em PDF
* Cadastro, exclusão e alteração dos dados de máquinas
* Exibição da velocidade de produção
* Exibição de Dashboard Web do indicador OEE (Disponibilidade x Performance x Qualidade)

---

## 👥 Tipos de Usuários

Persona 1 - Operador de Máquina

Objetivo: Registrar sua produção de forma rápida e objetiva(assim evitando que informações sobre a produção deixem de ser registradas).

Persona 2 - Gestor de Produção

Objetivo: Ter visibilidade total do chão de fábrica pela plataforma(indentificando quais máquinas estão produzindo, quais estão paradas, por quais motivos elas estão paradas), para que a tomada de decisões seja mais precisa. Além da apresentação dos números de produção em tempo real(os problemas podem ser resolvidos mais rápidamente).

Persona 3 - Administrador

Objetivo: Maior controle sobre as informações dentro do site e visão geral do chão de fábrica.

---

## 🚀 Como Usar o Projeto

Acesse a aplicação web em produção através do link: https://prodsync-six.vercel.app/

---

## 👨‍💻 Equipe & Agradecimentos

Curso Técnico em Desenvolvimento de Sistemas - **SENAI**

**Professores Orientadores**: Estevão Ferreira Lourenço, William Reis da Silva e Gustavo Paiva

**Desenvolvedores**: Beatriz Gonçalves, Enzo Penido, Giovana Frade, Lara Moreira, Larissa Klarosk, Phietro Alves





