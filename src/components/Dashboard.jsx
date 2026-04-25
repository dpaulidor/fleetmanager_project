import { useState, useEffect } from 'react';
import './Dashboard.css';

// Initial vehicle data
const initialVehicles = [
  { id: 1, date: '01/04/26', action: 'Moto A', etat: 'En panne', disponibilite: 'Non dispo', kilometrage: 15420, conducteur: 'Jean Dupont' },
  { id: 2, date: '04/03/26', action: 'Camion', etat: 'Entretien', disponibilite: 'Non dispo', kilometrage: 89230, conducteur: 'Pierre Martin' },
  { id: 3, date: '04/01/26', action: 'Moto B', etat: 'Bon', disponibilite: 'Non dispo', kilometrage: 3250, conducteur: 'Sophie Leroy' },
  { id: 4, date: '10/02/26', action: 'Renault Clio', etat: 'Bon', disponibilite: 'Disponible', kilometrage: 45200, conducteur: '—' },
  { id: 5, date: '15/02/26', action: 'Peugeot 208', etat: 'Bon', disponibilite: 'Disponible', kilometrage: 28300, conducteur: '—' },
  { id: 6, date: '20/02/26', action: 'Citroen C3', etat: 'Bon', disponibilite: 'Non dispo', kilometrage: 67800, conducteur: 'Lucie Bernard' },
  { id: 7, date: '25/02/26', action: 'Dacia Sandero', etat: 'Bon', disponibilite: 'Disponible', kilometrage: 12500, conducteur: '—' },
  { id: 8, date: '01/03/26', action: 'Ford Transit', etat: 'Bon', disponibilite: 'Disponible', kilometrage: 102400, conducteur: '—' },
  { id: 9, date: '05/03/26', action: 'Mercedes Vito', etat: 'Bon', disponibilite: 'Non dispo', kilometrage: 75100, conducteur: 'Nicolas Petit' },
  { id: 10, date: '10/03/26', action: 'BMW Serie 3', etat: 'Bon', disponibilite: 'Disponible', kilometrage: 34200, conducteur: '—' },
  { id: 11, date: '12/03/26', action: 'Audi A4', etat: 'Bon', disponibilite: 'Non dispo', kilometrage: 52300, conducteur: 'Emma Dubois' },
  { id: 12, date: '18/03/26', action: 'Volkswagen Golf', etat: 'Bon', disponibilite: 'Non dispo', kilometrage: 19800, conducteur: 'Thomas Moreau' },
  { id: 13, date: '22/03/26', action: 'Moto KTM', etat: 'En panne', disponibilite: 'Non dispo', kilometrage: 8700, conducteur: 'Alexandre Girard' },
  { id: 14, date: '28/03/26', action: 'Tesla Model 3', etat: 'Bon', disponibilite: 'Non dispo', kilometrage: 12400, conducteur: 'Julie Rousseau' },
  { id: 15, date: '30/03/26', action: 'Toyota Hilux', etat: 'Bon', disponibilite: 'Non dispo', kilometrage: 65400, conducteur: 'Marc Lefevre' },
];

const monthlyRevenue = [
  { month: "Aujourd'hui", value: 320000 },
  { month: 'Septembre', value: 280000 },
  { month: 'Octobre', value: 250000 },
  { month: 'Novembre', value: 180000 },
  { month: 'Décembre', value: 240000 },
];
const maxRevenue = 400000;

const fixedStats = {
  actifs: 12,
  enUtilisation: 5,
  materiels: 30,
  horsService: 46,
  enMaintenance: 19,
};

