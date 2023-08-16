import os from 'os';
import si from 'systeminformation';
/*
    * api/cpuz
    * 서버 시스템 모니터링정보.
  
*/ 
async function handler(req, res) {
    if (req.method === 'GET') {
        // const os = require('os');
        // const si = require('systeminformation');
        // const cpu = await si.currentLoad();
        // const mem = await si.mem();
        // const os = await si.getAllData();

        const allPerformanceData = await performanceData();


        // res.status(200).json({ "result": {
        //     "code": 0,
        //     "message": "success"
        //     },  
        //     cpuz: {           
        //         ...allPerformanceData
        //     }
        // });
        res.status(200).json({ "perfData": allPerformanceData});
    } else {
        res.status(200).json({ "result": {
            "code": -1,
            "message": "잘못된 요청입니다."
        }});
    }   
  }
  
  export default handler;
  
function performanceData() {
    return new Promise(async (resolve, reject) => {
        let kbToGb = 1024 * 1024 * 1024; // 1024^3 kilobytes = 1 Gigabyte

        // Returns file system stats
        let fsTotal = 0;
        let fsUsed = 0;
        let fsUsage = 0;

        await si.fsSize().then((data) => {
            data.forEach((disk) => {
                fsTotal += disk.size / kbToGb;
                fsUsed += disk.used / kbToGb;
            });

            fsUsage = +((100 * fsUsed) / fsTotal).toFixed(1);
            fsTotal = +fsTotal.toFixed(0);
            fsUsed = +fsUsed.toFixed(0);
        });

        // Returns battery stats
        let battery;

        await si.battery().then((data) => {
            battery = {
                hasbattery: data.hasbattery,
                ischarging: data.ischarging,
                voltage: data.voltage,
                percent: data.percent,
            };
        });

        let macA; // Identify this machine

		si.networkInterfaces().then((data) => {
			// Loop through all the network interfaces for this machine and find a non-internal one
			for (let key in data) {
				if (!data[key].internal) {
					macA = data[key].mac;
					break;
				}
			}
		});

        const netstat = await si.networkStats();
        // Returns the name of the operating system
        const osType = os.type();
        // Returns the uptime of the operating system, in seconds
        const upTime = os.uptime();
        // Returns the number of free memory of the system in bytes
        const freeMem = os.freemem();
        // Returns the number of total memory of the system in bytes
        const totalMem = os.totalmem();

        // Calculated memory usage
        const usedMem = totalMem - freeMem;
        const memUsage = ((100 * usedMem) / totalMem).toFixed(1);

        // Note: every core runs on 2 threads
        // Returns an array of objects containing information about the computer's CPUs
        const cpus = os.cpus(); // Returns static data
        const cpuModel = cpus[0].model; // CPU type
        const numCores = cpus.length; // Number of cores
        const cpuSpeed = cpus[0].speed; // Clock speed (in MHz)
        const cpuLoad = await getCpuLoad(); // Calculated CPU load
        const isActive = true; // Machine connection status

        resolve({
            macA,
            freeMem,
            totalMem,
            usedMem,
            memUsage,
            osType,
            upTime,
            cpuModel,
            numCores,
            cpuSpeed,
            cpuLoad,
            fsTotal,
            fsUsed,
            fsUsage,
            isActive,
            battery,
            // netstat
        });
    });
}
// CPU load
// {cpus} Returns an array of objects containing information about each logical CPU core
// Get the CPU average
function cpuAverage() {
    const cpus = os.cpus(); // Called on every check to refresh CPU data
    // The amount of time the computer has spent in each mode since last reboot
    let idleMs = 0; // The aggregate total of all cores idle in milliseconds
    let totalMs = 0;
    // loop through each core
    cpus.forEach((aCore) => {
        // Loop through each property of the current core
        for (let type in aCore.times) {
            totalMs += aCore.times[type];
        }
        idleMs += aCore.times.idle;
    });
    return {
        idle: idleMs / cpus.length,
        total: totalMs / cpus.length,
    };
}

function getCpuLoad() {
    return new Promise((resolve, reject) => {
        const start = cpuAverage(); // Fetch current CPU load
        // Get updated CPU load every 100ms
        setTimeout(() => {
            const end = cpuAverage();
            const idleDifference = end.idle - start.idle;
            const totalDifference = end.total - start.total;
            // Calculate the % of used CPU
            const percentageCpu = 100 - Math.floor((100 * idleDifference) / totalDifference);
            resolve(percentageCpu);
        }, 500);
    });
}