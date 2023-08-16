import { connMPOS, sql } from '../../../../lib/db-util';

/*
    * api/mpos/GetMPOSVersion
    * 버전정보
    * result 
    *  cfg_ival1 :
    *  cfg_ival2 :
*/ 
async function handler(req, res) {
    if (req.method === 'GET') {
        const pool = await connMPOS;
        const query = `SELECT cfg_ival1, cfg_ival2 FROM MPOS_Config WHERE cfg_code=107`;
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
  