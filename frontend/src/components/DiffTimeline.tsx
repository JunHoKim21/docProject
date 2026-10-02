import React from 'react';
import type { CellDiff, UserProfile } from '../types/collab';
import { History, CheckCircle2, Clock, ArrowRight, UserCheck, RotateCcw } from 'lucide-react';

interface DiffTimelineProps {
  diffs: CellDiff[];
  currentUser: UserProfile;
  onClearDiffs: () => void;
  onBatchMerge: () => void;
  onRollback: (diff: CellDiff) => void;
}

export const DiffTimeline: React.FC<DiffTimelineProps> = ({
  diffs,
  currentUser,
  onClearDiffs,
  onBatchMerge,
  onRollback
}) => {
  return (
    <aside style={{
      width: '360px',
      backgroundColor: '#ffffff',
      borderLeft: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      boxShadow: '-2px 0 8px rgba(0,0,0,0.03)'
    }}>
      {/* 헤더 */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <History size={18} color="#2563eb" />
          <h2 style={{ fontSize: '15px', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>
            실시간 수정 이력 (Diff)
          </h2>
        </div>
        <span style={{
          backgroundColor: '#eff6ff',
          color: '#2563eb',
          fontSize: '12px',
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: '12px'
        }}>
          {diffs.length}건 누적
        </span>
      </div>

      {/* 총괄 관리자 액션 패널 */}
      {currentUser.role === 'ADMIN' ? (
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#eff6ff',
          borderBottom: '1px solid #dbeafe',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#1e40af', fontWeight: 600 }}>
              총괄 관리자 전용 대시보드
            </span>
            <span style={{ fontSize: '11px', color: '#3b82f6' }}>자동 병합(Auto-Merge)</span>
          </div>
          <button
            onClick={onBatchMerge}
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'background-color 0.2s',
              boxShadow: '0 2px 4px rgba(37,99,235,0.2)'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
          >
            <CheckCircle2 size={16} />
            전체 부서 수정안 일괄 승인 (Auto-Merge)
          </button>
        </div>
      ) : (
        <div style={{
          padding: '10px 16px',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          fontSize: '12px',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <UserCheck size={15} color={currentUser.color} />
          <span>내 권한: <strong>{currentUser.department}</strong> (Row {currentUser.allowedStartRow + 1}~{currentUser.allowedEndRow + 1})</span>
        </div>
      )}

      {/* 이력 리스트 */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {diffs.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 10px',
            color: '#94a3b8',
            fontSize: '13px'
          }}>
            <Clock size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            시트의 셀을 클릭하여 내용을 변경해보세요.<br />
            실시간 변경 전후 내역이 여기에 기록됩니다.
          </div>
        ) : (
          diffs.map((diff, index) => {
            const dept = diff.department || '';
            const badgeColor = dept.includes('인사') ? '#059669' : dept.includes('총무') ? '#d97706' : '#2563eb';

            return (
              <div
                key={index}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '12px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}
              >
                {/* 상단: 셀 위치 및 시간 & 되돌리기 버튼 */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <span style={{
                    backgroundColor: '#f1f5f9',
                    color: '#0f172a',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    Cell {diff.cellRef}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                      {diff.timestamp}
                    </span>
                    {/* 되돌리기 버튼 */}
                    {diff.prevValue && diff.prevValue !== '(이전값)' && (
                      <button
                        onClick={() => onRollback(diff)}
                        title="이전 값으로 되돌리기"
                        style={{
                          backgroundColor: '#f1f5f9',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '2px 5px',
                          fontSize: '11px',
                          color: '#475569',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px'
                        }}
                      >
                        <RotateCcw size={11} />
                        복원
                      </button>
                    )}
                  </div>
                </div>

                {/* 작성자 정보 */}
                <div style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#334155',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: badgeColor
                  }} />
                  {diff.updatedBy}
                </div>

                {/* 변경 전 -> 변경 후 Diff */}
                <div style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px',
                  padding: '8px',
                  fontSize: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <div style={{ color: '#ef4444', textDecoration: 'line-through', fontSize: '11px' }}>
                    {diff.prevValue || '(공란)'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: 600 }}>
                    <ArrowRight size={12} color="#10b981" />
                    <span>{diff.newValue}</span>
                  </div>
                </div>

                {/* 개정 사유 */}
                {diff.reason && (
                  <div style={{
                    marginTop: '6px',
                    fontSize: '11px',
                    color: '#64748b',
                    fontStyle: 'italic'
                  }}>
                    사유: {diff.reason}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 하단 클리어 버튼 */}
      {diffs.length > 0 && (
        <div style={{ padding: '10px 16px', borderTop: '1px solid #f1f5f9', textAlign: 'right' }}>
          <button
            onClick={onClearDiffs}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              fontSize: '11px',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            이력 화면 비우기
          </button>
        </div>
      )}
    </aside>
  );
};
