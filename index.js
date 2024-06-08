const express = require('express')
const app = express();
const port = 3000;
const cors=require("cors");
const bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded


const corsOptions ={  
   origin:'http://127.0.0.1:5500', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'conbo2chan',
  database: 'hrm'
});

connection.connect(function(err) {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }

  console.log('Connected to MySQL database!');
});



app.use(cors(corsOptions)) // Use this after the variable declaration

app.post('/api/login', (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const query = `SELECT users.id as id, users.name as name, users.email as email, users.CCCD as CCCD, users.phone as phone, users.dob as dob, users.certificate as certificate, users.onboard as onboard, users.salary as salary, users.active as active, position.name as position_name,position.id as position_id, department.name as department_name, department.user_name as management_name,department.id as department_id,department.id_user as department_id_user, company.name as company_name FROM users, department, position, company where users.username = '${username}' and users.password = '${password}' and users.id_position = position.id and users.id_department = department.id and users.id_company = company.id;`;
    const data = {
      ok:false,
      infor:{}
    };
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error querying database:', err);
        return;
      }
      if(results.length != 0)
      {
        console.log(results[0])
        if(results[0].active == 1)
        {
            data['ok'] = true
            data['infor'] = results[0]
        }
      }
      return res.send(JSON.stringify(data));
    });
      
    
})
function changeToMinutes(timeString){
      
      const timeArray = timeString.split(":");
      const hours = parseInt(timeArray[0]);
      const minutes = parseInt(timeArray[1]);
      const totalMinutes = (hours * 60) + minutes;
      return totalMinutes;
}
app.post('/api/add-employees', (req,res)=>{
  console.log(req.body);
  const id = req.body.len;
  const employee = req.body.employee;
  const query = "INSERT INTO `hrm`.`users` (`id`, `name`, `email`, `CCCD`, `phone`, `dob`, `certificate`, `onboard`, `id_position`, `id_department`, `id_company`, `username`, `password`, `title`) VALUES (" + `'${id}', '${employee.name}', '${employee.email}', '${employee.CCCD}', '${employee.phone}', '${employee.dob}', '${employee.certificate}', '${employee.onboard}', '${employee.position}', '${employee.department}', '1', '${employee.username}', '${employee.password}', '${employee.title}');`
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return;
    }
    return res.send(JSON.stringify('ok'));
  });
})

app.get('/api/employees',(req,res)=>{
    const query = 'SELECT users.id as id, users.name as name, users.email as email, users.CCCD as CCCD, users.phone as phone, users.dob as dob, users.certificate as certificate, users.onboard as onboard, users.salary as salary, position.name as position_name, position.id as position_id ,department.name as department_name, department.user_name as management_name,users.title as title, users.active as active, department.id as department_id ,company.name as company_name FROM users, department, position, company where users.id_position = position.id and users.id_department = department.id and users.id_company = company.id;';
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error querying database:', err);
        return;
      }
      console.log(results);
      return res.send(JSON.stringify(results));
    });
    
})

app.post('/api/employee',(req,res)=>{
  const id = "" + req.body.id;
  const query = `SELECT users.id as id, users.name as name, users.email as email, users.CCCD as CCCD, users.phone as phone, users.dob as dob, users.certificate as certificate, users.onboard as onboard,users.username as username, users.password as password,users.title as title,users.salary as salary, position.name as position_name, position.id as position_id ,department.name as department_name, department.user_name as management_name,department.id as department_id ,company.name as company_name FROM users, department, position, company where users.id = '${id}' and users.id_position = position.id and users.id_department = department.id and users.id_company = company.id;`
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return;
    }
    console.log(results);
    return res.send(JSON.stringify(results));
  });
})

app.post('/api/update-employee',(req,res)=>{
  const e = req.body
  console.log(e.title)
  const query = `update users set name = '${e.name}', email = '${e.email}', CCCD = '${e.CCCD}', phone = '${e.phone}', dob = '${e.dob}', certificate = '${e.certificate}', id_position = '${e.position}', id_department = '${e.department}', username = '${e.username}', password = '${e.password}', title = '${e.title}', salary = '${e.salary}' where id = '${e.id}'`
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return;
    }
    return res.send(JSON.stringify('cập nhật thành công'));
  });
})

app.post('/api/active-employee',(req,res)=>{
  const id = parseInt(req.body.id)
  const active = parseInt(req.body.active)
  var setActive = 0
  if(active == 0) setActive = 1
  const query = "UPDATE `hrm`.`users` SET `active` = " +  `'${setActive}' ` + "WHERE (`id` = '" + `${id}');`
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.send("cập nhật nhân viên không thành công");
    }
    return res.send(JSON.stringify('Cập nhật nhân viên thành công'));
  });
})

