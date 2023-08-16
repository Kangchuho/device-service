import sql from 'mssql';
import { getDecValue } from './seedForNodeJs'

/*
  db-util
  mssql server의 JDBC연결과 유사한 접속및 접속풀을 제공하는 helper입니다.
  mposDB, FoundationDB는 정적으로 앱 시작시 자동등록처리 하고
  martDB는 요청시 연결풀 배열에 탑재합니다.

  * 1. config를 서버별로 동적 구성합니다.
  * 2. connection 풀을 생성 및 참조하여 쿼리를 실행합니다. 
  * 3. KISA.SEED 디코딩이 필요합니다.
  * 4. 오류처리에 신경써야 합니다. 현재는 전혀 오류처리에 대한 기준을 정하지 못한상태입니다.

*/

// db tiemout - 설정에 아직 적용전(기본값으로 설정됨: 12000초?)
const timeout = 120_000_000;

//본사 mposDB 연결설정 - real서버 (mssql-express)
const mposConfig = {
  port: 14333,
  user: 'wwwuser',
  password: 'iamtechnet',
  server: '180.131.10.58',
  database: 'MPOS',
  stream: false,
  trustServerCertificate: true,
  options: {
    encrypt: false, 
    cryptoCredentialsDetails: {
      minVersion: 'TLSv1'
    }
  },
  pool: {
    max: process.env.DB_MAX_POOL || 5,
    min: 0,
  },
};

// 본사 FoundationDB 연결설정 (mssql-express)
const foundationConfig = {
  port: 1433,
  user: 'sa',
  password: '15774550',
  server: '192.168.10.174',
  database: 'Foundation',
  stream: false,
  trustServerCertificate: true,
  options: {
    encrypt: false, 
    cryptoCredentialsDetails: {
      minVersion: 'TLSv1'
    }
  },
  pool: {
    max: process.env.DB_MAX_POOL || 5,
    min: 0,
  },
};

// 마트DB 연결설정 - 도커(클라우드 mssql)의경우, mssql-express의 경우 연결설정이 다름!
const config = {
  port: 1433,
  user: 'sa',
  password: 'togethers@1491',
  server: '192.168.0.157',
  database: 'MPOSDB',
  stream: false,
  trustServerCertificate: true,
  options: {
    enableArithAbort: true,
  },
  pool: {
    max: process.env.DB_MAX_POOL || 500,
    min: 0,
  },
};
// 연결설정 사용예제
export async function dbconnect(poolcount) {
  try {
    const pool = await sql.connect(config);
    if (pool.connecting) {
      console.log('Connecting to the database...', poolcount);
    }
    if (pool.connected) {
      const aa = new sql.Request();
      if (aa) {
        const insertRow = `INSERT INTO bbs (title, body) VALUES (@title, @body)`; //Insert query
        aa.input('title', sql.NVarChar, 'title' + poolcount);
        aa.input('body', sql.NText, 'body-' + poolcount);
        aa.multiple = true;
        aa.query(insertRow, (err, rows) => {
          //Insert row into database
          if (err) throw err;
          console.log('inserted: ' + rows.rowsAffected); //Print row inserted
          //pool.close();
        });
      }
      console.log('Connected to SQL Server', poolcount);
    }
  } catch (error) {
    console.log('Error', error, poolcount);
  }
}

const config2 = {
  port: 1433,
  user: 'sa',
  password: 'togethers@1491',
  server: '192.168.0.157',
  database: 'MPOSDB',
  options: { trustServerCertificate: true, encrypt: true, useUTC: true },
  requestTimeout: timeout,
  pool: {
    max: 5000,
    min: 1,
    idleTimeoutMillis: timeout,
    acquireTimeoutMillis: timeout,
    createTimeoutMillis: timeout,
    destroyTimeoutMillis: timeout,
    reapIntervalMillis: timeout,
    createRetryIntervalMillis: timeout,
  },
};

const config0001 = {
  port: 10001,
  user: 'sa',
  password: 'martdb@@@1',
  server: '192.168.0.157',
  database: 'MPOSDB',
  options: { trustServerCertificate: true, encrypt: true, useUTC: true },
  requestTimeout: timeout,
  pool: {
    max: 5,
    min: 1,
    idleTimeoutMillis: timeout,
    acquireTimeoutMillis: timeout,
    createTimeoutMillis: timeout,
    destroyTimeoutMillis: timeout,
    reapIntervalMillis: timeout,
    createRetryIntervalMillis: timeout,
  },
};

// 기본 msslq 서버의 접속정보를 셋팅합니다. 임시정보.. 타임아웃 15000 -> 
const configs = [
  {
    martCode: -1,
    port: 1433,
    user: 'sa',
    password: '15774550',
    server: '192.168.10.174',
    database: 'MPOS',
    stream: false,
    trustServerCertificate: true,
    requestTimeout: 1500*3,
    options: {
      encrypt: false, 
      cryptoCredentialsDetails: {
        minVersion: 'TLSv1'
      }
    },
    pool: {
      max: process.env.DB_MAX_POOL || 5,
      min: 0,
    },
  }
];

