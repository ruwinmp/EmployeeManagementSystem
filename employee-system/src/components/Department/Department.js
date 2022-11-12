import React,{Component} from "react";
import { Modal } from "react-bootstrap";
import { Variables } from "../../Global";
import $ from 'jquery';

export class Department extends Component{
    constructor(props){
        super(props);

        this.state={
            departments:[],
            departmentId: -1,
            departmnetName: '',
            createDepartmentModal: {
                title: '',
                show: false,
                close: false
            },
            refreshedData:false,
            searchDepartment: '',
            filteredDepartments: []
        }
    }

    componentDidMount(){
        if(!this.state.refreshedData) this.getDepartments();
    }

    componentDidUpdate(){
        if(!this.state.refreshedData) this.getDepartments();
    }

    getDepartments(){
        fetch(Variables.API_URL + 'department')
        .then(response => response.json())
        .then(departments =>{
            this.setState({departments:departments, filteredDepartments:departments, refreshedData: true})
        })
    }

    enterDepartmentName = (e) => this.setState({ departmnetName: e.target.value });
    filterSearchDepartment = (e) => {
        this.setState({ 
            searchDepartment : e.target.value,
            filteredDepartments: this.state.departments.filter(x => x.DepartmentName.toLowerCase().includes(e.target.value))
        });
    }

    loadAddDepartment_click(){
        this.setState({
            departmentId: -1,
            departmnetName: '',
            createDepartmentModal: {
                title: 'Create Department',
                show: true
            }
        });
    }
    createDepartment_click(){
        fetch(Variables.API_URL + 'department',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                DepartmentName:this.state.departmnetName
            })
        })
        .then(response => response.json())
        .then(
            (result) => {
                if(result) {
                    this.state.createDepartmentModal.show = false;
                    alert('Successfully Created');
                    this.getDepartments();
                }
                else alert('Unable to Create');
            },
            (error) =>{
                alert(error);
            }
        )
    }

    loadEditDepartment_click(department){
        this.setState({
            departmentId: department.Id,
            departmnetName: department.DepartmentName,
            createDepartmentModal: {
                title: 'Edit Department',
                show: true
            }
        });
    }
    updateDepartment_click(department){
        fetch(Variables.API_URL + 'department',{
            method:'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                Id: this.state.departmentId,
                DepartmentName:this.state.departmnetName
            })
        })
        .then(response => response.json())
        .then(
            (result) => {
                if(result) {
                    this.state.createDepartmentModal.show = false;
                    alert('Successfully Updated');
                    this.getDepartments();
                }
                else alert('Unable to Create');
            },
            (error) =>{
                alert(error);
            }
        )
    }

    deletetDepartment_click(departmentId){
        if(window.confirm('Are you sure about this deletion ?')) this.deletetDepartment(departmentId);
    }
    deletetDepartment(departmentId){
        fetch(Variables.API_URL + 'department/' + departmentId,{
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
                    this.getDepartments();
                }
                else{
                    alert('Unable to Delete');
                }
            }
        )
    }
    
    closeCreateDepartmentModal_click(){
        this.setState({
            departmentId: -1,
            departmnetName: '',
            createDepartmentModal: {
                title: '',
                show: false
            }
        });
    }

    

    render(){
        const {filteredDepartments, departmentId, departmnetName, createDepartmentModal, searchDepartment} = this.state;

        return(
            <React.Fragment>
                <div className="row">
                    <input type="text" className="form-control form-control-sm d-inline col-4 mt-5 ml-3 float-left" value={searchDepartment} onInput={this.filterSearchDepartment}/>
                    <div className="d-inline col-5 mt-5"></div>
                    <button className="btn btn-sm btn-primary d-inline col-2 mt-5 ml-5 float-right" onClick={()=>this.loadAddDepartment_click()}>Add Department</button>
                </div>

                <div className="clearfix"></div>

                <div className="mt-3 d-flex justify-content-left">
                    <table className="table table-sm">
                        <thead>
                            <tr>
                                <th scope="col">Department Id</th>
                                <th scope="col">Department Name</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDepartments.map(department => 
                                <tr key={department.Id}>
                                    <td>{department.Id}</td>
                                    <td>{department.DepartmentName}</td>
                                    <td>
                                        <button className="btn btn-sm btn-light mr-2" onClick={()=>this.loadEditDepartment_click(department)}>&#9998;</button>
                                        <button className="btn btn-sm btn-light" onClick={()=>this.deletetDepartment_click(department.Id)}>&#10006;</button>
                                    </td>
                                </tr>
                                )}
                        </tbody>
                    </table>
                </div>

                <Modal show={createDepartmentModal.show} size="lg" centered>
                    <Modal.Header>
                        <Modal.Title>{createDepartmentModal.title}</Modal.Title>
                        <button type="button" className="btn btn-light btn-sm" onClick={()=>this.closeCreateDepartmentModal_click()}>&#10006;</button>
                    </Modal.Header>

                    <Modal.Body>
                        <div className="input-group mb-3">
                            <span className="input-group-text">Department Name</span>
                            <input type="text" className="form-control" value={departmnetName} onInput={this.enterDepartmentName}/>
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                    {
                        departmentId == -1 ? 
                        <button type="button" className="btn btn-primary float-start"onClick={()=>this.createDepartment_click()}>Create</button> : 
                        <button type="button" className="btn btn-info float-start"onClick={()=>this.updateDepartment_click()}>Update</button>
                    }
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
        )
    }
}