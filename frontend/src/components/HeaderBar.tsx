import React from 'react';
import type { UserProfile } from '../types/collab';
import { SAMPLE_USERS } from '../types/collab';
import { FileSpreadsheet, Users, Wifi, AlertTriangle, Download } from 'lucide-react';

interface HeaderBarProps {
  currentUser: UserProfile;
  onUserChange: (user: UserProfile) => void;
  alertMsg: string | null;
  onExportExcel: () => void;
  diffCount: number;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  currentUser,
  onUserChange,
  alertMsg,
  onExportExcel,
  diffCount
}) => {
  return (
    <header style={{
      height: '60px',
      backgroundColor: '#1e293b',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      zIndex: 10
    }}>
      {/* 좌측: 로고 및 문서명 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          backgroundColor: '#10b981',
          padding: '6px',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <FileSpreadsheet size={20} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
              2026년도 사내 업무 지침 개정 및 예산 취합표
            </h1>
            <span style={{
              backgroundColor: '#334155',
              fontSize: '11px',
              padding: '2px 6px',
              borderRadius: '4px',
              color: '#94a3b8'
            }}>
              PoC 완성본
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
            실시간 양방향 동기화 • 부서별 ACL 제어 • 자동 병합 엔진 가동 중
          </div>
        </div>
      </div>

      {/* 중앙: 실시간 차단/알림 배너 */}
      {alertMsg && (
        <div style={{
          backgroundColor: '#b91c1c',
          color: '#fee2e2',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          animation: 'pulse 1.5s infinite'
        }}>
          <AlertTriangle size={15} />
          {alertMsg}
        </div>
      )}

      {/* 우측: 엑셀 다운로드 버튼, 사용자 전환 드롭다운 & 상태 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* 최종 엑셀 다운로드 버튼 */}
        <button
          onClick={onExportExcel}
          style={{
            backgroundColor: '#059669',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#047857')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
        >
          <Download size={15} />
          최종 취합본 다운로드 (.xlsx)
        </button>

        {/* 누적 변경 이력 뱃지 */}
        <div style={{
          backgroundColor: '#334155',
          padding: '4px 10px',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#cbd5e1'
        }}>
          누적 변경: <strong style={{ color: '#60a5fa' }}>{diffCount}건</strong>
        </div>

        {/* 연결 상태 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          color: '#4ade80'
        }}>
          <Wifi size={14} />
          <span>사내망 연결</span>
        </div>

        {/* 사용자 역할 스위처 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#334155',
          padding: '4px 10px',
          borderRadius: '8px'
        }}>
          <Users size={16} color="#94a3b8" />
          <span style={{ fontSize: '12px', color: '#cbd5e1' }}>접속자:</span>
          <select
            value={currentUser.id}
            onChange={(e) => {
              const selected = SAMPLE_USERS.find(u => u.id === e.target.value);
              if (selected) onUserChange(selected);
            }}
            style={{
              backgroundColor: '#1e293b',
              color: '#f8fafc',
              border: '1px solid #475569',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {SAMPLE_USERS.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role === 'ADMIN' ? '총괄' : '부서작성자'})
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};
