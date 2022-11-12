import React,{Component} from "react";
import { Variables } from "../../Global";
import { Modal } from "react-bootstrap";

export class Employee extends Component{
    constructor(props){
        super(props);

        this.state = {
            employees: [],
            employeeId: -1,
            employeeName: '',
            department: -1,
            joinedDate: '',
            photoFileName: 'example.png',
            photoFilePath: Variables.IMG_URL,
            departments:[],
            createEmployeeModal: {
                title: '',
                show: false
            },
            refreshedData:false,
            searchEmployee: '',
            filteredEmployees: []
        }
    }

    componentDidMount(){
        if(!this.state.refreshedData){
            this.getEmployees();
            this.getDepartments();
        }
    }

    componentDidUpdate(){
        if(!this.state.refreshedData){
            this.getEmployees();
            this.getDepartments();
        }
    }

    getEmployees(){
        fetch(Variables.API_URL + 'employee')
        .then(response => response.json())
        .then(employees =>{
            this.setState({employees:employees, filteredEmployees: employees, refreshedData: true})
        })
    }
    getDepartments(){
        fetch(Variables.API_URL + 'department')
        .then(response => response.json())
        .then(departments =>{
            this.setState({departments:departments})
        })
    }

    enterEmployeeName = (e) => this.setState({ employeeName : e.target.value});
    changeDepartmentName = (e) => this.setState({ department : e.target.value});
    changeJoinedDate = (e) => this.setState({ joinedDate : e.target.value});
    changePhotoFileName = (e) => {
        e.preventDefault();
        const fileData = new FormData();
        fileData.append('file', e.target.files[0], e.target.files[0].name);
        fetch(Variables.API_URL + 'employee/SaveProfilePicture',{
            method:'POST',
            body: fileData
        })
        .then(response => response.json())
        .then(
            (result) => {
                if(result != null && result != '') this.state.photoFileName = result;
                else this.state.photoFileName = 'example.png';
            },
            (error) =>{
                this.state.photoFileName = 'example.png';
            }
        )
    }
    filterSearchEmployee = (e) => {
        this.setState({ 
            searchEmployee : e.target.value,
            filteredEmployees: this.state.employees.filter(x => x.EmployeeName.toLowerCase().includes(e.target.value))
        });
    }

