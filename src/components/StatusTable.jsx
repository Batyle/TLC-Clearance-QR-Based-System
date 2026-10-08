import StatusBadge from './StatusBadge'

export default function StatusTable({ clearances, onOfficeSelect }) {
  const handleTableClick = (event) => {
    const row = event.target.closest('tr[data-office]')
    if (row) onOfficeSelect(row.dataset.office)
  }

  return <div className="table-wrap"><table className="status-table">
    <caption>Office clearance status</caption>
    <thead><tr><th scope="col">Office</th><th scope="col">Status</th><th scope="col">Date updated</th></tr></thead>
    <tbody onClick={handleTableClick}>
      {clearances.map((clearance) => <tr key={clearance.office} data-office={clearance.office} tabIndex="0">
        <th scope="row">{clearance.office}</th>
        <td><StatusBadge status={clearance.status} /></td>
        <td>{clearance.updatedAt || '—'}</td>
      </tr>)}
    </tbody>
  </table></div>
}
