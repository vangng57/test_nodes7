var nodes7 = require('nodes7'); 
var conn = new nodes7;

// Cấu hình kết nối PLC
conn.initiateConnection({ port: 102, host: '192.168.0.1', rack: 0, slot: 1, debug: false }, connected); 

function connected(err) {
    if (typeof(err) !== "undefined") {
        // We have an error. Maybe the PLC is not reachable.
        console.log(err);
        process.exit();
    }
    conn.setTranslationCB(function(tag) { 
        return variables_read[tag]; 
    });
    conn.addItems(Object.keys(variables_read));
    performOperations();
}

var variables_read = {
    // Đầu ra PLC
    Van_PG01: 'DB1,X0.0',
    Van_PG02: 'DB1,X0.1',
    Van_PG03: 'DB1,X0.2'
    // Vit_Xi_DO: 'DB1,X0.3',
    // Vit_Tro_DO: 'DB1,X0.4',
    // Vit_Cat_DO: 'DB1,X0.5',
    // Vit_Khoang_DO: 'DB1,X0.6',
    // DC_Tron_DO: 'DB1,X0.7',
    // Dong_Van_VuaKho: 'DB1,X1.0',
    // Mo_van_Vuakho: 'DB1,X1.1',
    // Dco_Thuyluc_DO: 'DB1,X1.2',
    // Van_CanPG_DO: 'DB1,X1.3',
    // Van_CanXiCat_DO: 'DB1,X1.4',
    // Van_CanTroKhoang_DO: 'DB1,X1.5',
    // // Giá trị nguyên liệu hiện tại
    // Save_canxi: 'DB2,REAL56',
    // Save_cantro: 'DB2,REAL60',
    // Save_cankhoang: 'DB2,REAL64',
    // Save_cancat: 'DB2,REAL68',
    // Save_canPG01: 'DB2,REAL72',
    // Save_canPG02: 'DB2,REAL76',
    // Save_canPG03: 'DB2,REAL80'
};
const valuesArray = [];
function readPLCdata() {
    
    conn.readAllItems(function(anythingBad, values) {
        if (anythingBad) { 
            console.log("SOMETHING WENT WRONG READING VALUES!!!!"); 
        } else {
            //console.log(values);
            for (let key in values) {
                if (values.hasOwnProperty(key)) {
                    valuesArray.push(values[key]);
                }
            }
            console.log("Read values:", valuesArray);
        }
    });
}

async function writePLCdata(tag, value) {
    return new Promise((resolve, reject) => {
        conn.writeItems(tag, value, function(anythingBad) {
            if (anythingBad) { 
                console.log("SOMETHING WENT WRONG WRITING VALUES!!!!");
                reject(anythingBad);
            } else {
                console.log(`Done writing ${tag}.`);
                resolve();
            }
        });
    });
}

async function performOperations() {
    try {
        await readPLCdata();
        await writePLCdata(['Van_PG01','Van_PG02'], [true,true]);
        process.exit();
    } catch (err) {
        console.error('Error during operations:', err);
    }
}
