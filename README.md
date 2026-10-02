# 사내 업무망 문서·시트 협업 및 취합 자동화 플랫폼 (PoC)

인터넷망이 차단된 폐쇄망(Air-Gapped) 환경에서 동작하는 구글 스프레드시트 수준의 실시간 동시 편집 및 지침/서식 취합 자동화 플랫폼입니다.

---

## 🛠️ 기술 스택 (Tech Stack)

* **Frontend**: React 19, TypeScript, Vite, Univer Sheet Core (v1.0.3), SheetJS (XLSX), Lucide Icons
* **Backend**: Spring Boot 3.3.x, Java 17, Spring WebSocket (STOMP/SockJS)
* **Realtime Protocol**: STOMP over WebSocket (양방향 실시간 동기화)

---

## ✨ 현재 구현 완료 기능 (As-Is: Phase 1 PoC)

1. **실시간 양방향 셀 동기화 (Real-time Sync)**:
   * 복수의 브라우저 창에서 셀 변경 시 0.1초 이내 실시간 상호 반영
2. **부서별 셀 영역 잠금 (ACL Permission Control)**:
   * 담당 부서의 허용 범위(Row) 외 셀 수정 시도시 경고 및 차단
3. **실시간 수정 이력 (Diff Engine)**:
   * 셀 수정 즉시 `[변경 전 ➔ 변경 후]` 값, 작성자, 부서, 타임스탬프 자동 캡처
4. **원클릭 자동 병합 (Auto-Merge Engine)**:
   * 총괄 관리자가 부서별 개정안을 확인 후 원클릭으로 취합 상태를 `승인완료`로 일괄 병합
5. **최종 취합본 엑셀(.xlsx) 다운로드 (Export)**:
   * 최신 취합 결과물을 실제 엑셀 파일로 브라우저에서 즉시 다운로드
6. **서버 메모리 영속화 (State Persistence)**:
   * 새로고침(`F5`) 시에도 수정 및 승인 내역이 사라지지 않고 자동 복원

---

## 🚀 향후 개발 로드맵 (To-Be)

실제 현업 부서 배포 및 전사 운영을 위해 추진할 단계별 개발 과제입니다.

### 📌 Phase 2: 실무 취합 업무 특화 MVP (예상 소요: 3주)

* [ ] **RDB 영속화 및 감사 추적 (Audit Trail)**
  * 인메모리 저장소 ➔ PostgreSQL / MariaDB 연동 (MyBatis / JPA)
  * `RFC 6902 JSON Patch` 규격 기반 변경 로그 테이블 적재 (누가, 언제, 어떤 셀을, 왜 변경했는지 영구 보존)
  * 특정 날짜/시간 시점으로 시트를 되돌리는 **타임머신 스냅샷 복원 기능**
* [ ] **동적 템플릿 배포 마법사 (Dynamic Template Builder)**
  * 기존 엑셀(.xlsx) 양식을 업로드하여 마스터 템플릿으로 자동 생성
  * 웹 UI에서 마우스 드래그로 **부서별 작성 허용 셀 범위(Range ACL)** 지정 및 배포
* [ ] **세부 승인/반려 워크플로우 (Fine-grained Review)**
  * 전체 일괄 승인 외에 **행/조항별 개별 승인 및 반려(코멘트 피드백)** 처리
  * 동일 셀 동시 수정 충돌 시 **3-Way Side-by-Side 비교 창**을 통한 담당자 채택(A안 vs B안)
* [ ] **취합 진행 현황 대시보드 (KPI Monitoring)**
  * 전사 30~50개 부서의 제출 현황(미작성, 작성중, 제출완료, 검토대기) 실시간 파이프라인 시각화
  * 마감일 기준 미제출 부서 자동 리마인더 알림 발송 연동

---

### 📌 Phase 3: 전사 엔터프라이즈 완성 및 폐쇄망 최적화 (예상 소요: 3~4주)

* [ ] **사내 계정(SSO) 및 조직도 결합**
  * 사내 Active Directory / OAuth2 / SAML 연동으로 로그인한 사용자의 실제 부서 및 권한 자동 매핑
  * 전자정부 표준프레임워크 및 Spring Security 기반 인가(RBAC) 체계 확립
* [ ] **대용량 동시접속 분산 인프라 (Redis Clustering)**
  * Redis Pub/Sub 클러스터링을 구축하여 다중 WAS 인스턴스 간 웹소켓 세션 분산
  * CRDT(Yjs) 심화 연동으로 일시적 네트워크 단절 후 재접속 시 무손실 자동 동기화(Convergence) 보장
* [ ] **문서 포맷 확장 (지침 본문 개정)**
  * 엑셀(스프레드시트) 외에 한글(.hwpx) 및 워드(.docx) 규정집 문장 개정(신구조문대비표 자동 생성) 에디터 확장
* [ ] **폐쇄망 오프라인 원클릭 배포 패키징**
  * 외부 인터넷 연결 없이 사내 업무망 서버에서 구동 가능한 Docker Compose 및 오프라인 설치 스크립트 작성
  * 보안 적합성 검토(정적 코드 분석 취약점 조치, 웹 방화벽 연동)

---

## 💻 로컬 실행 방법 (How to Run)

### 1. 백엔드 실행 (Spring Boot)
```bash
cd backend
./gradlew bootRun
```
* 서버 포트: `http://localhost:8080` (WebSocket 엔드포인트: `/ws-sheet`)

### 2. 프론트엔드 실행 (Vite + React)
```bash
cd frontend
npm install
npm run dev
```
* 웹 주소: `http://localhost:5173`
