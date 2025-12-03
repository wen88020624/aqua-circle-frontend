import { useState, useEffect } from 'react';
import { waterQualityApi, aquariumApi } from '../../shared/api';
import { WATER_QUALITY_TEST_TYPES, getTodayDate } from '../../shared/utils/constants';
import type { WaterQualityRecord, Aquarium } from '../../shared/types';
import './shared.css';

export function WaterQualityList() {
  const [records, setRecords] = useState<WaterQualityRecord[]>([]);
  const [aquariums, setAquariums] = useState<Aquarium[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    testType: 'NH3+NH4' as const,
    testDate: getTodayDate(),
    value: '',
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
        waterQualityApi.findAll(),
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await waterQualityApi.create({
        testType: formData.testType,
        testDate: formData.testDate,
        value: Number(formData.value),
        notes: formData.notes || undefined,
        aquariumId: Number(formData.aquariumId),
      });
      setShowForm(false);
      setFormData({
        testType: 'NH3+NH4',
        testDate: getTodayDate(),
        value: '',
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
      await waterQualityApi.remove(id);
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
        <h1>水質檢測記錄管理</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? '取消' : '新增記錄'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-container">
          <h2>新增水質檢測記錄</h2>
          <div className="form-row">
            <div className="form-group">
              <label>檢測種類 *</label>
              <select
                value={formData.testType}
                onChange={(e) => setFormData({ ...formData, testType: e.target.value as any })}
                required
              >
                {WATER_QUALITY_TEST_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>檢測日期 *</label>
              <input
                type="date"
                value={formData.testDate}
                onChange={(e) => setFormData({ ...formData, testDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>數值 *</label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                required
                step="0.01"
              />
            </div>
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
              <th>檢測日期</th>
              <th>檢測種類</th>
              <th>數值</th>
              <th>魚缸</th>
              <th>備註</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {records.map(record => {
              const aquarium = aquariums.find(aq => aq.id === record.aquariumId);
              return (
                <tr key={record.id}>
                  <td>{record.testDate}</td>
                  <td>{record.testType}</td>
                  <td>{record.value}</td>
                  <td>{aquarium?.name || '-'}</td>
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
          <div className="empty-state">尚無水質檢測記錄</div>
        )}
      </div>
    </div>
  );
}

