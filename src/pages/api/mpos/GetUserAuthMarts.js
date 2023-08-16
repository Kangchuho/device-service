import { connMPOS, sql } from '../../../../lib/db-util';

/*
    * api/mpos/GetUserAuthMarts
    * 마트목록
      http://localhost:3000/api/mpos/GetUserAuthMarts?cel=01083291491
    * result 
    *   user_code : 
    *   user_mart : 
    *   user_name :
    *   user_emp :
*/ 
async function handler(req, res) {
    if (req.method === 'GET') {

        const { cel } = req.query;         

        const pool = await connMPOS;
        const query = `SELECT user_code, user_mart, user_name, user_emp FROM USERINFO WHERE user_type = 'M' AND user_auth = 'A'
                        AND user_cel = '${cel}' AND user_mart > 0
                        ORDER BY user_mart, user_emp`;
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
  