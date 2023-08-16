import { queryExec } from '../../../../lib/query-util'
import { delay } from '../../../../lib/util';
/*
    * api/mart/ExecQuery.js
    * martDB DB처리
    * api/mart/ExecQuery
    *  
    * request - post 
    *   martCode : 마트코드
    *   query : 쿼리본문
    *   params : 파라메터 배열
    * response
    *  요청한 쿼리에 따라 각기 다른정보를 리턴
    * { 
    *   code : 0, message : success,
    *   code : 100, message : DB접속 오류가 발생했습니다. 
    *   data : [{...}]
    * }
    * 
    * 오류처리 : 직접처리 - 파라메터오류(누락[null],파싱오류,숫자변환오류)
    * DB오류처리 : 해당모듈에서 오류를 받아서 넘겨준다.

    todo: 다양한 조건의 query 문장을 조립할 수 있도록 문장, 파라메터 조합을 구성한다. 타입구분도 필요하다.
    qryObj : {
        martCode: 1000,
        query : 'select * from userinfo where name={0} and type={1} and somedate={2}',
        params : ['이름', 22, '2022-11-11']
    }
*/ 
async function handler(req, res) {
    if (req.method === 'POST') {
        let { martCode, query, params, mode } = req.body;
        if(!query) { 
            query = `select getdate() as now`;
        }        
        let completedQuery = query;        
        if(params?.length > 0) {  
          params.forEach((paramValue, i) => {
            paramValue = typeof paramValue === 'string' ? `'${paramValue}'` : paramValue;
            let regex = new RegExp(`\\{${i}\\}`, 'g');
            completedQuery = completedQuery.replace(regex, paramValue);
          });
        }
        //console.log(completedQuery);       				
        const result = await queryExec(parseInt(martCode), completedQuery);        
				
				// console.log((result && result?.length > 0));
				// console.log(result);
        // await delay(3000);

        res.status(200).json({ 
					result: {
						"code": 0,
						"message": "success"
						},  
					dataSet: (result && result?.length > 0) ? result : [[]],
					info : (mode && mode == 'debug') ? {
            completedQuery, count: result?.map(ds => ds.length)
          } : {count: result?.map(ds => ds.length)}
					});
    } else {
        res.status(200).json({ 
					result: {
            "code": -1,
            "message": "잘못된 요청입니다."
        	}});
    }   
    
}

//4m 이상의 결과를 응답할시 설정
export const config = {
  api: {
    responseLimit: false,
  },
}

export default handler;