const Dashboard = () => {
  const [vehicles, setVehicles] = useState(() => {
    const saved = localStorage.getItem('fleet_vehicles');
    return saved ? JSON.parse(saved) : initialVehicles;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEtat, setFilterEtat] = useState('all');
  const [filterDispo, setFilterDispo] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [newVehicle, setNewVehicle] = useState({
    action: '',
    etat: 'Bon',
    disponibilite: 'Disponible',
    kilometrage: '',
    conducteur: ''
  });

  useEffect(() => {
    const savedHistory = localStorage.getItem('fleet_history');
    if (savedHistory) setHistoryLogs(JSON.parse(savedHistory));
  }, []);

  const addHistoryLog = (message) => {
    const newLog = { id: Date.now(), message, timestamp: new Date().toLocaleString() };
    const updated = [newLog, ...historyLogs].slice(0, 50);
    setHistoryLogs(updated);
    localStorage.setItem('fleet_history', JSON.stringify(updated));
  };

  useEffect(() => {
    localStorage.setItem('fleet_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  const filteredVehicles = vehicles
    .filter(v => v.action.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(v => filterEtat === 'all' || v.etat === filterEtat)
    .filter(v => filterDispo === 'all' || v.disponibilite === filterDispo)
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === 'date') {
        const [da, ma, ya] = aVal.split('/');
        const [db, mb, yb] = bVal.split('/');
        aVal = new Date(2000 + parseInt(ya), parseInt(ma)-1, parseInt(da));
        bVal = new Date(2000 + parseInt(yb), parseInt(mb)-1, parseInt(db));
      }
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const updateVehicleStatus = (id, field, value) => {
    const vehicle = vehicles.find(v => v.id === id);
    setVehicles(vehicles.map(v => v.id === id ? { ...v, [field]: value } : v));
    addHistoryLog(`🔄 ${vehicle.action} : ${field} changé en "${value}"`);
  };

  const deleteVehicle = (id) => {
    const vehicle = vehicles.find(v => v.id === id);
    if (window.confirm(`Supprimer ${vehicle.action} ?`)) {
      setVehicles(vehicles.filter(v => v.id !== id));
      addHistoryLog(`🗑️ ${vehicle.action} supprimé`);
    }
  };

  const openEditModal = (vehicle) => {
    setEditingVehicle(vehicle);
    setNewVehicle({
      action: vehicle.action,
      etat: vehicle.etat,
      disponibilite: vehicle.disponibilite,
      kilometrage: vehicle.kilometrage,
      conducteur: vehicle.conducteur === '—' ? '' : vehicle.conducteur
    });
    setShowModal(true);
  };

  const handleSaveVehicle = () => {
    if (!newVehicle.action.trim()) {
      alert('Veuillez entrer un nom de véhicule');
      return;
    }
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2,'0')}/${(today.getMonth()+1).toString().padStart(2,'0')}/${today.getFullYear().toString().slice(-2)}`;
    
    if (editingVehicle) {
      setVehicles(vehicles.map(v => v.id === editingVehicle.id ? {
        ...v,
        action: newVehicle.action,
        etat: newVehicle.etat,
        disponibilite: newVehicle.disponibilite,
        kilometrage: newVehicle.kilometrage || 0,
        conducteur: newVehicle.conducteur || '—'
      } : v));
      addHistoryLog(`✏️ ${newVehicle.action} modifié`);
    } else {
      const newId = Date.now();
      setVehicles([{
        id: newId,
        date: formattedDate,
        action: newVehicle.action,
        etat: newVehicle.etat,
        disponibilite: newVehicle.disponibilite,
        kilometrage: newVehicle.kilometrage || 0,
        conducteur: newVehicle.conducteur || '—'
      }, ...vehicles]);
      addHistoryLog(`➕ ${newVehicle.action} ajouté`);
    }
    setShowModal(false);
    setEditingVehicle(null);
    setNewVehicle({ action: '', etat: 'Bon', disponibilite: 'Disponible', kilometrage: '', conducteur: '' });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="greeting">Salut Mica 👋</p>
        </div>
        <div className="auth-buttons">
          <button className="auth-btn login">Se connecter</button>
          <button className="auth-btn register">S'enregistrer</button>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card blue"><div className="stat-icon">🚗</div><div><div className="stat-value">{fixedStats.actifs}</div><div className="stat-label">Véhicules actifs</div></div></div>
        <div className="stat-card green"><div className="stat-icon">🏁</div><div><div className="stat-value">{fixedStats.enUtilisation}</div><div className="stat-label">En utilisation</div></div></div>
        <div className="stat-card purple"><div className="stat-icon">📦</div><div><div className="stat-value">{fixedStats.materiels}</div><div className="stat-label">Matériels</div></div></div>
        <div className="stat-card red"><div className="stat-icon">⚠️</div><div><div className="stat-value">{fixedStats.horsService}</div><div className="stat-label">Hors service</div></div></div>
        <div className="stat-card orange"><div className="stat-icon">🔧</div><div><div className="stat-value">{fixedStats.enMaintenance}</div><div className="stat-label">En maintenance</div></div></div>
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h3>Bar Chart</h3>
          <div className="max-badge">Jusqu'à {maxRevenue.toLocaleString()} G</div>
          <div className="simple-bars">
            {monthlyRevenue.map((item, idx) => (
              <div key={idx} className="bar-item">
                <span className="bar-label">{item.month}</span>
                <div className="bar-bg">
                  <div className="bar-fill" style={{ width: `${(item.value / maxRevenue) * 100}%` }}>
                    <span className="bar-value">{item.value.toLocaleString()} G</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="chart-card">
          <h3>Répartition véhicules</h3>
          <div className="pie-legend">
            <div className="legend-item"><span className="color-dot green"></span> Bon état: {vehicles.filter(v => v.etat === 'Bon').length}</div>
            <div className="legend-item"><span className="color-dot red"></span> Panne: {vehicles.filter(v => v.etat === 'En panne').length}</div>
            <div className="legend-item"><span className="color-dot orange"></span> Entretien: {vehicles.filter(v => v.etat === 'Entretien').length}</div>
          </div>
          <div className="simple-pie">
            <div className="pie-segment green" style={{ width: `${(vehicles.filter(v => v.etat === 'Bon').length / vehicles.length) * 100}%` }}></div>
            <div className="pie-segment red" style={{ width: `${(vehicles.filter(v => v.etat === 'En panne').length / vehicles.length) * 100}%` }}></div>
            <div className="pie-segment orange" style={{ width: `${(vehicles.filter(v => v.etat === 'Entretien').length / vehicles.length) * 100}%` }}></div>
          </div>
        </div>
        <div className="chart-card">
          <h3>Disponibilité</h3>
          <div className="pie-legend">
            <div className="legend-item"><span className="color-dot blue"></span> Disponible: {vehicles.filter(v => v.disponibilite === 'Disponible').length}</div>
            <div className="legend-item"><span className="color-dot gray"></span> Non dispo: {vehicles.filter(v => v.disponibilite === 'Non dispo').length}</div>
          </div>
          <div className="simple-pie">
            <div className="pie-segment blue" style={{ width: `${(vehicles.filter(v => v.disponibilite === 'Disponible').length / vehicles.length) * 100}%` }}></div>
            <div className="pie-segment gray" style={{ width: `${(vehicles.filter(v => v.disponibilite === 'Non dispo').length / vehicles.length) * 100}%` }}></div>
          </div>
        </div>
      </div>

      <div className="control-bar">
        <div className="search-filter">
          <input type="text" placeholder="🔍 Rechercher un véhicule..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <select value={filterEtat} onChange={(e) => setFilterEtat(e.target.value)} className="filter-select">
            <option value="all">Tous états</option><option value="Bon">Bon</option><option value="En panne">Panne</option><option value="Entretien">Entretien</option>
          </select>
          <select value={filterDispo} onChange={(e) => setFilterDispo(e.target.value)} className="filter-select">
            <option value="all">Toutes dispos</option><option value="Disponible">Disponible</option><option value="Non dispo">Non dispo</option>
          </select>
        </div>
        <div className="action-buttons-group">
          <button className="btn-add-primary" onClick={() => { setEditingVehicle(null); setNewVehicle({ action: '', etat: 'Bon', disponibilite: 'Disponible', kilometrage: '', conducteur: '' }); setShowModal(true); }}>➕ Ajouter Véhicule</button>
          <button className="btn-history" onClick={() => setShowHistory(true)}>📜 Historique</button>
        </div>
      </div>

      <div className="table-card">
        <div className="table-wrapper">
          <table className="vehicle-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('date')} className="sortable">Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
                <th onClick={() => handleSort('action')} className="sortable">Véhicule {sortField === 'action' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
                <th>État</th><th>Disponibilité</th><th>Kilométrage</th><th>Conducteur</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map(vehicle => (
                <tr key={vehicle.id}>
                  <td>{vehicle.date}</td>
                  <td className="vehicle-name">{vehicle.action}</td>
                  <td>
                    <select className={`status-select ${vehicle.etat === 'Bon' ? 'status-good' : vehicle.etat === 'En panne' ? 'status-bad' : 'status-warning'}`} value={vehicle.etat} onChange={(e) => updateVehicleStatus(vehicle.id, 'etat', e.target.value)}>
                      <option>Bon</option>
                      <option>En panne</option>
                      <option>Entretien</option>
                    </select>
                  </td>
                  <td>
                    <select className={`dispo-select ${vehicle.disponibilite === 'Disponible' ? 'dispo-yes' : 'dispo-no'}`} value={vehicle.disponibilite} onChange={(e) => updateVehicleStatus(vehicle.id, 'disponibilite', e.target.value)}>
                      <option>Disponible</option>
                      <option>Non dispo</option>
                    </select>
                  </td>
                  <td>{vehicle.kilometrage?.toLocaleString()} km</td>
                  <td>{vehicle.conducteur}</td>
                  <td>
                    <button className="icon-btn edit" onClick={() => openEditModal(vehicle)}>✏️</button>
                    <button className="icon-btn delete" onClick={() => deleteVehicle(vehicle.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredVehicles.length === 0 && <div className="empty-table">Aucun véhicule trouvé</div>}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingVehicle ? 'Modifier' : 'Ajouter'} un véhicule</h3>
            <div className="form-group"><label>Nom *</label><input type="text" value={newVehicle.action} onChange={(e) => setNewVehicle({...newVehicle, action: e.target.value})} placeholder="Ex: Renault Clio" autoFocus /></div>
            <div className="form-row">
              <div className="form-group"><label>État</label><select value={newVehicle.etat} onChange={(e) => setNewVehicle({...newVehicle, etat: e.target.value})}><option>Bon</option><option>En panne</option><option>Entretien</option></select></div>
              <div className="form-group"><label>Disponibilité</label><select value={newVehicle.disponibilite} onChange={(e) => setNewVehicle({...newVehicle, disponibilite: e.target.value})}><option>Disponible</option><option>Non dispo</option></select></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Kilométrage (km)</label><input type="number" value={newVehicle.kilometrage} onChange={(e) => setNewVehicle({...newVehicle, kilometrage: e.target.value})} placeholder="0" /></div>
              <div className="form-group"><label>Conducteur</label><input type="text" value={newVehicle.conducteur} onChange={(e) => setNewVehicle({...newVehicle, conducteur: e.target.value})} placeholder="Nom" /></div>
            </div>
            <div className="modal-actions"><button className="cancel-btn" onClick={() => setShowModal(false)}>Annuler</button><button className="submit-btn" onClick={handleSaveVehicle}>{editingVehicle ? 'Mettre à jour' : 'Ajouter'}</button></div>
          </div>
        </div>
      )}

      {showHistory && (
        <div className="modal-overlay" onClick={() => setShowHistory(false)}>
          <div className="modal-content history-modal" onClick={(e) => e.stopPropagation()}>
            <h3>📜 Historique des actions</h3>
            {historyLogs.length === 0 ? (
              <p className="empty-history">Aucune action enregistrée</p>
            ) : (
              <div className="history-list">
                {historyLogs.map(log => (
                  <div key={log.id} className="history-item">
                    <span className="history-time">{log.timestamp}</span>
                    <span className="history-message">{log.message}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="modal-actions"><button className="cancel-btn" onClick={() => setShowHistory(false)}>Fermer</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;