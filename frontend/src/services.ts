export const BACKEND_API_BASE = import.meta.env.VITE_BACKEND_API_BASE;

function fetchFromBackendHandled(route: string, options?: RequestInit) {
  return ({
    onSuccess,
    onError,
  }: {
    onSuccess: (data: unknown) => void;
    onError: (message: string) => void;
  }) => {
    const url = `${BACKEND_API_BASE}/api${route}`;
    fetch(url, options)
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

export function updateWizardComponent({
  kind,
  step,
}: {
  kind: string;
  step: number | null;
}): Promise {
  return fetch(`${BACKEND_API_BASE}/api/components/${kind}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ step: step }),
  });
}
