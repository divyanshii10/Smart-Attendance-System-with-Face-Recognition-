import { useState, useEffect } from 'react';
import {
  Calendar, Download, FileText, TrendingUp,
  Users, Eye, X, CheckCircle, XCircle, Clock
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { reportsAPI } from '../services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Session {
  session_id: number;
  date: string;
  start_time: string | null;
  end_time: string | null;
  status: string;
  present: number;
  absent: number;
  total: number;
  rate: number;
}

interface StudentRecord {
  student_id: number;
  name: string;
  roll_number: string;
  department: string;
  year: string | null;
  status: 'Present' | 'Absent';
  time: string | null;
}

interface SessionDetail {
  session_id: number;
  date: string;
  status: string;
  students: StudentRecord[];
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

const DetailModal = ({
  detail,
  onClose,
  onExport
}: {
  detail: SessionDetail;
  onClose: () => void;
  onExport: () => void;
}) => {
  const [filter, setFilter] = useState<'all' | 'Present' | 'Absent'>('all');
  const shown = filter === 'all' ? detail.students : detail.students.filter(s => s.status === filter);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl overflow-hidden"
        style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4"
          style={{ background: 'rgba(79,70,229,0.12)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div>
            <h2 className="text-lg font-semibold text-[#E5E7EB]">
              Session Detail — {detail.date}
            </h2>
            <p className="text-sm text-[#9CA3AF] mt-0.5">
              {detail.students.filter(s => s.status === 'Present').length} present ·{' '}
              {detail.students.filter(s => s.status === 'Absent').length} absent
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={onExport}
            >
              Export Excel
            </Button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 px-6 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {(['all', 'Present', 'Absent'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${filter === f
                ? 'bg-[#4F46E5] text-white'
                : 'bg-white/5 text-[#9CA3AF] hover:bg-white/10'
                }`}
            >
              {f === 'all' ? 'All Students' : f}
            </button>
          ))}
        </div>

        {/* Student list */}
        <div className="overflow-y-auto flex-1 px-6 py-3 space-y-2">
          {shown.map(student => (
            <div
              key={student.student_id}
              className="flex items-center justify-between px-4 py-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: student.status === 'Present' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                    color: student.status === 'Present' ? '#10B981' : '#EF4444'
                  }}
                >
                  {student.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#E5E7EB]">{student.name}</p>
                  <p className="text-xs text-[#9CA3AF]">{student.roll_number} · {student.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {student.time && (
                  <span className="text-xs text-[#6B7280] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {student.time}
                  </span>
                )}
                <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${student.status === 'Present'
                  ? 'text-[#10B981] bg-[#10B981]/10'
                  : 'text-[#EF4444] bg-[#EF4444]/10'
                  }`}>
                  {student.status === 'Present'
                    ? <CheckCircle className="w-3.5 h-3.5" />
                    : <XCircle className="w-3.5 h-3.5" />}
                  {student.status}
                </span>
              </div>
            </div>
          ))}

          {shown.length === 0 && (
            <div className="py-12 text-center text-[#6B7280] text-sm">No records found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Reports Page ────────────────────────────────────────────────────────

export const Reports = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [detail, setDetail] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportsAPI.getSessions();
      setSessions(data);
    } catch {
      setError('Could not load sessions. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const openDetail = async (sessionId: number) => {
    setDetailLoading(true);
    try {
      const data = await reportsAPI.getSessionDetail(sessionId);
      setDetail(data);
    } catch {
      // silent — keep modal closed
    } finally {
      setDetailLoading(false);
    }
  };

  // ── Aggregate stats ──────────────────────────────────────────────────────
  const totalSessions = sessions.length;
  const avgPresent =
    totalSessions > 0
      ? Math.round(sessions.reduce((s, r) => s + r.present, 0) / totalSessions)
      : 0;
  const avgRate =
    totalSessions > 0
      ? (sessions.reduce((s, r) => s + r.rate, 0) / totalSessions).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-[#E5E7EB] font-bold">Reports</h1>
          <p className="text-[#9CA3AF] mt-1">Session-based attendance analytics</p>
        </div>
        <Button variant="primary" leftIcon={<TrendingUp className="w-4 h-4" />} onClick={loadSessions}>
          Refresh
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: 'Total Sessions',
            value: totalSessions,
            icon: <Calendar className="w-6 h-6 text-[#4F46E5]" />,
            color: '#4F46E5'
          },
          {
            label: 'Avg. Present / Session',
            value: avgPresent,
            icon: <Users className="w-6 h-6 text-[#10B981]" />,
            color: '#10B981'
          },
          {
            label: 'Avg. Attendance Rate',
            value: `${avgRate}%`,
            icon: <TrendingUp className="w-6 h-6 text-[#4F46E5]" />,
            color: '#4F46E5'
          }
        ].map(({ label, value, icon, color }) => (
          <Card key={label} className="card-ui">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#9CA3AF]">{label}</p>
                <p className="text-3xl font-bold text-[#E5E7EB] mt-2 stat-number">{value}</p>
              </div>
              <div className="p-3 rounded-xl" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                {icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Sessions table */}
      <Card className="card-ui">
        <h3 className="text-lg font-semibold text-[#E5E7EB] mb-5 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#4F46E5]" /> Attendance Sessions
        </h3>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4F46E5]" />
          </div>
        ) : error ? (
          <div className="py-16 text-center space-y-2">
            <p className="text-[#EF4444] font-medium">{error}</p>
            <button onClick={loadSessions} className="text-sm text-[#4F46E5] hover:underline">
              Try again
            </button>
          </div>
        ) : sessions.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Calendar className="w-10 h-10 text-[#374151] mx-auto" />
            <p className="text-[#6B7280]">No sessions recorded yet.</p>
            <p className="text-[#4B5563] text-sm">Start an attendance session from the Live Attendance page.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Date', 'Present', 'Absent', 'Attendance Rate', 'Actions'].map(h => (
                    <th key={h} className="pb-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide pr-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sessions.map(session => (
                  <tr
                    key={session.session_id}
                    className="group transition hover:bg-white/[0.03]"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <td className="py-4 pr-4 font-medium text-[#E5E7EB]">{session.date}</td>
                    <td className="py-4 pr-4">
                      <span className="font-semibold text-[#10B981]">{session.present}</span>
                    </td>
                    <td className="py-4 pr-4">
                      <span className="font-semibold text-[#EF4444]">{session.absent}</span>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-white/10 max-w-[60px]">
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${session.rate}%`,
                              background: session.rate >= 75 ? '#10B981' : '#F59E0B'
                            }}
                          />
                        </div>
                        <span className="text-[#9CA3AF]">{session.rate}%</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openDetail(session.session_id)}
                          disabled={detailLoading}
                          className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-lg text-[#4F46E5] hover:bg-[#4F46E5]/10 transition disabled:opacity-50"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                        <button
                          onClick={() => reportsAPI.exportSession(session.session_id)}
                          className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-lg text-[#10B981] hover:bg-[#10B981]/10 transition"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Excel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Detail modal */}
      {detail && (
        <DetailModal
          detail={detail}
          onClose={() => setDetail(null)}
          onExport={() => reportsAPI.exportSession(detail.session_id)}
        />
      )}
    </div>
  );
};
