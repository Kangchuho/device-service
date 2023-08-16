import { queryExec } from '../../../../lib/query-util'

/*
    * api/mart/dbConTest.js
    * martDB 연결테스트
    * api/mart/dbConTest?martCode=1001
    * request 
    *   martCode :
    * response
    * 
    * 오류처리 : 직접처리 - 파라메터오류(누락[null],파싱오류,숫자변환오류)
    * DB오류처리 : 해당모듈에서 오류를 받아서 넘겨준다.

*/ 
async function handler(req, res) {
    
    if (req.method === 'GET') {
        let { martCode, query } = req.query;
        if(!query) { 
            query = `select getdate() as now`;
        }
        const result = await queryExec(parseInt(martCode), query);        

        res.status(200).json({ "result": {
            "code": 0,
            "message": "success"
        },  data: result });
    } else {
        res.status(200).json({ "result": {
            "code": -1,
            "message": "잘못된 요청입니다."
        }});
    }   
    
  }
  
  export default handler;