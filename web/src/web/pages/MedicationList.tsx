import { useState, useEffect } from 'react';
import { medicationApi, aquariumApi } from '../../shared/api';
import { MEDICATION_TAGS, getTodayDate } from '../../shared/utils/constants';
import type { MedicationRecord, Aquarium } from '../../shared/types';
import './shared.css';

export function MedicationList() {
  const [records, setRecords] = useState<MedicationRecord[]>([]);
  const [aquariums, setAquariums] = useState<Aquarium[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    medicationName: '',
    tag: '抗生素' as const,
    dosage: '',
    date: getTodayDate(),
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
        medicationApi.findAll(),
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
      await medicationApi.create({
        medicationName: formData.medicationName,
        tag: formData.tag,
        dosage: Number(formData.dosage),
        date: formData.date,
        notes: formData.notes || undefined,
        aquariumId: Number(formData.aquariumId),
      });
      setShowForm(false);
      setFormData({
        medicationName: '',
        tag: '抗生素',
        dosage: '',
        date: getTodayDate(),
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
      await medicationApi.remove(id);
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
        <h1>下藥記錄管理</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? '取消' : '新增記錄'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-container">
          <h2>新增下藥記錄</h2>
          <div className="form-row">
            <div className="form-group">
              <label>下藥名稱 *</label>
              <input
                type="text"
                value={formData.medicationName}
                onChange={(e) => setFormData({ ...formData, medicationName: e.target.value })}
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
                {MEDICATION_TAGS.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>用量（mg/L）*</label>
              <input
                type="number"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                required
                min="0"
                step="0.1"
              />
            </div>
          </div>
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
              <th>下藥名稱</th>
              <th>Tag</th>
              <th>用量（mg/L）</th>
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
                  <td>{record.date}</td>
                  <td>{record.medicationName}</td>
                  <td>{record.tag}</td>
                  <td>{record.dosage}</td>
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
          <div className="empty-state">尚無下藥記錄</div>
        )}
      </div>
    </div>
  );
}

