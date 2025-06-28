export const BACKEND_API_BASE = import.meta.env.VITE_BACKEND_API_BASE;

function fetchFromBackendHandled(route: string) {
  return ({
    onSuccess,
    onError,
  }: {
    onSuccess: (data: unknown) => void;
    onError: (message: string) => void;
  }) => {
    const url = `${BACKEND_API_BASE}/api${route}`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(onSuccess)
      .catch((err) => onError(err.message));
  };
}

export const getDatabaseTables = fetchFromBackendHandled("/data");

export const getWizardComponents = fetchFromBackendHandled("/components");
