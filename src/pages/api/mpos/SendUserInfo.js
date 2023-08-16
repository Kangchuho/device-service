import { connMPOS, sql } from '../../../../lib/db-util';

/*
    * api/mpos/SendUserInfo
    * 유저 정보 전송
    * request 
    *   empName : 
    *   empCode : 
    *   martCode :
    *   phoneNo :
*/ 
async function handler(req, res) {
    if (req.method === 'POST') {

        const { empName, empCode, martCode, phoneNo } = req.body;

        const pool = await connMPOS;
        // 레코드가 있으면 업데이트
        const query = `UPDATE MPOS_Mart_User
                        SET mmu_name = '${empName}', mmu_emp_code = ${empCode}, 
                        mmu_latest_run = GETDATE() 
                        WHERE mmu_mart_code = ${martCode} AND mmu_user_cel = '${phoneNo}'`;
        // 레코드가 없으면 인서트                        
        const query2 = `INSERT INTO MPOS_Mart_User (mmu_mart_code, mmu_user_cel, mmu_name, 
                        mmu_expire_date, mmu_emp_code, mmu_idate) VALUES (${martCode} , ${phoneNo}, ${empName}, 
                        (SELECT mru_end_date FROM MPOS_Reg_User with(nolock) WHERE mru_mart_code = ${martCode} AND mru_emp_cel = ${phoneNo}), 
                        ${empCode} , GETDATE())`;

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
  