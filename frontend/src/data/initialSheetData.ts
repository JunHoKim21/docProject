import { LocaleType, BooleanNumber } from '@univerjs/core';
import type { IWorkbookData } from '@univerjs/core';

export const INITIAL_WORKBOOK_DATA: IWorkbookData = {
  id: 'workbook-guideline-2026',
  name: '2026년도 사내 업무 지침 개정 및 예산 취합표',
  appVersion: '3.0.0-alpha',
  locale: LocaleType.KO_KR,
  sheetOrder: ['sheet-main'],
  styles: {},
  sheets: {
    'sheet-main': {
      id: 'sheet-main',
      name: '2026 지침 개정 취합',
      rowCount: 30,
      columnCount: 8,
      defaultColumnWidth: 160,
      defaultRowHeight: 32,
      columnData: {
        0: { w: 60 },   // 연번
        1: { w: 120 },  // 담당부서
        2: { w: 180 },  // 규정/항목
        3: { w: 260 },  // 2025 현행 기준
        4: { w: 260 },  // 2026 개정(제안)안 [편집대상]
        5: { w: 220 },  // 개정 사유 [편집대상]
        6: { w: 110 },  // 상태
        7: { w: 150 }   // 최종수정자
      },
      cellData: {
        0: {
          0: { v: '연번', s: { bl: BooleanNumber.TRUE, bg: { rgb: '#f1f5f9' }, ht: 2, vt: 2 } },
          1: { v: '담당부서', s: { bl: BooleanNumber.TRUE, bg: { rgb: '#f1f5f9' }, ht: 2, vt: 2 } },
          2: { v: '규정/항목', s: { bl: BooleanNumber.TRUE, bg: { rgb: '#f1f5f9' }, ht: 2, vt: 2 } },
          3: { v: '2025 현행 기준', s: { bl: BooleanNumber.TRUE, bg: { rgb: '#f1f5f9' }, ht: 2, vt: 2 } },
          4: { v: '2026 개정 제안안 (수정가능)', s: { bl: BooleanNumber.TRUE, bg: { rgb: '#e0e7ff' }, cl: { rgb: '#1e40af' }, ht: 2, vt: 2 } },
          5: { v: '개정 사유', s: { bl: BooleanNumber.TRUE, bg: { rgb: '#e0e7ff' }, cl: { rgb: '#1e40af' }, ht: 2, vt: 2 } },
          6: { v: '취합 상태', s: { bl: BooleanNumber.TRUE, bg: { rgb: '#f1f5f9' }, ht: 2, vt: 2 } },
          7: { v: '최종 수정 정보', s: { bl: BooleanNumber.TRUE, bg: { rgb: '#f1f5f9' }, ht: 2, vt: 2 } }
        },
        // [인사지원팀 영역: Row 1 ~ 3]
        1: {
          0: { v: '1', s: { ht: 2, vt: 2 } },
          1: { v: '인사지원팀', s: { bl: BooleanNumber.TRUE, cl: { rgb: '#059669' }, ht: 2, vt: 2 } },
          2: { v: '제12조(원격근무 신청)', s: { vt: 2 } },
          3: { v: '월 최대 2회 신청 가능 (사전 3일 전 결재)', s: { vt: 2 } },
          4: { v: '주 최대 2회 신청 가능 (부서장 승인 즉시)', s: { bg: { rgb: '#f0fdf4' }, vt: 2 } },
          5: { v: '유연근무 확대 및 현업 생산성 제고', s: { bg: { rgb: '#f0fdf4' }, vt: 2 } },
          6: { v: '제안완료', s: { cl: { rgb: '#059669' }, bl: BooleanNumber.TRUE, ht: 2, vt: 2 } },
          7: { v: '김인사 (10:15)', s: { ht: 2, vt: 2 } }
        },
        2: {
          0: { v: '2', s: { ht: 2, vt: 2 } },
          1: { v: '인사지원팀', s: { bl: BooleanNumber.TRUE, cl: { rgb: '#059669' }, ht: 2, vt: 2 } },
          2: { v: '제18조(야간 교통비 지원)', s: { vt: 2 } },
          3: { v: '23시 이후 퇴근 시 실비 정산 (상한 30,000원)', s: { vt: 2 } },
          4: { v: '22시 이후 퇴근 시 실비 정산 (상한 40,000원)', s: { bg: { rgb: '#f0fdf4' }, vt: 2 } },
          5: { v: '심야 택시 요금 인상분 반영', s: { bg: { rgb: '#f0fdf4' }, vt: 2 } },
          6: { v: '제안완료', s: { cl: { rgb: '#059669' }, bl: BooleanNumber.TRUE, ht: 2, vt: 2 } },
          7: { v: '김인사 (10:18)', s: { ht: 2, vt: 2 } }
        },
        3: {
          0: { v: '3', s: { ht: 2, vt: 2 } },
          1: { v: '인사지원팀', s: { bl: BooleanNumber.TRUE, cl: { rgb: '#059669' }, ht: 2, vt: 2 } },
          2: { v: '제25조(경조사 휴가 일수)', s: { vt: 2 } },
          3: { v: '본인 결혼 5일, 부모 환갑 1일', s: { vt: 2 } },
          4: { v: '본인 결혼 7일, 부모 칠순 1일', s: { bg: { rgb: '#f0fdf4' }, vt: 2 } },
          5: { v: '복지 기준 개정', s: { bg: { rgb: '#f0fdf4' }, vt: 2 } },
          6: { v: '검토대기', s: { cl: { rgb: '#d97706' }, bl: BooleanNumber.TRUE, ht: 2, vt: 2 } },
          7: { v: '김인사 (10:22)', s: { ht: 2, vt: 2 } }
        },
        // [총무구매팀 영역: Row 4 ~ 5]
        4: {
          0: { v: '4', s: { ht: 2, vt: 2 } },
          1: { v: '총무구매팀', s: { bl: BooleanNumber.TRUE, cl: { rgb: '#d97706' }, ht: 2, vt: 2 } },
          2: { v: '제31조(법인차량 배차)', s: { vt: 2 } },
          3: { v: '이용 전일 17시까지 시스템 예약 필수', s: { vt: 2 } },
          4: { v: '이용 당일 2시간 전 모바일 즉시 배차 가능', s: { bg: { rgb: '#fffbeb' }, vt: 2 } },
          5: { v: '긴급 출장 대응 편의성 강화', s: { bg: { rgb: '#fffbeb' }, vt: 2 } },
          6: { v: '작성중', s: { cl: { rgb: '#64748b' }, ht: 2, vt: 2 } },
          7: { v: '이총무 (09:40)', s: { ht: 2, vt: 2 } }
        },
        5: {
          0: { v: '5', s: { ht: 2, vt: 2 } },
          1: { v: '총무구매팀', s: { bl: BooleanNumber.TRUE, cl: { rgb: '#d97706' }, ht: 2, vt: 2 } },
          2: { v: '제35조(소모품 구매 전결)', s: { vt: 2 } },
          3: { v: '건당 50만원 미만 팀장 전결', s: { vt: 2 } },
          4: { v: '건당 100만원 미만 팀장 전결', s: { bg: { rgb: '#fffbeb' }, vt: 2 } },
          5: { v: '물가상승 및 결재선 간소화', s: { bg: { rgb: '#fffbeb' }, vt: 2 } },
          6: { v: '작성중', s: { cl: { rgb: '#64748b' }, ht: 2, vt: 2 } },
          7: { v: '이총무 (09:45)', s: { ht: 2, vt: 2 } }
        },
        // [정보보안팀 영역: Row 6 ~ 7]
        6: {
          0: { v: '6', s: { ht: 2, vt: 2 } },
          1: { v: '정보보안팀', s: { bl: BooleanNumber.TRUE, cl: { rgb: '#7c3aed' }, ht: 2, vt: 2 } },
          2: { v: '제40조(사외망 재택 접속)', s: { vt: 2 } },
          3: { v: 'ID/PW + SMS 인증', s: { vt: 2 } },
          4: { v: 'FIDO2 생체인증 또는 모바일 OTP 의무화', s: { bg: { rgb: '#f5f3ff' }, vt: 2 } },
          5: { v: '금융보안원 보안 감사 권고사항 이행', s: { bg: { rgb: '#f5f3ff' }, vt: 2 } },
          6: { v: '제안완료', s: { cl: { rgb: '#059669' }, bl: BooleanNumber.TRUE, ht: 2, vt: 2 } },
          7: { v: '박정보 (11:05)', s: { ht: 2, vt: 2 } }
        },
        7: {
          0: { v: '7', s: { ht: 2, vt: 2 } },
          1: { v: '정보보안팀', s: { bl: BooleanNumber.TRUE, cl: { rgb: '#7c3aed' }, ht: 2, vt: 2 } },
          2: { v: '제44조(사내 PC 매체제어)', s: { vt: 2 } },
          3: { v: '인가된 보안 USB만 읽기/쓰기 허용', s: { vt: 2 } },
          4: { v: '보안 USB 쓰기 전면 차단 (망연계망 사용)', s: { bg: { rgb: '#f5f3ff' }, vt: 2 } },
          5: { v: '기술자료 유출 방지 강화', s: { bg: { rgb: '#f5f3ff' }, vt: 2 } },
          6: { v: '검토대기', s: { cl: { rgb: '#d97706' }, bl: BooleanNumber.TRUE, ht: 2, vt: 2 } },
          7: { v: '박정보 (11:10)', s: { ht: 2, vt: 2 } }
        }
      }
    }
  }
};
