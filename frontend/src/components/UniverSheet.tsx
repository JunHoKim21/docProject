import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import '@univerjs/preset-sheets-core/lib/index.css';

import { createUniver, LocaleType, mergeLocales } from '@univerjs/presets';
import { UniverSheetsCorePreset } from '@univerjs/preset-sheets-core';
import UniverPresetSheetsCoreKoKR from '@univerjs/preset-sheets-core/locales/ko-KR';
import { ICommandService } from '@univerjs/core';
import type { FUniver } from '@univerjs/core/facade';

import { INITIAL_WORKBOOK_DATA } from '../data/initialSheetData';
import type { CellDiff, UserProfile } from '../types/collab';

export interface ApprovedCell {
  row: number;
  col: number;
  cellRef: string;
  value: string;
}

export interface UniverSheetHandle {
  setRemoteCellValue: (row: number, col: number, value: string) => void;
  loadState: (stateMap: Record<string, string>) => void;
  batchApproveAll: () => ApprovedCell[];
  rollbackCell: (row: number, col: number, value: string) => void;
  getSheetDataForExport: () => (string | number)[][];
}

interface UniverSheetProps {
  currentUser: UserProfile;
  onCellDiff: (diff: CellDiff) => void;
  onAlert: (msg: string) => void;
}

