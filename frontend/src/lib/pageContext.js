//gerenciador de contexto dinâmico
let currentPageData = {};

export const setPageContext = (data) => {
  //merge dos dados para que múltiplos widgets possam contribuir
  currentPageData = { ...currentPageData, ...data };
};

export const getPageContext = () => {
  return {
    ...currentPageData,
    url: typeof window !== 'undefined' ? window.location.pathname : '',
    timestamp: new Date().toISOString()
  };
};

export const clearPageContext = () => {
  currentPageData = {};
};
