import { useState, useEffect } from 'react';
import { waterChangeApi, aquariumApi } from '../../shared/api';
import { getTodayDate } from '../../shared/utils/constants';
import type { WaterChangeRecord, Aquarium } from '../../shared/types';
import './shared.css';

export function WaterChangeList() {
  const [records, setRecords] = useState<WaterChangeRecord[]>([]);
  const [aquariums, setAquariums] = useState<Aquarium[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: getTodayDate(),
    waterChangeRatio: '',
    notes: '',
    aquariumId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [recs, aqs] = await Promise.all([
        waterChangeApi.findAll(),
        aquariumApi.findAll(),
      ]);
      setRecords(recs);
      setAquariums(aqs);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入失敗');
    } finally {
      setLoading(false);
    }
  };

  const getRatioText = (ratio: number) => {
    if (ratio === 1.0) return '全換';
    if (ratio === 0.5) return '1/2';
    if (ratio === 0.33) return '1/3';
    return `${ratio}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await waterChangeApi.create({
        date: formData.date,
        waterChangeRatio: Number(formData.waterChangeRatio),
        notes: formData.notes || undefined,
        aquariumId: Number(formData.aquariumId),
      });
      setShowForm(false);
      setFormData({
        date: getTodayDate(),
        waterChangeRatio: '',
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
      await waterChangeApi.remove(id);
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
        <h1>換水記錄管理</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? '取消' : '新增記錄'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-container">
          <h2>新增換水記錄</h2>
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
              <label>換水量 *</label>
              <select
                value={formData.waterChangeRatio}
                onChange={(e) => setFormData({ ...formData, waterChangeRatio: e.target.value })}
                required
              >
                <option value="">請選擇</option>
                <option value="0.33">1/3</option>
                <option value="0.5">1/2</option>
                <option value="1.0">全換</option>
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
              <th>換水量</th>
              <th>備註</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {records.map(record => {
              const aquarium = aquariums.find(aq => aq.id === record.aquariumId);
              return (
                <tr key={record.id}>
                  <td>{record.date}</td>
                  <td>{aquarium?.name || '-'}</td>
                  <td>{getRatioText(record.waterChangeRatio)}</td>
                  <td>{record.notes || '-'}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(record.id)}
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
        {records.length === 0 && (
          <div className="empty-state">尚無換水記錄</div>
        )}
      </div>
    </div>
  );
}

