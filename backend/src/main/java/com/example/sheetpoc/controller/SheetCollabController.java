package com.example.sheetpoc.controller;

import com.example.sheetpoc.dto.CellDiffMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Slf4j
@RestController
@CrossOrigin(origins = "*")
public class SheetCollabController {

    // 1. 수정 이력 로그 버퍼
    private final List<CellDiffMessage> historyList = new CopyOnWriteArrayList<>();

    // 2. 문서별 현재 셀 최종 상태 저장소 (DocId -> (CellRef -> Value)) - 새로고침 시 저장 유지
    private final Map<String, Map<String, String>> documentStateMap = new ConcurrentHashMap<>();

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @MessageMapping("/sheet/{docId}/diff")
    @SendTo("/topic/sheet/{docId}")
    public CellDiffMessage broadcastCellChange(@DestinationVariable String docId, CellDiffMessage message) {
        if (message.getTimestamp() == null || message.getTimestamp().isBlank()) {
            message.setTimestamp(LocalDateTime.now().format(FORMATTER));
        }

        log.info("[Cell Diff Intercepted] Doc: {}, Cell: {}, Old: '{}' -> New: '{}', User: '{}', Dept: '{}'",
                docId, message.getCellRef(), message.getPrevValue(), message.getNewValue(), message.getUpdatedBy(), message.getDepartment());

        // [영속화] 최신 셀 값 서버 메모리에 저장
        documentStateMap
                .computeIfAbsent(docId, k -> new ConcurrentHashMap<>())
                .put(message.getCellRef(), message.getNewValue() != null ? message.getNewValue() : "");

        // 이력 추가
        historyList.add(0, message);
        if (historyList.size() > 200) {
            historyList.remove(historyList.size() - 1);
        }

        return message;
    }

    // 문서의 현재 저장된 모든 셀 상태 반환 (새로고침 시 복원용)
    @GetMapping("/api/sheet/{docId}/state")
    public Map<String, String> getSheetState(@PathVariable String docId) {
        return documentStateMap.getOrDefault(docId, Map.of());
    }

    // 최근 이력 목록 조회
    @GetMapping("/api/sheet/{docId}/history")
    public List<CellDiffMessage> getSheetHistory(@PathVariable String docId) {
        return historyList.stream()
                .filter(m -> docId.equals(m.getDocId()))
                .toList();
    }
}
