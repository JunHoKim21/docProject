import React, { useState, useEffect, useRef, useCallback } from 'react';
import { UniverSheet } from './components/UniverSheet';
import type { UniverSheetHandle } from './components/UniverSheet';
import { HeaderBar } from './components/HeaderBar';
import { DiffTimeline } from './components/DiffTimeline';
import type { CellDiff, UserProfile } from './types/collab';
import { SAMPLE_USERS } from './types/collab';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import * as XLSX from 'xlsx';

const DOC_ID = 'workbook-guideline-2026';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(SAMPLE_USERS[1]); // 김인사 기본
  const [diffs, setDiffs] = useState<CellDiff[]>([]);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  const sheetRef = useRef<UniverSheetHandle>(null);
  const stompClientRef = useRef<Client | null>(null);

  // 1. 서버에 저장된 초기 상태 및 이력 복원 (새로고침 시 영속성 보장)
  useEffect(() => {
    fetch(`http://localhost:8080/api/sheet/${DOC_ID}/state`)
      .then((res) => (res.ok ? res.json() : null))
      .then((stateMap) => {
        if (stateMap && Object.keys(stateMap).length > 0) {
          console.log('[Server State] 저장된 셀 데이터 복원:', stateMap);
          setTimeout(() => {
            sheetRef.current?.loadState(stateMap);
          }, 400);
        }
      })
      .catch(() => console.log('[Server State] 초기 상태 로드'));

    fetch(`http://localhost:8080/api/sheet/${DOC_ID}/history`)
      .then((res) => (res.ok ? res.json() : []))
      .then((historyList) => {
        if (historyList && historyList.length > 0) {
          setDiffs(historyList);
        }
      })
      .catch(() => console.log('[History] 초기 이력 로드'));
  }, []);

  // 2. 백엔드 WebSocket(STOMP) 연동 - 양방향 실시간 동기화
  useEffect(() => {
    try {
      const client = new Client({
        webSocketFactory: () => new SockJS('http://localhost:8080/ws-sheet'),
        reconnectDelay: 5000,
        onConnect: () => {
          console.log('[STOMP] WebSocket 브로커 연결 완료');
          client.subscribe(`/topic/sheet/${DOC_ID}`, (message) => {
            if (message.body) {
              try {
                const incomingDiff: CellDiff = JSON.parse(message.body);

                // [핵심] 다른 창에서 온 셀 변경을 내 시트 셀에도 즉각 반영!
                sheetRef.current?.setRemoteCellValue(
                  incomingDiff.row,
                  incomingDiff.col,
                  incomingDiff.newValue
                );

                // 우측 사이드바 추가
                setDiffs((prev) => [
                  incomingDiff,
                  ...prev.filter(
                    (d) => !(d.cellRef === incomingDiff.cellRef && d.timestamp === incomingDiff.timestamp)
                  )
                ]);
              } catch (err) {
                console.error('[STOMP] 메시지 파싱 오류:', err);
              }
            }
          });
        },
        onStompError: (frame) => {
          console.warn('[STOMP] 백엔드 연결 대기:', frame.headers['message']);
        }
      });

      client.activate();
      stompClientRef.current = client;

      return () => {
        client.deactivate();
      };
    } catch (e) {
      console.warn('[STOMP] 초기화 실패');
    }
  }, []);

  // 3. 로컬에서 셀 수정 시 호출
  const handleCellDiff = useCallback((diff: CellDiff) => {
    setDiffs((prev) => [diff, ...prev]);

    if (stompClientRef.current && stompClientRef.current.connected) {
      try {
        stompClientRef.current.publish({
          destination: `/app/sheet/${diff.docId}/diff`,
          body: JSON.stringify(diff)
        });
      } catch (err) {
        console.error('[STOMP] 전송 오류:', err);
      }
    }
  }, []);

  const handleAlert = useCallback((msg: string) => {
    setAlertMsg(msg);
    setTimeout(() => {
      setAlertMsg(null);
    }, 4000);
  }, []);

  // 4. [Auto-Merge] 총괄담당자 원클릭 일괄 승인 엔진
  const handleBatchMerge = useCallback(() => {
    if (!sheetRef.current) return;

    // 시트의 1~7행 상태 열(Col G)을 '승인완료'로 일괄 변경
    const approvedList = sheetRef.current.batchApproveAll();

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    // 백엔드로 일괄 승인 브로드캐스트 (모든 브라우저 창 동시 반영)
    approvedList.forEach((item) => {
      const approvalDiff: CellDiff = {
        docId: DOC_ID,
        row: item.row,
        col: item.col,
        cellRef: item.cellRef,
        prevValue: '검토대기',
        newValue: '승인완료',
        updatedBy: currentUser.name,
        department: currentUser.department,
        reason: '총괄담당자 최종 승인 채택',
        timestamp: timeStr
      };

      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.publish({
          destination: `/app/sheet/${DOC_ID}/diff`,
          body: JSON.stringify(approvalDiff)
        });
      }
    });

    // 이력 패널에 최종 승인 이벤트 추가
    const summaryDiff: CellDiff = {
      docId: DOC_ID,
      row: 0,
      col: 6,
      cellRef: 'G열 전체',
      prevValue: '부서별 개정안',
      newValue: '전체 승인완료 (Auto-Merged)',
      updatedBy: currentUser.name,
      department: currentUser.department,
      reason: '2026년도 지침 개정안 최종 통합 확정',
      timestamp: timeStr
    };
    setDiffs((prev) => [summaryDiff, ...prev]);

    handleAlert('🎉 [Auto-Merge 완료] 전체 부서의 개정안이 마스터 지침에 최종 승인 반영되었습니다!');
  }, [currentUser, handleAlert]);

  // 5. [Export] 엑셀(.xlsx) 파일 생성 및 브라우저 다운로드
  const handleExportExcel = useCallback(() => {
    if (!sheetRef.current) return;

    const data = sheetRef.current.getSheetDataForExport();
    if (!data || data.length === 0) {
      alert('다운로드할 시트 데이터가 없습니다.');
      return;
    }

    try {
      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, '2026지침개정취합본');

      const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const filename = `2026년_사내업무지침_최종취합본_${today}.xlsx`;

      XLSX.writeFile(wb, filename);
      handleAlert(`📥 ${filename} 다운로드가 완료되었습니다.`);
    } catch (err) {
      console.error('[Export Error]', err);
      alert('엑셀 파일 생성 중 오류가 발생했습니다.');
    }
  }, [handleAlert]);

  // 6. [Rollback] 특정 셀 이전값으로 되돌리기
  const handleRollback = useCallback((diff: CellDiff) => {
    if (!sheetRef.current || !diff.prevValue || diff.prevValue === '(이전값)') return;

    sheetRef.current.rollbackCell(diff.row, diff.col, diff.prevValue);

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    const rollbackDiff: CellDiff = {
      docId: DOC_ID,
      row: diff.row,
      col: diff.col,
      cellRef: diff.cellRef,
      prevValue: diff.newValue,
      newValue: diff.prevValue,
      updatedBy: currentUser.name,
      department: currentUser.department,
      reason: `이전값으로 복원 (${diff.timestamp} 시점)`,
      timestamp: timeStr
    };

    handleCellDiff(rollbackDiff);
    handleAlert(`↩️ Cell ${diff.cellRef}이(가) 이전 값으로 복원되었습니다.`);
  }, [currentUser, handleCellDiff, handleAlert]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* 상단 헤더 */}
      <HeaderBar
        currentUser={currentUser}
        onUserChange={setCurrentUser}
        alertMsg={alertMsg}
        onExportExcel={handleExportExcel}
        diffCount={diffs.length}
      />

      {/* 중앙 메인 바디 */}
      <div style={{
        display: 'flex',
        flex: 1,
        width: '100%',
        height: 'calc(100vh - 60px)',
        overflow: 'hidden'
      }}>
        {/* 스프레드시트 에디터 영역 */}
        <main style={{ flex: 1, height: '100%', position: 'relative' }}>
          <UniverSheet
            ref={sheetRef}
            currentUser={currentUser}
            onCellDiff={handleCellDiff}
            onAlert={handleAlert}
          />
        </main>

        {/* 우측 실시간 Diff 이력 사이드바 */}
        <DiffTimeline
          diffs={diffs}
          currentUser={currentUser}
          onClearDiffs={() => setDiffs([])}
          onBatchMerge={handleBatchMerge}
          onRollback={handleRollback}
        />
      </div>
    </div>
  );
};

export default App;
