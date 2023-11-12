import mysql from "mysql2";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "secret",
  database: "modeboost",
  port: 3306,
});
db.getConnection((err) => (err ? console.log(err, "init") : ""));

export const DataBaseManager = {
  closeCicle: (id, endD, payD, ordersQ, payment, payC) => {
    const sql = `UPDATE cicles SET end_date=${endD}, pay_date=${payD}, orders_quantity=${ordersQ}, payment=${payment}, payments_completition=${payC}  where cicle_id = ${id}`;
    return new Promise((resolve, reject) => {
      db.query(sql, (err, r) => (err ? reject(err) : resolve(r)));
    });
  },
  getCicleOrders: (id) => {
    const sql = `select order_id, price, author_id, staff_id,author  from orders WHERE c_id = ${id}`;
    return new Promise((resolve, reject) => {
      db.query(sql, (err, r) => (err ? reject(err) : resolve(r)));
    });
  },
  setCicleOrdersOnPaid: (c_id, staff_id) => {
    const sql = `UPDATE orders SET paid=true WHERE c_id = ${c_id} and staff_id = ${staff_id}`;
    return new Promise((resolve, reject) => {
      db.query(sql, (err, r) => (err ? reject(err) : resolve(r)));
    });
  },
  setCicleOrdersOnNotPaid: (c_id) => {
    const sql = `UPDATE orders SET paid=false WHERE c_id = ${c_id}`;
    return new Promise((resolve, reject) => {
      db.query(sql, (err, r) => (err ? reject(err) : resolve(r)));
    });
  },
  newCicleCreate: (date) => {
    const sql = `insert into cicles (cicle_id,start_date)  values (0,${date})  `;
    return new Promise((resolve, reject) => {
      db.query(sql, (err, r) => (err ? reject(err) : resolve(r.insertId)));
    });
  },
  newOrderComplete: (orderSchema) => {
    let sql = newOrderSqlString(orderSchema);

    return new Promise((resolve, reject) => {
      db.query(sql, (err, r) => (err ? reject(err) : resolve(r)));
    });
  },
  createDb: (name) => {
    const sql = `CREATE DATABASE ${name}`;
    db.query(sql, (err, r) => {
      if (err) return;
      console.log("DB Created");
    });
  },
  dropTable: (name) => {
    const t = new Promise((resolve, reject) => {
      db.query(`DROP TABLE ${name}`, (err, r) => {
        if (err) reject(err);
        console.log("DataBase ", name, " dropped ");
        resolve(r);
      });
    });
    return t;
  },
  createOrdersTable: () => {
    const sql = `CREATE TABLE IF NOT EXISTS orders(
      r_id varchar(255) NOT NULL primary key,
      order_id varchar(255) NOT NULL unique,
      author varchar(255) NOT NULL,
      title varchar(255),        
      price FLOAT NOT NULL,
      paid BOOL NOT NULL,
      ended_date BIGINT NOT NULL,          
      description varchar(255),
      staff varchar(255)  NOT NULL,
      c_id int unsigned NOT NULL,
      started_date BIGINT NOT NULL,
      staff_Id varchar(255) NOT NULL,
      author_Id varchar(255) NOT NULL
      )`;
    return new Promise((exec, reject) => {
      db.query(sql, (err, r) => {
        if (err) return reject(null);
        return exec(r);
      });
    });
  },
  allOrders: (id) => {
    const sql = `select order_id,ended_date from orders where author_id = id`;
    return new Promise((resolve, reject) => {
      db.query(sql, (err, r) => {
        err ? reject(err) : resolve(r);
      });
    });
  },
  getMyHistory: (i) => {
    return new Promise((resolve, reject) => {
      db.query(
        `select order_id, price, ended_date from orders where author_id = "${i}" and paid = 0`,
        (err, r) => {
          err ? reject(err) : resolve(r);
        }
      );
    });
  },
};

const newOrderSqlString = (orderSchema) => {
  return `insert  into orders (order_id,r_id,author,author_id,staff,staff_id,title,description,price,paid,started_date,ended_date,c_id) 
    VALUES 
    (
      "${orderSchema.orderId}",
      "${orderSchema.requestId}",
      "${orderSchema.author}",
      "${orderSchema.authorId}",
      "${orderSchema.staff}",
      "${orderSchema.staffId}",
      "${orderSchema.title}",
      "${orderSchema.description}",
       ${orderSchema.price},
       ${orderSchema.paid},
       ${orderSchema.started},
       ${orderSchema.ended},
       ${orderSchema.c_id}
      )`;
};
