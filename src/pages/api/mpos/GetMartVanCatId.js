import { connFoundation } from '../../../../lib/db-util';

/*
    * api/mpos/GetMartVanCatId
    * 대표/종속 CAT ID 조회 - 단독승인모드시 app-pos앱에서 사용함.
    * api/mpos/GetMartVanCatId?mvMart=1005
    * request 
    *   mvMart :
    * response
    *   mv_mart : 
    *   mv_mpos_catid_main : 
    *   mv_mpos_catid_sub :

*/ 
async function handler(req, res) {
    if (req.method === 'GET') {
        const { mvMart } = req.query;
        const pool = await connFoundation;
        const query = `SELECT mv_mart, mv_mpos_catid_main, mv_mpos_catid_sub FROM dbo.MartVan with(nolock)
                        WHERE mv_mart = ${mvMart}`;
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
  