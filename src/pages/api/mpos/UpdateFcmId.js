import { connMPOS, sql } from '../../../../lib/db-util';

/*
    * api/mpos/UpdateFcmId
    * fcm id 변경 [기존정보 삭제후 업데이트?]
    * request 
    *   cel : 
    *   fcm_id : 
*/ 
async function handler(req, res) {
    if (req.method === 'POST') {
        const { cel, fcm_id } = req.body;
        const pool = await connMPOS;
        const query = `UPDATE MPOS_Userinfo SET mu_fcm_id = '${fcm_id}' WHERE mu_cel = '${cel}'`;
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
  