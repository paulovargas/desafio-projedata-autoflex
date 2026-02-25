export function RawMaterialsPage() {
  return (
    <div className="card">
      <div className="card-header">Matérias-primas</div>
      <div className="card-body">
        <p className="text-secondary mb-3">
          Visão geral do estoque de matérias-primas e reposição.
        </p>
        <div className="row g-3">
          <div className="col-12 col-md-6 col-xl-4">
            <div className="border rounded p-3 bg-light">
              <div className="small text-secondary">Itens em estoque</div>
              <div className="fs-4 fw-semibold">412</div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-xl-4">
            <div className="border rounded p-3 bg-light">
              <div className="small text-secondary">Alertas de baixo estoque</div>
              <div className="fs-4 fw-semibold">18</div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-xl-4">
            <div className="border rounded p-3 bg-light">
              <div className="small text-secondary">Recebimentos pendentes</div>
              <div className="fs-4 fw-semibold">7</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
