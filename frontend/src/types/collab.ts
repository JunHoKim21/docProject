export interface CellDiff {
  docId: string;
  row: number;
  col: number;
  cellRef: string;
  prevValue: string;
  newValue: string;
  updatedBy: string;
  department: string;
  reason?: string;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  name: string;
  department: string;
  role: 'ADMIN' | 'EDITOR';
  allowedStartRow: number;
  allowedEndRow: number;
  color: string;
}

export const SAMPLE_USERS: UserProfile[] = [
  {
    id: 'user_admin',
    name: '총괄담당자 (기획예산팀)',
    department: '기획예산팀',
    role: 'ADMIN',
    allowedStartRow: 0,
    allowedEndRow: 999,
    color: '#2563eb'
  },
  {
    id: 'user_hr',
    name: '김인사 (인사지원팀)',
    department: '인사지원팀',
    role: 'EDITOR',
    allowedStartRow: 1, // 화면상 2~4행 (인사 관련 조항)
    allowedEndRow: 3,
    color: '#059669'
  },
  {
    id: 'user_ga',
    name: '이총무 (총무구매팀)',
    department: '총무구매팀',
    role: 'EDITOR',
    allowedStartRow: 4, // 화면상 5~6행 (총무 관련 조항)
    allowedEndRow: 5,
    color: '#d97706'
  },
  {
    id: 'user_it',
    name: '박정보 (정보보안팀)',
    department: '정보보안팀',
    role: 'EDITOR',
    allowedStartRow: 6, // 화면상 7~8행 (보안 관련 조항)
    allowedEndRow: 7,
    color: '#7c3aed'
  }
];
