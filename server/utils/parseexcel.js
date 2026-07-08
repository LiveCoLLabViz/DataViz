import xlsx from 'xlsx';
import fs from 'fs';

const parseExcel=(filePath)=>{
    const fileBuffer=fs.readFileSync(filePath);

    const workbook=xlsx.read(fileBuffer,{type:'buffer'});

    const firstSheetName=workbook.SheetNames[0];
    const worksheet=workbook.Sheets[firstSheetName];

    const data=xlsx.utils.sheet_to_json(worksheet,{
        defval:null,
        raw:false,
    })

    const columns=data.length>0?Object.keys(data[0]):[]

    return {data,columns};
}

export default parseExcel;