import { connMPOS, sql } from '../../../../lib/db-util';
import { getPassPM, isPM, getPassPM40 } from '../../../../lib/util'
/*
    * api/mpos/SendSms
    * 앱사용자 인증번호 문자발송하기!!
    * request 
    *   cel: 전화번호
    *   randomNumber: 인증번호
    *   fcmId: fcm아이디
    *   deviceId: 장치아이디
    * response
    *   result : ok
*/ 
async function handler(req, res) {
    if (req.method === 'POST') {
        const { cel, randomNumber, fcmId, deviceId } = req.body;
        // const pool = await connMPOS;
        // const query = `SELECT ua_mart, ua_emp, ua_authtype FROM USERINFO_AUTH with(nolock)
        //                 WHERE ua_mart = ${martCode} AND ua_emp = ${empCode} AND ua_authid = 'M207'`;
        // const result = await pool.request().query(query);        

        // sms발송하기~
        const url = 'http://sms.martpia.net/Support/SendSMSHandler.ashx';
        const code = '123456';
        const phone = '01083291491';
        const pm = getPassPM40(0, 0); //40자리        
        const params = `?msg=[MPOS] 인증번호\n[${code}]를 입력해 주세요&centerorg=2&receiver=${phone}&where=MPOS&pm=${pm}&platform=biz`;
        //console.log(params);
        // fetch(url+params, {
        //     method: "POST",            
        // });



        res.status(200).json({ "result": {
                                    "code": 0,
                                    "message": "success"
                                }, 
                                data: [] });
    } else {
        res.status(200).json({ "result": {
            "code": -1,
            "message": "잘못된 요청입니다."
        }});
    }   
  }
  
  export default handler;
  