import { connMPOS, sql } from '../../../../lib/db-util';

/*
    * api/mpos/GetUserSingleAuth
    * api/mpos/GetUserSingleAuth?martCode=1000&empCode=373
    * 단독승인 권한 조회
    * request 
    *   martCode : 
    *   empCode :
    * response
    *   ua_authtype : 1 - 권한있음. 0, null - 권한없음
*/ 
async function handler(req, res) {
    if (req.method === 'GET') {
        const { martCode, empCode } = req.query;
        const pool = await connMPOS;
        const query = `SELECT ua_mart, ua_emp, ua_authtype FROM USERINFO_AUTH with(nolock)
                        WHERE ua_mart = ${martCode} AND ua_emp = ${empCode} AND ua_authid = 'M207'`;
        const result = await pool.request().query(query);        
        res.status(200).json({ "result": {
                                    "code": 0,
                                    "message": "success"
                                }, 
                                data: result.recordsets[0] });
    } else {
        res.status(200).json({ "result": {
            "code": -1,
            "message": "잘못된 요청입니다."
        }});
    }   
  }
  
  export default handler;
  