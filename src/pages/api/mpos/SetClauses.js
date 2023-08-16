import { connMPOS, sql } from '../../../../lib/db-util';

/*
    * api/mpos/SetClauses
    * http://localhost:3000/api/mpos/SetClauses?phoneNo=01020773505
    * 약관동의처리
    * request 
    *   phoneNo : 
    *   service : 
    *   location :
*/ 
async function handler(req, res) {
    if (req.method === 'POST') {
        let { phoneNo, service, location } = req.body;
        //if(!phoneNo) { phoneNo = '-1'}
        const pool = await connMPOS;
        const query = `INSERT INTO MPOS_UserInfo (mu_cel, mu_service_clause, mu_location_clause) VALUES 
                        ( ${phoneNo}, (case when service == ${service} then GETDATE() else null end), 
                        (case when service == ${location} then GETDATE() else null end))`;
        const query2 = `UPDATE MPOS_UserInfo SET 
                        mu_service_clause = (case when service == ${service} then getdate() else null end), 
                        mu_location_clause = (case when location == ${location} then getdate() else null end) 
                        WHERE mu_cel = ${phoneNo}`;

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
  