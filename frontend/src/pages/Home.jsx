import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { roomApi } from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    roomApi.getAll().then((res) => setRooms(res.data)).catch(() => {});
  }, []);

  return (
    <div>
      <section className="hero">
        <h1>SmartStay — Cổng Thông Tin &amp; Quản Lý Phòng Trọ</h1>
        <p style={{ marginBottom: '18px' }}>
          {isAuthenticated
            ? `Xin chào ${user.fullName}! Bạn đang đăng nhập với email ${user.email}.`
            : 'Đăng ký hoặc đăng nhập để thêm, sửa và xóa phòng trọ trực tiếp với ASP.NET Core + EF Core.'}
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to={isAuthenticated ? '/manage-rooms' : '/login'} className="btn btn-light">
            {isAuthenticated ? 'Vào trang Quản lý phòng' : 'Đăng nhập ngay'}
          </Link>
          <Link to="/about-us" className="btn btn-primary">
            Về chúng tôi
          </Link>
        </div>
      </section>

      <section className="card">
        <h2 style={{ marginBottom: '10px' }}>Danh sách phòng hiện có từ Database ({rooms.length})</h2>
        {rooms.length === 0 ? (
          <p style={{ color: '#64748b' }}>Chưa có phòng nào. Hãy đăng nhập và thêm phòng tại mục Quản lý phòng.</p>
        ) : (
          <div className="grid">
            {rooms.map((room) => (
              <article key={room.id} className="card" style={{ marginBottom: 0 }}>
                <h3>{room.title}</h3>
                <p>{room.address} • {room.area} m²</p>
                <p style={{ fontWeight: 700, color: '#0f766e' }}>
                  {Number(room.price).toLocaleString('vi-VN')} đ/tháng
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
