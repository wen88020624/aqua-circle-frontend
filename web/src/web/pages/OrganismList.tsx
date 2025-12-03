import { useState, useEffect } from 'react';
import { organismApi, aquariumApi } from '../../shared/api';
import { ORGANISM_TAGS, HEALTH_STATUSES, GENDERS, getTodayDate } from '../../shared/utils/constants';
import type { Organism, Aquarium } from '../../shared/types';
import './shared.css';

export function OrganismList() {
  const [organisms, setOrganisms] = useState<Organism[]>([]);
  const [aquariums, setAquariums] = useState<Aquarium[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    tag: '上層魚' as const,
    purchaseDate: getTodayDate(),
    price: '',
    healthStatus: '',
    gender: '',
    length: '',
    notes: '',
    aquariumId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [orgs, aqs] = await Promise.all([
        organismApi.findAll(),
        aquariumApi.findAll(),
      ]);
      setOrganisms(orgs);
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
      await organismApi.create({
        name: formData.name,
        tag: formData.tag,
        purchaseDate: formData.purchaseDate || undefined,
        price: Number(formData.price) || 0,
        healthStatus: formData.healthStatus || undefined,
        gender: formData.gender || undefined,
        length: formData.length ? Number(formData.length) : undefined,
        notes: formData.notes || undefined,
        aquariumId: Number(formData.aquariumId),
      });
      setShowForm(false);
      setFormData({
        name: '',
        tag: '上層魚',
        purchaseDate: getTodayDate(),
        price: '',
        healthStatus: '',
        gender: '',
        length: '',
        notes: '',
        aquariumId: '',
      });
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : '建立失敗');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('確定要刪除這個生物嗎？')) return;
    try {
      await organismApi.remove(id);
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
        <h1>生物管理</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? '取消' : '新增生物'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-container">
          <h2>新增生物</h2>
          <div className="form-group">
            <label>名稱 *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Tag *</label>
              <select
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value as any })}
                required
              >
                {ORGANISM_TAGS.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>所屬魚缸 *</label>
              <select
                value={formData.aquariumId}
                onChange={(e) => setFormData({ ...formData, aquariumId: e.target.value })}
                required
              >
                <option value="">請選擇</option>
                {aquariums.map(aq => (
                  <option key={aq.id} value={aq.id}>{aq.name}</option>
                ))}
              </select>
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
              <label>金額 *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                min="0"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>健康狀態</label>
              <select
                value={formData.healthStatus}
                onChange={(e) => setFormData({ ...formData, healthStatus: e.target.value })}
              >
                <option value="">請選擇</option>
                {HEALTH_STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>性別</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="">請選擇</option>
                {GENDERS.map(gender => (
                  <option key={gender} value={gender}>{gender}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>長度（公分）</label>
              <input
                type="number"
                value={formData.length}
                onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                min="0"
              />
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
              <th>魚缸</th>
              <th>金額</th>
              <th>健康狀態</th>
              <th>性別</th>
              <th>長度</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {organisms.map(org => {
              const aquarium = aquariums.find(aq => aq.id === org.aquariumId);
              return (
                <tr key={org.id}>
                  <td>{org.name}</td>
                  <td>{org.tag}</td>
                  <td>{aquarium?.name || '-'}</td>
                  <td>${org.price}</td>
                  <td>{org.healthStatus || '-'}</td>
                  <td>{org.gender || '-'}</td>
                  <td>{org.length ? `${org.length} 公分` : '-'}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(org.id)}
                      className="btn-danger"
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {organisms.length === 0 && (
          <div className="empty-state">尚無生物資料</div>
        )}
      </div>
    </div>
  );
}

