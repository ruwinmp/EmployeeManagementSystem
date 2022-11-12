using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using EmployeeSystemAPI.Models;

namespace EmployeeSystemAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DepartmentController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private DbClass.DbClass dbClass;

        public DepartmentController(IConfiguration configuration)
        {
            _configuration = configuration;
            dbClass = new DbClass.DbClass(configuration);
        }


        [HttpGet]
        public JsonResult Get()
        {
            string query = @"SELECT     *
                             FROM       Department
                             ORDER BY   Id ASC";
            return new JsonResult(dbClass.RetriewQuery(query));
        }

        [HttpPost]
        public JsonResult Post(Department department)
        {
            string query = @"INSERT INTO    Department
                             VALUES         ('" + department.DepartmentName + "')";
            return new JsonResult(dbClass.ExecuteQuery(query));
        }

        [HttpPut]
        public JsonResult Put(Department department)
        {
            string query = @"UPDATE Department
                             SET    DepartmentName = '" + department.DepartmentName + @"'
                             WHERE  Id='" + department.Id + "' ";
            return new JsonResult(dbClass.ExecuteQuery(query));
        }

        [HttpDelete("{id}")]
        public JsonResult Delete(int id)
        {
            string query = @"DELETE
                             FROM   Department
                             WHERE  Id='" + id + "' ";
            return new JsonResult(dbClass.ExecuteQuery(query));
        }

        [Route("GetAllDepartments")]
        [HttpGet]
        public JsonResult GetAllDepartments()
        {
            string query = @"SELECT     DepartmentName
                             FROM       Department";
            return new JsonResult(dbClass.RetriewQuery(query));
        }

    }
}
