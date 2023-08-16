import { connMPOS, sql } from '../../../../lib/db-util';

/*
    * api/mpos/SetMposUser
    * 유료 사용자로 등록
    * request 
    *   mruEmpCode : 
    *   mruEmpCel : 
    *   mruMartCode :
    *   mruTermSerial :
*/ 
async function handler(req, res) {
    if (req.method === 'POST') {

        const { mruEmpCode, mruEmpCel, mruMartCode, mruTermSerial } = req.body;

        const pool = await connMPOS;
        const query = `UPDATE MPOS_Reg_User SET
                        mru_emp_code = ${mruEmpCode}, mru_emp_cel = ${mruEmpCel},
                        mru_idate = GETDATE() 
                        WHERE mru_mart_code = ${mruMartCode} 
                        AND mru_emp_code = 0 AND mru_term_serial = ${mruTermSerial}`;
        const result = await pool.request().query(query);        
        res.status(200).json({ "result": {
            "code": 0,
            "message": "success"
        }, data: result.recordsets[0] });
    } else {
        res.status(200).json({ "result": {
            "code": -1,
            "message": "잘못된 요청입니다."
        }});
    }   
  }
  
  export default handler;
  