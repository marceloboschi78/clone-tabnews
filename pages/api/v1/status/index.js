import database from "infra/database.js";

async function status(request, response) {
  const dataBaseVersionResult = await database.query("SHOW server_version;");
  console.log(dataBaseVersionResult);
  const dataBaseVersionValue = dataBaseVersionResult.rows[0].server_version;
  const updatedAt = new Date().toISOString();

  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxConnectionsValue =
    databaseMaxConnectionsResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectionResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1",
    values: [databaseName],
  });

  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: dataBaseVersionValue,
        max_connections: parseInt(databaseMaxConnectionsValue),
        opened_connections: parseInt(databaseOpenedConnectionsValue),
      },
    },
  });
}
export default status;
