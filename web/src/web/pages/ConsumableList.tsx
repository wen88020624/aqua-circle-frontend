import { useState, useEffect } from 'react';
import { consumableApi, aquariumApi } from '../../shared/api';
import { CONSUMABLE_TAGS, CONSUMABLE_STATUSES, getTodayDate } from '../../shared/utils/constants';
import type { Consumable, Aquarium } from '../../shared/types';
import './shared.css';

export function ConsumableList() {
  const [consumables, setConsumables] = useState<Consumable[]>([]);
  const [aquariums, setAquariums] = useState<Aquarium[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    tag: '飼料' as const,
    quantity: '',
    price: '',
    notes: '',
    purchaseDate: getTodayDate(),
    expiryDate: '',
    aquariumId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cons, aqs] = await Promise.all([
        consumableApi.findAll(),
        aquariumApi.findAll(),
      ]);
      setConsumables(cons);
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
      await consumableApi.create({
        name: formData.name,
        tag: formData.tag,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
        notes: formData.notes || undefined,
        purchaseDate: formData.purchaseDate || undefined,
        expiryDate: formData.expiryDate || undefined,
        aquariumId: formData.aquariumId ? Number(formData.aquariumId) : undefined,
      });
      setShowForm(false);
      setFormData({
        name: '',
        tag: '飼料',
        quantity: '',
        price: '',
        notes: '',
        purchaseDate: getTodayDate(),
        expiryDate: '',
        aquariumId: '',
      });
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : '建立失敗');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('確定要刪除這個耗材嗎？')) return;
    try {
      await consumableApi.remove(id);
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
        <h1>耗材管理</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? '取消' : '新增耗材'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-container">
          <h2>新增耗材</h2>
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
                {CONSUMABLE_TAGS.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>數量 *</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
                min="0"
              />
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
              <label>到期日期</label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
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
              <th>數量</th>
              <th>狀態</th>
              <th>金額</th>
              <th>到期日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {consumables.map(consumable => (
              <tr key={consumable.id}>
                <td>{consumable.name}</td>
                <td>{consumable.tag}</td>
                <td>{consumable.quantity}</td>
                <td>{consumable.status}</td>
                <td>${consumable.price}</td>
                <td>{consumable.expiryDate || '-'}</td>
                <td>
                  <button
                    onClick={() => handleDelete(consumable.id)}
                    className="btn-danger"
                  >
                    刪除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {consumables.length === 0 && (
          <div className="empty-state">尚無耗材資料</div>
        )}
      </div>
    </div>
  );
}

