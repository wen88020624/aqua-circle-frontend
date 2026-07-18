import { useEffect, useState } from 'react'
import { aquariumApi, consumableApi, feedingApi } from '../../shared/api'
import type { Aquarium, Consumable, FeedingRecord } from '../../shared/types'
import { getTodayDate } from '../../shared/utils/constants'
import './shared.css'

type FormData = {
  date: string
  consumableId: string
  notes: string
  aquariumId: string
}

const emptyForm = (): FormData => ({
  date: getTodayDate(),
  consumableId: '',
  notes: '',
  aquariumId: '',
})

type FeedingFormProps = {
  data: FormData
  setData: (d: FormData) => void
  onSubmit: (e: React.FormEvent) => void
  aquariums: Aquarium[]
  feedConsumables: Consumable[]
  title: string
  isEdit: boolean
  onCancel?: () => void
}

function FeedingForm({
  data,
  setData,
  onSubmit,
  aquariums,
  feedConsumables,
  title,
  isEdit,
  onCancel,
}: FeedingFormProps) {
  return (
    <form onSubmit={onSubmit} className="form-container">
      <h2>{title}</h2>
      <div className="form-row">
        <div className="form-group">
          <label>日期 *</label>
          <input
            type="date"
            value={data.date}
            onChange={(e) => setData({ ...data, date: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>所屬魚缸 *</label>
          <select
            value={data.aquariumId}
            onChange={(e) => setData({ ...data, aquariumId: e.target.value })}
            required
          >
            <option value="">請選擇</option>
            {aquariums.map((aq) => (
              <option key={aq.id} value={aq.id}>
                {aq.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>飼料 *</label>
          <select
            value={data.consumableId}
            onChange={(e) => setData({ ...data, consumableId: e.target.value })}
            required
          >
            <option value="">請選擇</option>
            {feedConsumables.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>備註</label>
        <textarea
          value={data.notes}
          onChange={(e) => setData({ ...data, notes: e.target.value })}
          rows={2}
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {isEdit ? '儲存' : '建立'}
        </button>
        {isEdit && onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            取消
          </button>
        )}
      </div>
    </form>
  )
}

export function FeedingList() {
  const [feedings, setFeedings] = useState<FeedingRecord[]>([])
  const [aquariums, setAquariums] = useState<Aquarium[]>([])
  const [feedConsumables, setFeedConsumables] = useState<Consumable[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<FormData>(emptyForm())
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<FormData>(emptyForm())

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [feeds, aqs, consumables] = await Promise.all([
        feedingApi.findAll(),
        aquariumApi.findAll(),
        consumableApi.findFeedConsumables(),
      ])
      setFeedings(feeds)
      setAquariums(aqs)
      setFeedConsumables(consumables)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入失敗')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await feedingApi.create({
        date: formData.date,
        consumableId: Number(formData.consumableId),
        notes: formData.notes || undefined,
        aquariumId: Number(formData.aquariumId),
      })
      setShowForm(false)
      setFormData(emptyForm())
      loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : '建立失敗')
    }
  }

  const handleEdit = (feed: FeedingRecord) => {
    setEditingId(feed.id)
    setShowForm(false)
    setEditData({
      date: feed.date,
      consumableId: String(feed.consumableId),
      notes: feed.notes ?? '',
      aquariumId: String(feed.aquariumId),
    })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    try {
      await feedingApi.update({
        id: editingId,
        date: editData.date,
        consumableId: Number(editData.consumableId),
        notes: editData.notes || undefined,
        aquariumId: Number(editData.aquariumId),
      })
      setEditingId(null)
      loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新失敗')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('確定要刪除這個記錄嗎？')) return
    try {
      await feedingApi.remove(id)
      loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : '刪除失敗')
    }
  }

  if (loading) return <div className="loading">載入中...</div>
  if (error) return <div className="error">錯誤：{error}</div>

  const aquariumMap = new Map(aquariums.map((aq) => [aq.id, aq.name]))
  const consumableMap = new Map(feedConsumables.map((c) => [c.id, c.name]))

  return (
    <div>
      <div className="page-header">
        <h1>餵食記錄管理</h1>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
          }}
          className="btn-primary"
        >
          {showForm ? '取消' : '新增記錄'}
        </button>
      </div>

      {showForm && !editingId && (
        <FeedingForm
          data={formData}
          setData={setFormData}
          onSubmit={handleSubmit}
          aquariums={aquariums}
          feedConsumables={feedConsumables}
          title="新增餵食記錄"
          isEdit={false}
        />
      )}
      {editingId && (
        <FeedingForm
          data={editData}
          setData={setEditData}
          onSubmit={handleUpdate}
          aquariums={aquariums}
          feedConsumables={feedConsumables}
          title="編輯餵食記錄"
          isEdit={true}
          onCancel={() => setEditingId(null)}
        />
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
            {feedings.map((feed) => (
              <tr key={feed.id}>
                <td>{feed.date}</td>
                <td>{aquariumMap.get(feed.aquariumId) ?? '-'}</td>
                <td>{consumableMap.get(feed.consumableId) ?? '-'}</td>
                <td>{feed.notes || '-'}</td>
                <td>
                  <div className="row-actions">
                    <button onClick={() => handleEdit(feed)} className="btn-primary">
                      編輯
                    </button>
                    <button onClick={() => handleDelete(feed.id)} className="btn-danger">
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {feedings.length === 0 && <div className="empty-state">尚無餵食記錄</div>}
      </div>
    </div>
  )
}
