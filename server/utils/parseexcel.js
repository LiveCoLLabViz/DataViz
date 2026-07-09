import xlsx from 'xlsx';
import fs from 'fs';

const parseExcel=(filePath)=>{
    const fileBuffer=fs.readFileSync(filePath);

    const workbook=xlsx.read(fileBuffer,{type:'buffer'});

    const firstSheetName=workbook.SheetNames[0];
    const worksheet=workbook.Sheets[firstSheetName];

    const rawData = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: null });

    let headerRowIndex = 0;
    for (let i = 0; i < Math.min(rawData.length, 10); i++) {
        const row = rawData[i];
        if (!row) continue;
        const filledCells = row.filter(cell => cell !== null && cell !== undefined && String(cell).trim() !== '');
        if (filledCells.length > 1) {
            headerRowIndex = i;
            break;
        }
    }

    const data=xlsx.utils.sheet_to_json(worksheet,{
        range: headerRowIndex,
        defval:null,
        raw:false,
    })

    const columns=data.length>0?Object.keys(data[0]):[]

    return {data,columns};
}

export default parseExcel;