import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next = {};
    if (form.fullName.trim().length < 2) {
      next.fullName = 'Họ tên phải có ít nhất 2 ký tự';
    }
    if (!EMAIL_REGEX.test(form.email.trim())) {
      next.email = 'Email không đúng định dạng';
    }
    if (form.password.length < 6) {
      next.password = 'Mật khẩu phải từ 6 ký tự trở lên';
    }
    if (form.confirmPassword !== form.password) {
      next.confirmPassword = 'Mật khẩu nhập lại không khớp';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password
      });
      navigate('/manage-rooms');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="card auth-card">
      <h1>Đăng ký tài khoản</h1>
      {serverError && <div className="alert error" style={{ marginTop: '12px' }}>{serverError}</div>}
      <form className="form-stack" onSubmit={handleSubmit} noValidate>
        <label>
          Họ và tên
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            placeholder="Nguyễn Văn A"
          />
          {errors.fullName && <span className="field-error">{errors.fullName}</span>}
        </label>

        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="user@example.com"
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </label>

        <label>
          Mật khẩu
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Tối thiểu 6 ký tự"
          />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </label>

        <label>
          Xác nhận mật khẩu
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            placeholder="Nhập lại mật khẩu"
          />
          {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
        </label>

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Đang xử lý...' : 'Đăng ký'}
        </button>
      </form>
      <p style={{ marginTop: '12px' }}>
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </p>
    </section>
  );
}