app.post('/api/add-createdWork',(req,res)=>{
  const e = req.body
  const query = "insert into created_work(`date`, `checkin`, `checkout`) values (" + `'${e.date}','${e.checkin}', '${e.checkout}')`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return;
    }
    //return res.send(JSON.stringify('Thêm công thành công'));
  });
  const query2 = 'select count(*) from users;'
  var number = 0;
  connection.query(query2, (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return;
    }
    number = parseInt(results[0]['count(*)'])
    for(let i = 1 ; i<=number;i++)
  {
    var query3 = "insert into work(`date`,`id_user`) values (" + `'${e.date}', '${i}')`;
    connection.query(query3, (err, results) => {
      if (err) {
        console.error('Error querying database:', err);
        return;
      }
      console.log('insert ok ' + i);
    });
  }
  });
  
  return res.send(JSON.stringify('Thêm công thành công'));
})

app.post('/api/show-created-work',(req,res)=>{
  const e = req.body
  const query = `select * from work where id_user = '${req.body.id}'`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return;
    }
    console.log(results)
    return res.send(JSON.stringify(results));
  });
})


app.post('/api/handle-work',(req,res)=>{
  const e = req.body
  var isFirst = true;
  console.log(e)
  const query = `select * from work where id_user = '${req.body.id}' and date = '${req.body.date}'`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return;
    }
    console.log(results)
    if(results[0].checkin == null)
    {
      const query2 = `update work set checkin = '${req.body.time}' where id_user='${req.body.id}' and date = '${req.body.date}'`;
      connection.query(query2, (err1,results1)=>{
        if (err1) {
          console.error('Error querying database:', err1);
          return;
        }
        return res.send(JSON.stringify("Chấm công thành công"))
      })
    }
    else{
      let checkin = changeToMinutes(results[0].checkin)
      let checkout = changeToMinutes(req.body.time)
      let work_time = checkout - checkin
      const query3 = `update work set checkout = '${req.body.time}', minutes = ${work_time} where id_user='${req.body.id}' and date = '${req.body.date}'`;
      connection.query(query3, (err2,results2)=>{
        if (err2) {
          console.error('Error querying database:', err2);
          return;
        }
        return res.send(JSON.stringify("Chấm công thành công"))
      })
    }
  });
})

app.post('/api/register',(req,res)=>{
  const e = req.body
  console.log(e)
  // var isFirst = true;
  const query = 'insert into register_work(`name`,`reason`,`date`,`id_user`,`verify`) values(' + `'${e.works}','${e.reason}','${e.date}','${e.id_user}',0);`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return;
    }
    return res.send(JSON.stringify("ok"));
  });
})

app.get('/api/register-work',(req,res)=>{
  const query = 'SELECT register_work.id as id, register_work.name as work, register_work.reason as reason, register_work.date as date,register_work.verify as verify, users.name as name, department.id_user as id_management from register_work, users, department where register_work.id_user = users.id and users.id_department = department.id';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return;
    }
    console.log(results);
    return res.send(JSON.stringify(results));
  });
  
})

app.post('/api/verify-register',(req,res)=>{
  const e = req.body
  console.log(e)
  const query = `update register_work set verify=1 where id=${req.body.id};`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return;
    }
    var query2 = "";
    if(e.work == "Nghỉ ca sáng")
    {
      query2 = `update work,register_work set work.checkin='08:00' where register_work.id = ${e.id} and register_work.id_user = work.id_user and work.date = register_work.date`;
    }
    else if(e.work == "Nghỉ ca chiều")
    {
      query2 = `update work,register_work set work.checkout='17:00' where register_work.id = ${e.id} and register_work.id_user = work.id_user and work.date = register_work.date`;
    }
    else if(e.work == "Nghỉ cả ngày" || e.work == "Làm việc tại nhà")
    {
      query2 = `update work,register_work set work.checkout='17:00', checkin='08:00' where register_work.id = ${e.id} and register_work.id_user = work.id_user and work.date = register_work.date`;
    }
    console.log(query2)
    connection.query(query2, (err,results2)=>{
      if (err) {
        console.error('Error querying database:', err);
        return;
      }
      return res.send(JSON.stringify("Phê duyệt thành công"));
    })
  });
})
app.listen(port, () => {
  console.log(`Example app listening on port '${port}`)
})