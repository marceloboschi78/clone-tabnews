import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

function getStatusValues() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";
  let database = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
    database = (
      <>
        <li>Postgres versão: {database.version}</li>
        <li>Máximo de conexões simultâneas: {database.max_connections}</li>
        <li>Conexões abertas: {database.opened_connections}</li>
      </>
    );
  }
  return { updatedAtText, database };
}

function DatabaseStatus() {
  const { database } = getStatusValues();

  return (
    <div>
      <h2>Banco de dados:</h2>
      {database}
    </div>
  );
}

function UpdatedAt() {
  const { updatedAtText } = getStatusValues();

  return (
    <div>
      <h2>Atualização</h2>
      <li>Última atualização: {updatedAtText}</li>
    </div>
  );
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <DatabaseStatus />
      <UpdatedAt />
    </>
  );
}
