const employees = [];
const departments = [];
module.exports = {
    initialize: function() {
        let fs = require('fs');
        let myPromise = new Promise(function(resolve, reject){
            try {
                fs.readFile('./data/employees.json', 'utf-8', (err,data)=>{
                    if(err) throw err;
                    else{
                        employees.push(JSON.parse(data));
                }})
                fs.readFile('./data/department.json', 'utf-8', (err,data)=>{
                    if(err) throw err;
                    else{
                        departments.push(JSON.parse(data));
                }})
                resolve();
            }
            catch(error){
                reject("unable to read file");
            }
        })
        return myPromise;
    }, getAllEmployees: function() {
        return new Promise(function(resolve, reject){
            if(employees[0].length > 0){
                resolve(employees[0]);
            }
            else {
                reject("no results returned");
            }
        });  
    }, getManagers: function() {
        return new Promise(function(resolve, reject){
            const managers = [];
            if(employees.length > 0){
                for (let i = 0; i < employees[0].length; i++) {
                    if(employees[0][i].isManager == true){
                        managers.push(employees[0][i]);
                    }
                }
                resolve(managers);
            }
            else {
                reject("no results returned");
            }
        }); 
    }, getDepartments: function() {
        return new Promise(function(resolve, reject){
            if(departments[0].length > 0){
                resolve(departments[0]);
            }
            else {
                reject("no results returned");
            }
        });  
    }, addEmployee: function(employeeData){
        return new Promise(function(resolve, reject){
            if(!employeeData.isManager){
                employeeData.isManager = false;
            }
            else {
                employeeData.isManager = true;
            }
            employeeData.employeeNum = employees[0].length + 1;
            employees[0].push(employeeData);
            resolve();
        });  
    }, getEmployeesByStatus: function(status){
        let empStatus = [];
        return new Promise(function(resolve, reject){
            for(let i = 0; i < employees[0].length; i++){
                if(employees[0][i].status == status){
                    empStatus.push(employees[0][i]);
                }
            }
            if(empStatus.length > 0){
                resolve(empStatus);
            }
            else{
                reject("no results returned");
            }
        });  
    }, getEmployeesByDepartment: function(department){
        let empDepartment = [];
        return new Promise(function(resolve, reject){
            for(let i = 0; i < employees[0].length; i++){
                if(employees[0][i].department == department){
                    empDepartment.push(employees[0][i]);
                }
            }
            if(empDepartment.length > 0){
                resolve(empDepartment);
            }
            else{
                reject("no results returned");
            }
        });  
    }, getEmployeesByManager: function(manager){
        let empManager = [];
        return new Promise(function(resolve, reject){
            for(let i = 0; i < employees[0].length; i++){
                if(employees[0][i].employeeManagerNum == manager){
                    empManager.push(employees[0][i]);
                }
            }
            if(empManager.length > 0){
                resolve(empManager);
            }
            else{
                reject("no results returned");
            }
        });  
    }, getEmployeeByNum: function(num){
        let empNum = [];
        return new Promise(function(resolve, reject){
            for(let i = 0; i < employees[0].length; i++){
                if(employees[0][i].employeeNum == num){
                    empNum.push(employees[0][i]);
                }
            }
            if(empNum.length > 0){
                resolve(empNum);
            }
            else{
                reject("no results returned");
            }
        });  
    }, updateEmployee: function(employeeData){
        return new Promise(function(resolve, reject){
            for(let i = 0; i < employees[0].length; i++){
                if(employees[0][i].employeeNum == employeeData.employeeNum){
                    employees[0][i] = employeeData;
                }
            }
            resolve();
        });  
    }
}


