import { connMPOS, sql } from '../../../../lib/db-util';
import {getEncValue, getDecValue} from '../../../../lib/seedForNodeJs';

/*
    * api/mpos/GetMartConnectionInfo
    * 마트접속 DB정보 >> 마트DB 쿼리를 직접하기 때문에 클라이언트로 내려보내는건 안함!!
      http://localhost:3000/api/mpos/GetMartConnectionInfo?martcode=1001
    * result 
    *   mpci_ext_ip : 
    *   mpci_ext_port : 
    *   mpci_db_name :
    *   mpci_db_user :
    *   mpci_db_pwd :    
*/ 
async function handler(req, res) {
    if (req.method === 'GET') {

        let { martcode } = req.query;
        if(!martcode){ martcode = 1000}

        const pool = await connMPOS;
        const query = `SELECT mpci_ext_ip, mpci_ext_port, mpci_db_name, mpci_db_user, mpci_db_pwd FROM MPOS_MartInfo_Connection
                        WHERE mpci_mart = ${Number(martcode)}`;
        const result = await pool.request().query(query);        
        res.status(200).json({ "result": {
            "code": 0,
            "message": "success"
        },  data: result.recordsets[0] });

        // obj -> change
        // iampos1002 : M/ZVwqc9/Fom9CNMHodDeg==
        /*
        const mcode = 1001;
        const tdbname = 'iampos1001';
        const encdbName = getEncValue(mcode, tdbname);
        const ip = getDecValue(mcode, 'QAw8Xoas9e/byCYSyIYPGw==');
        const port = getDecValue(mcode, 'SGb8vmQxlciDcCCgvKzUkg==');
        const dbName = getDecValue(mcode, 'M/ZVwqc9/Fom9CNMHodDeg==');
        const user = getDecValue(mcode, 'iYt2rOtBAHJ2HVoHSbJrJA==');
        const pwd = getDecValue(mcode, 'WdDZ0+a6Q3or7on4YW7rPg==');

        console.log(dbName, encdbName, getDecValue(mcode, 'q/6kwswopZiuDocwONCQvw=='));
        */
    } else {
        res.status(200).json({ "result": {
            "code": -1,
            "message": "잘못된 요청입니다."
        }});
    }   
  }
  
  export default handler;
  