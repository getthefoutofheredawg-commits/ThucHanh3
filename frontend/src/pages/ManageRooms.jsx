import { useEffect, useState } from 'react';
import { roomApi } from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

const EMPTY = { title: '', price: '', area: '', address: '', isAvailable: true };

export default function ManageRooms() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await roomApi.getAll();
      setRooms(res.data);
    } catch {
      setError('Không thể tải danh sách phòng');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    const payload = {
      title: form.title.trim(),
      price: Number(form.price),
      area: Number(form.area),
      address: form.address.trim(),
      isAvailable: Boolean(form.isAvailable)
    };
    try {
      if (editingId !== null) {
        await roomApi.update(editingId, payload);
        setMessage(`Đã cập nhật phòng #${editingId}`);
      } else {
        await roomApi.create(payload);
        setMessage('Đã tạo phòng mới');
      }
      setForm(EMPTY);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Thao tác thất bại');
    }
  };

  const handleDelete = async (id) => {
    setMessage('');
    setError('');
    try {
      await roomApi.remove(id);
      setMessage(`Đã xóa phòng #${id}`);
      await load();
    } catch {
      setError('Không thể xóa phòng');
    }
  };

  return (
    <div>
      <section className="card">
        <h1>Quản lý phòng (Người dùng: {user?.fullName})</h1>
        <p style={{ color: '#475569' }}>
          Thông tin người dùng được đọc từ <code>AuthContext</code> và lưu bền vững trong <code>localStorage</code>.
        </p>
      </section>

      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}

      <section className="card">
        <h2>{editingId !== null ? `Cập nhật phòng #${editingId}` : 'Thêm phòng mới'}</h2>
        <form className="form-grid" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Tên phòng"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Giá thuê"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Diện tích (m²)"
            value={form.area}
            onChange={(e) => setForm({ ...form, area: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Địa chỉ"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            required
          />
          <button type="submit" className="btn btn-primary">
            {editingId !== null ? 'Lưu (PUT)' : 'Thêm (POST)'}
          </button>
        </form>
      </section>

      <section className="card">
        <h2>Danh sách phòng trong Database</h2>
        {rooms.map((room) => (
          <div key={room.id} className="room-row">
            <div>
              <strong>#{room.id} - {room.title}</strong>
              <p>{room.address} • {room.area} m² • {Number(room.price).toLocaleString('vi-VN')} đ</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditingId(room.id);
                  setForm({
                    title: room.title,
                    price: String(room.price),
                    area: String(room.area),
                    address: room.address,
                    isAvailable: room.isAvailable
                  });
                }}
              >
                Sửa
              </button>
              <button type="button" className="btn btn-danger" onClick={() => handleDelete(room.id)}>
                Xóa
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
