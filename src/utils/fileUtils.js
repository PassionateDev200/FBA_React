import * as XLSX from "xlsx";

// Parse Excel/CSV file, return { skus: [...], totalBoxes }
export async function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: "binary" });
        const sheetNames = workbook.SheetNames;

        if (sheetNames.length < 2) {
          // Expect at least an instruction/cover sheet and the main data sheet
          reject(
            new Error(
              "Invalid Excel file: Expected at least 2 sheets for processing."
            )
          );
          return;
        }

        const instructionSheet = workbook.Sheets[sheetNames[0]];
        const mainDataSheet = workbook.Sheets[sheetNames[1]];
        // Metadata sheet is optional, typically the third sheet
        const metadataSheet =
          sheetNames.length > 2 ? workbook.Sheets[sheetNames[2]] : null;

        // Convert sheets to JSON (array of arrays) for storage and later reconstruction
        // Using defval: "" to ensure empty cells are represented, helps in reconstruction
        const instructionData = instructionSheet
          ? XLSX.utils.sheet_to_json(instructionSheet, {
              header: 1,
              defval: "",
            })
          : null;
        const mainJson = XLSX.utils.sheet_to_json(mainDataSheet, {
          header: 1,
          defval: "",
        });
        const metadataData = metadataSheet
          ? XLSX.utils.sheet_to_json(metadataSheet, { header: 1, defval: "" })
          : null;
        console.log("Parsed main data sheet (json):", mainJson);

        resolve({
          mainJson,
          originalSheetData: {
            // Store data for instruction and metadata sheets
            instruction: instructionData
              ? { name: sheetNames[0], data: instructionData }
              : null,
            metadata: metadataData
              ? { name: sheetNames[2] || "Metadata", data: metadataData }
              : null,
          },
        });
      } catch (err) {
        console.error("Error parsing Excel file:", err);
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsBinaryString(file);
  });
}

export function exportAmazonFormat(assignments, importData) {
  let nullnum = [];
  let box_merge_num = 0;
  let max = assignments.mainJson.length;

  const wb = XLSX.utils.book_new();
  const ws_data = [];

  // 1. Add Instruction Sheet (if available from original import)
  if (importData?.originalSheetData?.instruction?.data) {
    const ws_instruction = XLSX.utils.aoa_to_sheet(
      importData.originalSheetData.instruction.data
    );
    XLSX.utils.book_append_sheet(
      wb,
      ws_instruction,
      importData.originalSheetData.instruction.name || "Instructions"
    );
  }

  // 2. Create and Add BoxSummary Sheet (your main output)

  for (let i = 0; i < max; i++) {
    if (assignments.mainJson[i][0] === "") {
      nullnum.push(i);
    }
    ws_data.push(assignments.mainJson[i]);
  }

  box_merge_num = nullnum[1];

  const ws = XLSX.utils.aoa_to_sheet(ws_data);

  ws["!merges"] = [];
  for (let i = 0; i < max; i++) {
    if (0 === i) {
      ws["!merges"].push({
        s: { r: i, c: 0 }, // Start at column A
        e: { r: i, c: 11 }, // End at column C
      });
    } else if (1 === i) {
      ws["!merges"].push({
        s: { r: i, c: 0 }, // Start at column A
        e: { r: i, c: 1 }, // End at column C
      });
    } else if (2 === i) {
      ws["!merges"].push({
        s: { r: i, c: 0 }, // Start at column A
        e: { r: i, c: 2 }, // End at column C
      });
      ws["!merges"].push({
        s: { r: i, c: 8 }, // Start at column A
        e: { r: i, c: 11 }, // End at column C
      });
    } else if (box_merge_num === i) {
      for (let j = 1; j <= 5; j++) {
        ws["!merges"].push({
          s: { r: i + j, c: 0 }, // Start at column A
          e: { r: i + j, c: 11 }, // End at column C
        });
      }
    }
  }
  XLSX.utils.book_append_sheet(wb, ws, "Box packing information");

  // 3. Add Metadata Sheet (if available from original import)
  if (importData?.originalSheetData?.metadata?.data) {
    const ws_metadata = XLSX.utils.aoa_to_sheet(
      importData.originalSheetData.metadata.data
    );
    XLSX.utils.book_append_sheet(
      wb,
      ws_metadata,
      importData.originalSheetData.metadata.name || "Metadata"
    );
  }

  XLSX.writeFile(wb, "FBA_with_details.xlsx"); // Changed filename
}

export function exportBoxSummary(assignments) {
  const wb = XLSX.utils.book_new();
  let max = assignments.mainJson.length;
  let nullnum = [];
  for (let i = 0; i < max; i++) {
    if (assignments.mainJson[i][0] === "") {
      nullnum.push(i);
    }
  }

}
