export function ProductionPage() {
  return (
    <div className="card">
      <div className="card-header">Produção</div>
      <div className="card-body">
        <p className="mb-3 text-secondary">
          Visão geral do módulo de produção com fila, status das linhas e métricas de execução.
        </p>
        <div className="table-responsive">
          <table className="table table-sm align-middle mb-0">
            <thead>
              <tr>
                <th>Linha</th>
                <th>Ordem</th>
                <th>Status</th>
                <th>Progresso</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Line 01</td>
                <td>PO-1021</td>
                <td><span className="badge text-bg-success">Em execução</span></td>
                <td>85%</td>
              </tr>
              <tr>
                <td>Line 02</td>
                <td>PO-1027</td>
                <td><span className="badge text-bg-warning">Setup</span></td>
                <td>34%</td>
              </tr>
              <tr>
                <td>Line 03</td>
                <td>PO-1030</td>
                <td><span className="badge text-bg-secondary">Parada</span></td>
                <td>0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
