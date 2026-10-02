package com.example.sheetpoc.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CellDiffMessage {
    private String docId;
    private Integer row;
    private Integer col;
    private String cellRef;
    private String prevValue;
    private String newValue;
    private String updatedBy;
    private String department;
    private String reason;
    private String timestamp;
}