// 마트DB 연결풀 배열(접속요청시 연결풀 배열에서 참조하여 처리합니다.)
const connMarts = [];

// MPOS 데이터베이스 연결 (테스트/리얼 각 서버 구성이 다르다.)
const connMPOS = new sql.ConnectionPool(mposConfig)
  .connect()
  .then((pool) => {
    console.log('MPOS DB연결 성공');
    return pool;
  })
  .catch((err) => {
    console.log('err ', err);
  });

// Foundation 데이터베이스 연결 (테스트/리얼 각 서버 구성이 다르다.)
const connFoundation = new sql.ConnectionPool(foundationConfig)
  .connect()
  .then((pool) => {
    console.log('Foundation DB연결 성공');
    return pool;
  })
  .catch((err) => {
    console.log('err ', err);
  });


// martDB 연결풀 최초 생성하기
async function newMartConnectionPool(martCode) {
  let pool;
  try {
    const tempConfig = await getConnectionConfig(martCode);
    pool = await new sql.ConnectionPool(tempConfig).connect();
    console.log(`martDB[${martCode}] 연결 성공`); 
  } catch (err) {
    console.log('newMartConnectionPool Error: ', err.message);
  }
  return pool;

}

// 기본값처리
// connMarts.push(
//   {
//     martCode: configs[0].martCode,
//     pool: await new makeConnection(configs[0])
//   }
// );

// console.log(connMarts[0]);
// const fstpool = await connMarts[0];
// console.log('연결된 매장: ', fstpool.martCode == -1 ? 'mpos' : fstpool.martCode);
// console.log('갯수: ',connMarts.length)

// DB config 동적 생성하기
async function getConnectionConfig(martCode) {

  try {
      
    const pool = await connMPOS;
    const query = `SELECT mpci_ext_ip, mpci_ext_port, mpci_db_name, mpci_db_user, mpci_db_pwd FROM MPOS_MartInfo_Connection
                    WHERE mpci_mart = ${Number(martCode)}`;
    const result = await pool.request().query(query);
    
    const convalue = result.recordsets[0];
    //console.log('convalue~~~~~~', !convalue, convalue[0] != undefined, convalue.length > 0 );
    if(convalue && convalue?.length > 0) {
      //console.log('convalue~~~~~~', convalue);
      const { mpci_ext_ip, mpci_ext_port, mpci_db_name, 
                mpci_db_user, mpci_db_pwd} = convalue[0];
      const ip = getDecValue(martCode, mpci_ext_ip);
      const port = getDecValue(martCode, mpci_ext_port);
      const dbName = getDecValue(martCode, mpci_db_name);
      const user = getDecValue(martCode, mpci_db_user);
      const pwd = getDecValue(martCode, mpci_db_pwd);                

      //console.log(ip, port, dbName, user, pwd);
      return {
              port: Number(port),
              user: user,
              password: pwd,
              server: ip,
              database: dbName,
              stream: false,
              trustServerCertificate: true,
              requestTimeout: 15000 * 5,
              options: {
                encrypt: false, 
                cryptoCredentialsDetails: {
                  minVersion: 'TLSv1'
                }
              },
              pool: {
                max: process.env.DB_MAX_POOL || 5,
                min: 0,
              },
            };
    } else {
      //console.log('convalue~~~~~~2', convalue);
      throw new Error(`요청한 마트코드[${martCode}]에 대한 접속정보가 없습니다.`);
    }

  } catch (error) {
      console.log('getConnectionConfig Error: ', error.message);
  }
}

// 마트코드에 맞는 데이터 풀리턴!!
async function getActivePool(code) {  
  try {
    const index = connMarts.findIndex(p => p.martCode == code);
    // pool array 조회!
    connMarts.length > 0 && console.log(connMarts.map(p => p.martCode));
    if(index == -1) {
      const newPool = await newMartConnectionPool(code);
      if(newPool) {
        // 정상적인 Pool을 받으면
        connMarts.push(
          {
            martCode: code,
            pool: newPool
          }
        ); 
        return newPool;
      } else {        
        throw new Error('New DB Pool 생성오류');
      }
    } else {
      console.log(`martDB[${code}] 연결 재사용`);
      return await connMarts[index].pool;
    }
  } catch (error) {
    console.log("getActivePool Error: ", error.message);
  }
  
}

/* 
  * connMPOS : 기존 mpos api 접근시 사용 /api/mpos/... 하위 코드참조.
  * getActivePool : martDB Query시 사용합니다. /api/mart/... 하위 코드참조. 
*/
export { connMPOS, getActivePool };