    loadAddEmployee_click(){
        this.setState({
            employeeId: -1,
            employeeName: '',
            department: this.state.departments[0].Id,
            joinedDate: '',
            photoFileName: 'example.png',
            createEmployeeModal: {
                title: 'Create Employee',
                show: true
            }
        })
    }
    createEmployee_click(){
        fetch(Variables.API_URL + 'employee',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                EmployeeName:this.state.employeeName,
                Department:this.state.department,
                JoinedDate:this.state.joinedDate,
                PhotoFileName:this.state.photoFileName
            })
        })
        .then(response => response.json())
        .then(
            (result) => {
                if(result) {
                    this.state.createEmployeeModal.show = false;
                    alert('Successfully Created');
                    this.getEmployees();
                }
                else alert('Unable to Create');
            },
            (error) =>{
                alert(error);
            }
        )
    }
    loadEditEmployee_click(employee){
        this.setState({
            employeeId: employee.Id,
            employeeName: employee.EmployeeName,
            department: employee.Department,
            joinedDate: new Date(employee.JoinedDate).toISOString().slice(0, 10),
            photoFileName: employee.PhotoFileName,
            createEmployeeModal: {
                title: 'Edit Employee',
                show: true
            }
        })
    }
    updateEmployee_click(){
        fetch(Variables.API_URL + 'employee',{
            method:'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                Id:this.state.employeeId,
                EmployeeName:this.state.employeeName,
                Department:this.state.department,
                JoinedDate:this.state.joinedDate,
                PhotoFileName:this.state.photoFileName
            })
        })
        .then(response => response.json())
        .then(
            (result) => {
                if(result) {
                    this.state.createEmployeeModal.show = false;
                    alert('Successfully Updated');
                    this.getEmployees();
                }
                else alert('Unable to Update');
            },
            (error) =>{
                alert(error);
            }
        )
    }
    deletetEmployee_click(employeeId){
        if(window.confirm('Are you sure about this deletion ?')) this.deletetEmployee(employeeId);
    }
    deletetEmployee(employeeId){
        fetch(Variables.API_URL + 'employee/' + employeeId,{
            method:'DELETE',
            headers:{
                'Accept':'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(
            (result) => {
                if(result) {
                    alert('Successfully Deleted');
                    this.getEmployees();
                }
                else {
                    alert('Unable to Delete');
                }
            }
        )
    }


    closeCreateEmployeeModal_click(){
        this.setState({
            employeeId: -1,
            employeeName: '',
            department: -1,
            joinedDate: '',
            photoFileName: '',
            createEmployeeModal: {
                title: '',
                show: false
            }
        });
    }

    render(){
        const {filteredEmployees,employeeId,employeeName,department,joinedDate,photoFileName,photoFilePath,createEmployeeModal,departments,searchEmployee} = this.state;
        const formatDate = date => date.toISOString().slice(0, 10);

        return(
            <React.Fragment>
                <div className="row">
                    <input type="text" className="form-control form-control-sm d-inline col-4 mt-5 ml-3 float-left" value={searchEmployee} onInput={this.filterSearchEmployee}/>
                    <div className="d-inline col-5 mt-5"></div>
                    <button className="btn btn-sm btn-primary d-inline col-2 mt-5 ml-5 float-right" onClick={()=>this.loadAddEmployee_click()}>Add Employee</button>
                </div>

                <div className="clearfix"></div>

                <div className="mt-3 d-flex justify-content-left">
                    <table className="table table-sm">
                        <thead>
                            <tr>
                                <th scope="col">Employee Id &nbsp; <span><a href="">&#8642;&#8638;</a></span></th>
                                <th scope="col">Employee Name</th>
                                <th scope="col">Department</th>
                                <th scope="col">Joined Date</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map(employee => 
                                <tr key={employee.Id}>
                                    <td>{employee.Id}</td>
                                    <td>{employee.EmployeeName}</td>
                                    <td>{employee.DepartmentName}</td>
                                    <td>{formatDate(new Date(employee.JoinedDate))}</td>
                                    <td>
                                        <button className="btn btn-sm btn-light mr-2" onClick={()=>this.loadEditEmployee_click(employee)}>&#9998;</button>
                                        <button className="btn btn-sm btn-light" onClick={()=>this.deletetEmployee_click(employee.Id)}>&#10006;</button>
                                    </td>
                                </tr>
                                )}
                        </tbody>
                    </table>
                </div>

                <Modal show={createEmployeeModal.show} size="lg" centered>
                    <Modal.Header>
                        <Modal.Title>{createEmployeeModal.title}</Modal.Title>
                        <button type="button" className="btn btn-light btn-sm" onClick={()=>this.closeCreateEmployeeModal_click()}>&#10006;</button>
                    </Modal.Header>

                    <Modal.Body>
                        <div className="input-group mb-3">
                            <span className="input-group-text">Employee Name</span>
                            <input type="text" className="form-control" value={employeeName} onInput={this.enterEmployeeName}/>
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text">Department Name</span>
                            <select className="form-select" value={department} onChange={this.changeDepartmentName}>
                                {departments.map(department => <option key={department.Id} value={department.Id}>{department.DepartmentName}</option>)}
                            </select>
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text">Joined Date</span>
                            <input type="date" className="form-control" value={joinedDate} onChange={this.changeJoinedDate}/>
                        </div>
                        <div className="p-2 w-50 bd-highlight">
                            <img width="100px" height="100px" src={photoFilePath + photoFileName}/>
                            <input className="mt-2" type="file" onChange={this.changePhotoFileName}/>
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                    {
                        employeeId == -1 ? 
                        <button type="button" className="btn btn-primary float-start"onClick={()=>this.createEmployee_click()}>Create</button> : 
                        <button type="button" className="btn btn-info float-start"onClick={()=>this.updateEmployee_click()}>Update</button>
                    }
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
        )
    }
}