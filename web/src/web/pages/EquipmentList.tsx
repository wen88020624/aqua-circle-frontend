import { useState, useEffect } from 'react';
import { equipmentApi, aquariumApi } from '../../shared/api';
import { EQUIPMENT_TAGS, EQUIPMENT_STATUSES, getTodayDate } from '../../shared/utils/constants';
import type { Equipment, Aquarium } from '../../shared/types';
import './shared.css';

export function EquipmentList() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [aquariums, setAquariums] = useState<Aquarium[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    tag: '燈具' as const,
    status: '使用中' as const,
    price: '',
    notes: '',
    purchaseDate: getTodayDate(),
    aquariumId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [eqs, aqs] = await Promise.all([
        equipmentApi.findAll(),
        aquariumApi.findAll(),
      ]);
      setEquipment(eqs);
      setAquariums(aqs);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await equipmentApi.create({
        name: formData.name,
        tag: formData.tag,
        status: formData.status,
        price: Number(formData.price),
        notes: formData.notes || undefined,
        purchaseDate: formData.purchaseDate || undefined,
        aquariumId: formData.aquariumId ? Number(formData.aquariumId) : undefined,
      });
      setShowForm(false);
      setFormData({
        name: '',
        tag: '燈具',
        status: '使用中',
        price: '',
        notes: '',
        purchaseDate: getTodayDate(),
        aquariumId: '',
      });
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : '建立失敗');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('確定要刪除這個設備嗎？')) return;
    try {
      await equipmentApi.remove(id);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : '刪除失敗');
    }
  };

  if (loading) return <div className="loading">載入中...</div>;
  if (error) return <div className="error">錯誤：{error}</div>;

  return (
    <div>
      <div className="page-header">
        <h1>設備管理</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? '取消' : '新增設備'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-container">
          <h2>新增設備</h2>
          <div className="form-row">
            <div className="form-group">
              <label>名稱 *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Tag *</label>
              <select
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value as any })}
                required
              >
                {EQUIPMENT_TAGS.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>狀態 *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                required
              >
                {EQUIPMENT_STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>金額 *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                min="0"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>購買日期</label>
              <input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>所屬魚缸</label>
              <select
                value={formData.aquariumId}
                onChange={(e) => setFormData({ ...formData, aquariumId: e.target.value })}
              >
                <option value="">無</option>
                {aquariums.map(aq => (
                  <option key={aq.id} value={aq.id}>{aq.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>備註</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>
          <button type="submit" className="btn-primary">建立</button>
        </form>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>名稱</th>
              <th>Tag</th>
              <th>狀態</th>
              <th>金額</th>
              <th>購買日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map(eq => (
              <tr key={eq.id}>
                <td>{eq.name}</td>
                <td>{eq.tag}</td>
                <td>{eq.status}</td>
                <td>${eq.price}</td>
                <td>{eq.purchaseDate || '-'}</td>
                <td>
                  <button
                    onClick={() => handleDelete(eq.id)}
                    className="btn-danger"
                  >
                    刪除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {equipment.length === 0 && (
          <div className="empty-state">尚無設備資料</div>
        )}
      </div>
    </div>
  );
}

