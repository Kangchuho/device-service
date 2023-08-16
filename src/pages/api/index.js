import { sql, connMarts, getPool } from '../../../lib/db-util';
import {getEncValue, getDecValue} from '../../../lib/seedForNodeJs';

// import CryptoJS, { SHA256 } from 'crypto-js';

// const salt = 'mpos1234';
// const encrypt = (t) => {
//   // 값이 없을 경우 빈 문자열 반환
//   if (!t) return '';    
//   return CryptoJS.AES.encrypt(t, salt).toString();
// }

// /* 복호화 */
// const decrypt = (t) => {
//   // 값이 없을 경우 빈 문자열 반환
//   if (!t) return '';

//   try {
//       const bytes  = CryptoJS.AES.decrypt(t, salt); // 복호화 시도      
//       return bytes.toString(CryptoJS.enc.Utf8);
//   } catch (error) {
//       console.error('Decryption error:', error); // 에러 로깅
//       return ''; // 에러 발생 시 빈 문자열 반환
//   }
// }

// connect 기준 코드
// async function handler(req, res) {
//   if (req.method === 'GET') {
//     const a = Array.from({ length: 100 }, (v, i) => i + 1);
//     a.forEach(async (num) => {
//       //dbconnect(num);
//       const pool = await conndb2();
//       const insertRow = `INSERT INTO bbs (title, body) VALUES (@title, @body)`; //Insert query
//       const result = await pool
//         .request()
//         .input('title', sql.NVarChar, 'title' + num)
//         .input('body', sql.NText, 'body-' + num)
//         .query(insertRow);
//       //console.log(result);
//     });
//   }
//   res.status(200).json({ result: 'db ok' });
// }

// async function handler(req, res) {
//   if (req.method === 'GET') {
//     const a = Array.from({ length: 1006 }, (v, i) => i + 1);
//     a.forEach(async (num) => {
//       //dbconnect(num);
//       const pool = await connPool;
//       const insertRow = `INSERT INTO bbs (title, body) VALUES (@title, @body)`; //Insert query
//       const result = await pool
//         .request()
//         .input('title', sql.NVarChar, 'title' + num)
//         .input('body', sql.NText, 'body-' + num)
//         .query(insertRow);
//       //console.log(result);
//     });
//   }
//   res.status(200).json({ result: 'db ok' });
// }





async function handler(req, res) {
  if (req.method === 'GET') {

      let { code } = req.query;
      if(!code) {code = -1;}
      //const pool = await connMPOS;
      //const pool = await connMarts[0].pool;

      const pool = await getPool(Number(code));

      const pool1 = await getPool(-1);
      const query = `SELECT user_code, user_mart, user_name, user_emp FROM USERINFO WHERE user_type = 'M' AND user_auth = 'A'
                      AND user_cel = '01054729672' AND user_mart > 0
                      ORDER BY user_mart, user_emp`;
      //const query = `select top 1000 * from MPOS_Mart_User`; //query
      //const query = `select top 10 * from USERINFO_AUTH WHERE ua_authid = 'M204' and ua_user=41363 `; //query
      //const enquery = getEncValue(1000, query);
      //const result = await pool.request().query(query);
      //const aquery = getDecValue(1000, enquery);
      const result = await pool.request().query(query);
      //console.log(result);

      const ip = getDecValue(1000, 'QGAaEpApOCF1ZSIgQjHjTg==');
      const port = getDecValue(1000, '7qNx7PK8EwIx6uOJWz+6hQ==');
      const dbName = getDecValue(1000, '+7YRyRZREB3oLl7VmkV9cQ==');
      const user = getDecValue(1000, 'aA+g1PhM8OR7R2H/Unt6FQ==');
      const pwd = getDecValue(1000, 'NhxUCHmigZIiCF6OXrDvQQ==');

      console.log(connMarts);

      res.status(200).json({ 'query': 'enquery', data: result.recordsets[0],
      ip: ip,
      port: port,
      dbName: dbName,
      user: user,
      pwd: pwd
    
    });
  }
  
}

export default handler;
