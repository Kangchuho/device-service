import { connMPOS, sql } from '../../../../lib/db-util';

/*
    * api/mpos/GetServiceClause
    * http://localhost:3000/api/mpos/GetServiceClause?phoneNo=01020773505
    * 약관동의상태
    * request 
    *   mruEmpCode : 
    *   mruEmpCel : 
    *   mruMartCode :
    *   mruTermSerial :
*/ 
async function handler(req, res) {
    if (req.method === 'GET') {
        let { phoneNo } = req.query;
        if(!phoneNo) { phoneNo = '-1'}
        const pool = await connMPOS;
        const query = `SELECT mu_service_clause FROM MPOS_UserInfo
                        WHERE mu_cel = '${phoneNo}'`;
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
  