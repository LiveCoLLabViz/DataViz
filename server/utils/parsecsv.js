import Papa from 'papaparse';
import fs from 'fs';

const parseCSV=(filePath)=>{
    return new Promise((resolve,reject)=>{
        let fileContent;

        try {
            fileContent = fs.readFileSync(filePath, 'utf8');
        } catch (error) {
            return reject(
                new Error(`Could not read file at path: ${filePath}`)
            )
        }

        Papa.parse(fileContent,{
            header:true,
            skipEmptyLines:true,
            dynamicTyping:true,

            complete:(results)=>{
                if(results.errors.length>0){
                    return reject(
                        new Error(`Error parsing CSV file: ${results.errors[0].message}`)
                    )
                }

                resolve({
                    data:results.data,
                    columns:results.meta.fields || [],
                })
            }

        })
    })
}

export default parseCSV;

//what is Promise in javascript?
// A Promise in JavaScript is an object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value. It allows you to write asynchronous code in a more synchronous fashion, making it easier to read and manage.
