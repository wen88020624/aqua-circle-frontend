import { useState, useEffect } from 'react';
import { feedingApi, consumableApi, aquariumApi } from '../../shared/api';
import { getTodayDate } from '../../shared/utils/constants';
import type { FeedingRecord, Aquarium, Consumable } from '../../shared/types';
import './shared.css';

export function FeedingList() {
  const [feedings, setFeedings] = useState<FeedingRecord[]>([]);
  const [aquariums, setAquariums] = useState<Aquarium[]>([]);
  const [feedConsumables, setFeedConsumables] = useState<Consumable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: getTodayDate(),
    consumableId: '',
    notes: '',
    aquariumId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [feeds, aqs, consumables] = await Promise.all([
        feedingApi.findAll(),
        aquariumApi.findAll(),
        consumableApi.findFeedConsumables(),
      ]);
      setFeedings(feeds);
      setAquariums(aqs);
      setFeedConsumables(consumables);
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
      await feedingApi.create({
        date: formData.date,
        consumableId: Number(formData.consumableId),
        notes: formData.notes || undefined,
        aquariumId: Number(formData.aquariumId),
      });
      setShowForm(false);
      setFormData({
        date: getTodayDate(),
        consumableId: '',
        notes: '',
        aquariumId: '',
      });
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : '建立失敗');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('確定要刪除這個記錄嗎？')) return;
    try {
      await feedingApi.remove(id);
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
        <h1>餵食記錄管理</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? '取消' : '新增記錄'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-container">
          <h2>新增餵食記錄</h2>
          <div className="form-row">
            <div className="form-group">
              <label>日期 *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
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
            <div className="form-group">
              <label>飼料 *</label>
              <select
                value={formData.consumableId}
                onChange={(e) => setFormData({ ...formData, consumableId: e.target.value })}
                required
              >
                <option value="">請選擇</option>
                {feedConsumables.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
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
              <th>日期</th>
              <th>魚缸</th>
              <th>飼料</th>
              <th>備註</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {feedings.map(feed => {
              const aquarium = aquariums.find(aq => aq.id === feed.aquariumId);
              const consumable = feedConsumables.find(c => c.id === feed.consumableId);
              return (
                <tr key={feed.id}>
                  <td>{feed.date}</td>
                  <td>{aquarium?.name || '-'}</td>
                  <td>{consumable?.name || '-'}</td>
                  <td>{feed.notes || '-'}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(feed.id)}
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
        {feedings.length === 0 && (
          <div className="empty-state">尚無餵食記錄</div>
        )}
      </div>
    </div>
  );
}

