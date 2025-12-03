import { useState, useEffect } from 'react';
import { aquariumApi } from '../../shared/api';
import { getTodayDate } from '../../shared/utils/constants';
import type { Aquarium } from '../../shared/types';
import './AquariumList.css';

export function AquariumList() {
  const [aquariums, setAquariums] = useState<Aquarium[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    length: '',
    width: '',
    height: '',
    status: '開缸' as const,
    setupDate: getTodayDate(),
    notes: '',
  });

  useEffect(() => {
    loadAquariums();
  }, []);

  const loadAquariums = async () => {
    try {
      setLoading(true);
      const data = await aquariumApi.findAll();
      setAquariums(data);
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
      await aquariumApi.create({
        name: formData.name,
        length: Number(formData.length),
        width: Number(formData.width),
        height: Number(formData.height),
        status: formData.status,
        setupDate: formData.setupDate,
        notes: formData.notes || undefined,
      });
      setShowForm(false);
      setFormData({
        name: '',
        length: '',
        width: '',
        height: '',
        status: '開缸',
        setupDate: getTodayDate(),
        notes: '',
      });
      loadAquariums();
    } catch (err) {
      setError(err instanceof Error ? err.message : '建立失敗');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('確定要刪除這個魚缸嗎？')) return;
    try {
      await aquariumApi.remove(id);
      loadAquariums();
    } catch (err) {
      setError(err instanceof Error ? err.message : '刪除失敗');
    }
  };

  if (loading) return <div className="loading">載入中...</div>;
  if (error) return <div className="error">錯誤：{error}</div>;

  return (
    <div className="aquarium-list">
      <div className="page-header">
        <h1>魚缸管理</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? '取消' : '新增魚缸'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="aquarium-form">
          <h2>新增魚缸</h2>
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
              <label>長度（公分）*</label>
              <input
                type="number"
                value={formData.length}
                onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                required
                min="1"
              />
            </div>
            <div className="form-group">
              <label>寬度（公分）*</label>
              <input
                type="number"
                value={formData.width}
                onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                required
                min="1"
              />
            </div>
            <div className="form-group">
              <label>高度（公分）*</label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                required
                min="1"
              />
            </div>
          </div>
          <div className="form-group">
            <label>狀態 *</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              required
            >
              <option value="開缸">開缸</option>
              <option value="穩定">穩定</option>
              <option value="治療">治療</option>
              <option value="閒置">閒置</option>
            </select>
          </div>
          <div className="form-group">
            <label>開缸日期 *</label>
            <input
              type="date"
              value={formData.setupDate}
              onChange={(e) => setFormData({ ...formData, setupDate: e.target.value })}
              required
            />
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

      <div className="aquarium-grid">
        {aquariums.map(aquarium => (
          <div key={aquarium.id} className="aquarium-card">
            <h3>{aquarium.name}</h3>
            <div className="aquarium-info">
              <p>尺寸：{aquarium.length} × {aquarium.width} × {aquarium.height} 公分</p>
              <p>狀態：{aquarium.status}</p>
              <p>開缸日期：{aquarium.setupDate}</p>
              {aquarium.notes && <p>備註：{aquarium.notes}</p>}
            </div>
            <button
              onClick={() => handleDelete(aquarium.id)}
              className="btn-danger"
            >
              刪除
            </button>
          </div>
        ))}
        {aquariums.length === 0 && (
          <p className="empty-state">尚無魚缸資料</p>
        )}
      </div>
    </div>
  );
}