export const UniverSheet = forwardRef<UniverSheetHandle, UniverSheetProps>(({
  currentUser,
  onCellDiff,
  onAlert
}, ref) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<UserProfile>(currentUser);
  const univerAPIRef = useRef<FUniver | null>(null);
  const isRemoteUpdateRef = useRef<boolean>(false);

  // 최신 사용자 상태 유지
  useEffect(() => {
    userRef.current = currentUser;
  }, [currentUser]);

  // 부모(App)에서 호출 가능한 통합 인터페이스
  useImperativeHandle(ref, () => ({
    // 1. 원격에서 온 셀 변경 반영
    setRemoteCellValue: (row: number, col: number, value: string) => {
      const api = univerAPIRef.current;
      if (!api) return;

      try {
        const workbook = api.getActiveWorkbook();
        const sheet = workbook?.getActiveSheet();
        if (sheet) {
          isRemoteUpdateRef.current = true;
          sheet.getRange(row, col).setValue(value);
          setTimeout(() => {
            isRemoteUpdateRef.current = false;
          }, 100);
        }
      } catch (err) {
        console.error('[Remote Sync] 셀 업데이트 오류:', err);
      }
    },

    // 2. 서버 저장 상태 일괄 복원
    loadState: (stateMap: Record<string, string>) => {
      const api = univerAPIRef.current;
      if (!api || !stateMap) return;

      try {
        const workbook = api.getActiveWorkbook();
        const sheet = workbook?.getActiveSheet();
        if (sheet) {
          isRemoteUpdateRef.current = true;
          Object.entries(stateMap).forEach(([cellRef, value]) => {
            try {
              sheet.getRange(cellRef).setValue(value);
            } catch (e) {
              // 개별 셀 에러 무시
            }
          });
          setTimeout(() => {
            isRemoteUpdateRef.current = false;
          }, 200);
        }
      } catch (err) {
        console.error('[State Restore] 서버 상태 복원 오류:', err);
      }
    },

    // 3. [핵심] 전체 부서 수정안 일괄 승인 (Auto-Merge)
    batchApproveAll: () => {
      const api = univerAPIRef.current;
      if (!api) return [];

      const approvedCells: ApprovedCell[] = [];
      try {
        const workbook = api.getActiveWorkbook();
        const sheet = workbook?.getActiveSheet();
        if (sheet) {
          isRemoteUpdateRef.current = true;
          // Row 1 ~ 7에 대해 취합 상태(Column G = index 6)를 '승인완료'로 일괄 변경
          for (let r = 1; r <= 7; r++) {
            sheet.getRange(r, 6).setValue('승인완료');
            approvedCells.push({
              row: r,
              col: 6,
              cellRef: `G${r + 1}`,
              value: '승인완료'
            });
          }
          setTimeout(() => {
            isRemoteUpdateRef.current = false;
          }, 200);
        }
      } catch (err) {
        console.error('[Auto-Merge] 일괄 승인 오류:', err);
      }
      return approvedCells;
    },

    // 4. 특정 셀 이전값으로 롤백(되돌리기)
    rollbackCell: (row: number, col: number, value: string) => {
      const api = univerAPIRef.current;
      if (!api) return;

      try {
        const workbook = api.getActiveWorkbook();
        const sheet = workbook?.getActiveSheet();
        if (sheet) {
          isRemoteUpdateRef.current = true;
          sheet.getRange(row, col).setValue(value);
          setTimeout(() => {
            isRemoteUpdateRef.current = false;
          }, 100);
        }
      } catch (err) {
        console.error('[Rollback] 되돌리기 오류:', err);
      }
    },

    // 5. 엑셀 다운로드용 2차원 데이터 추출
    getSheetDataForExport: () => {
      const api = univerAPIRef.current;
      if (!api) return [];

      try {
        const workbook = api.getActiveWorkbook();
        const sheet = workbook?.getActiveSheet();
        if (sheet) {
          // 0~7행, 0~7열 범위 데이터 추출
          const rawValues = sheet.getRange(0, 0, 8, 8).getValues();
          return rawValues.map((row) =>
            row.map((cell) => (cell !== null && cell !== undefined ? String(cell) : ''))
          );
        }
      } catch (err) {
        console.error('[Export] 엑셀 데이터 추출 오류:', err);
      }
      return [];
    }
  }));

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Univer 전용 렌더링 컨테이너
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '100%';
    host.appendChild(container);

    // 1. 공식 Univer Preset 초기화
    const { univer, univerAPI } = createUniver({
      locale: LocaleType.KO_KR,
      locales: {
        [LocaleType.KO_KR]: mergeLocales(UniverPresetSheetsCoreKoKR)
      },
      presets: [
        UniverSheetsCorePreset({
          container
        })
      ]
    });
    univerAPIRef.current = univerAPI;

    // 2. 2026 지침 취합 워크북 로드
    univerAPI.createWorkbook(INITIAL_WORKBOOK_DATA);

    // 3. 셀 변경 감지 및 Hook
    const injector = univer.__getInjector();
    const commandService = injector.get(ICommandService);

    const disposable = commandService.onCommandExecuted((commandInfo) => {
      // 원격 동기화나 일괄 승인 시 발생하는 변경은 재전송 방지
      if (isRemoteUpdateRef.current) return;

      if (commandInfo.id.includes('set-range-values')) {
        const params = commandInfo.params as any;
        if (!params || !params.cellValue) return;

        const curr = userRef.current;
        const cellMatrix = params.cellValue;

        Object.keys(cellMatrix).forEach((rowKey) => {
          const row = parseInt(rowKey, 10);
          const cols = cellMatrix[rowKey];

          // [ACL 검증] 부서별 작성 권한 검증
          if (curr.role !== 'ADMIN' && (row < curr.allowedStartRow || row > curr.allowedEndRow)) {
            onAlert(`⚠️ [수정 차단] ${curr.department}은(는) Row ${curr.allowedStartRow + 1}~${curr.allowedEndRow + 1} 영역만 수정 권한이 있습니다.`);
            return;
          }

          Object.keys(cols).forEach((colKey) => {
            const col = parseInt(colKey, 10);
            const cell = cols[colKey];
            const newVal = cell?.v !== undefined ? String(cell.v) : (cell?.p?.body?.dataStream || '');
            
            const colLetter = String.fromCharCode(65 + col);
            const cellRef = `${colLetter}${row + 1}`;

            const now = new Date();
            const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

            const diff: CellDiff = {
              docId: 'workbook-guideline-2026',
              row,
              col,
              cellRef,
              prevValue: '(이전값)',
              newValue: newVal,
              updatedBy: curr.name,
              department: curr.department,
              reason: '2026년도 지침 개정 반영',
              timestamp: timeStr
            };

            onCellDiff(diff);
          });
        });
      }
    });

    return () => {
      disposable.dispose();
      univer.dispose();
      container.remove();
      univerAPIRef.current = null;
    };
  }, []);

  return (
    <div 
      ref={hostRef} 
      id="univer-sheet-host"
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden'
      }} 
    />
  );
});

UniverSheet.displayName = 'UniverSheet';
