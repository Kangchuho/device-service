/*
  query-util.js
  post: body, get: query 각 요청에 따른 query문자열을 생성하여
  martCode에 적합한 martDB connection을 찾아서 쿼리를 수행하는 모듈입니다.

  1. 완성된 query 문장을 실행합니다.
  2. params 조합의 query 문장을 조립하는 기능이 필요합니다.
  todo: queryExec Error:  Timeout: Request failed to complete in 15000ms 1.5초내 응답을 못하면.. 타임아웃..
  
*/
import { getActivePool } from "./db-util";

async function queryExec(martCode, query) {
  try {
    const currentPool = await getActivePool(martCode);  
    const result = await currentPool.request().query(query);
    return result.recordsets;      
  } catch (error) {
    console.info('queryExec Error: ',  error.message); 
  }
}

export {
  queryExec  

}