/*const mysql = import('mysql2')

const pool = mysql.createPool ({      // PARA TRABAJAR EN MI COMPUTADORA :
    host: 'mysql-skilljm.alwaysdata.net', //localhost
    user: 'skilljm', //root
    password: 'Skill_JM1976#$', //admin
    database: 'skilljm_04', //testing
    port: '3306',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    //multipleStatements: true //para pedidos query multiples 
})

module.exports =  {
    conn: pool.promise()
}

*/

import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'mysql-skilljm.alwaysdata.net',
    user: 'skilljm',
    password: 'Skill_JM1976#$',
    database: 'skilljm_04',
    port: '3306',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export const conn = pool;
