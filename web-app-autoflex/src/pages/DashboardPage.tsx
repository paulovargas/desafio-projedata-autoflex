export function DashboardPage() {
  const cards = [
    { title: 'Produtos', value: '128', tone: 'primary' },
    { title: 'Matérias-primas', value: '54', tone: 'success' },
    { title: 'Ordens de produção', value: '16', tone: 'warning' },
    { title: 'Linhas ativas', value: '4', tone: 'info' },
  ] as const

  return (
    <div className="d-grid gap-4">
      <section>
        <div className="row g-3">
          {cards.map((card) => (
            <div key={card.title} className="col-12 col-sm-6 col-xl-3">
              <div className={`card border-${card.tone} h-100`}>
                <div className="card-body">
                  <p className="text-secondary small mb-1">{card.title}</p>
                  <h3 className="mb-0">{card.value}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="row g-3">
        <div className="col-12 col-xl-8">
          <div className="card h-100">
            <div className="card-header">Resumo operacional</div>
            <div className="card-body">
              <p className="mb-0 text-secondary">
                Use a navegação lateral para acessar os módulos de produtos, matérias-primas e produção.
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-xl-4">
          <div className="card h-100">
            <div className="card-header">Status</div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between px-0">
                  <span>API</span>
                  <span className="badge text-bg-success">Online</span>
                </li>
                <li className="list-group-item d-flex justify-content-between px-0">
                  <span>Sincronização</span>
                  <span className="badge text-bg-warning">Pendente</span>
                </li>
                <li className="list-group-item d-flex justify-content-between px-0">
                  <span>Turno</span>
                  <span className="badge text-bg-primary">Manhã</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
