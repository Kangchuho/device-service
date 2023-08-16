import { connMPOS, sql } from '../../../../lib/db-util';

/*
    * api/mpos/CheckGoodsPriceCompare
    ? api/mpos/CheckGoodsPriceCompare?userCode=41355
    * d2 접근권한 체크
    * request 
    *   userCode : 직원코드
    * response
    *   ua_authtype : 1 - 권한있음. 0, null - 권한없음
*/ 
async function handler(req, res) {
    if (req.method === 'GET') {

        const { userCode } = req.query;
        const pool = await connMPOS;
        const query = `SELECT ua_authtype FROM USERINFO_AUTH
                        WHERE ua_authid = 'M204' AND ua_user = ${userCode}`;
        const result = await pool.request().query(query);        
        res.status(200).json({ "result": {
            "code": 0,
            "message": "success"
        },  data: result.recordsets[0] });
    } else {
        res.status(200).json({ "result": {
            "code": -1,
            "message": "잘못된 요청입니다."
        }});
    }   
  }
  
  export default handler;
  