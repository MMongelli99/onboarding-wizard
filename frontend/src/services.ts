export const BACKEND_API_BASE = import.meta.env.VITE_BACKEND_API_BASE;

function fetchFromBackend(route: string) {
  const backendRoute = `${BACKEND_API_BASE}/api${route}`;
  return fetch(backendRoute);
}

export function getDatabaseTables({
  onSuccess,
  onError,
}: {
  onSuccess: (data: unknown) => void;
  onError: (message: string) => void;
}): void {
  fetchFromBackend(`/data`)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(onSuccess)
    .catch((err) => onError(err.message));
}
