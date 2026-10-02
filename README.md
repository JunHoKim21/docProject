# 사내 업무망 문서·시트 협업 및 취합 자동화 플랫폼 (PoC)

인터넷망이 차단된 폐쇄망(Air-Gapped) 환경에서 동작하는 구글 스프레드시트 수준의 실시간 동시 편집 및 지침/서식 취합 자동화 플랫폼입니다.

---

## 🛠️ 기술 스택 (Tech Stack)

* **Frontend**: React 19, TypeScript, Vite, Univer Sheet Core (v1.0.3), SheetJS (XLSX), Lucide Icons
* **Backend**: Spring Boot 3.3.x, Java 17, Spring WebSocket (STOMP/SockJS)
* **Realtime Protocol**: STOMP over WebSocket (양방향 실시간 동기화)

---

## ✨ 핵심 기능 (Features)

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

## 🚀 로컬 실행 방법 (How to Run)

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
