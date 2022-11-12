using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using EmployeeSystemAPI.Models;
using System.IO;
using Microsoft.AspNetCore.Hosting;

namespace EmployeeSystemAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _environment;
        private DbClass.DbClass dbClass;

        public EmployeeController(IConfiguration configuration, IWebHostEnvironment environment)
        {
            _configuration = configuration;
            _environment = environment;
            dbClass = new DbClass.DbClass(configuration);
        }


        [HttpGet]
        public JsonResult Get()
        {
            string query = @"SELECT     e.*,
                                        d.DepartmentName
                             FROM       Employee e
                                        INNER JOIN Department d ON d.Id=e.Department
                             ORDER BY   e.Id ASC";
            return new JsonResult(dbClass.RetriewQuery(query));
        }

        [HttpPost]
        public JsonResult Post(Employee employee)
        {
            string query = @"INSERT INTO    Employee
                             VALUES         ('" + employee.EmployeeName + "','" +
                                                  employee.Department + "','" +
                                                  employee.JoinedDate + "','" +
                                                  employee.PhotoFileName + "')";
            return new JsonResult(dbClass.ExecuteQuery(query));
        }

        [HttpPut]
        public JsonResult Put(Employee employee)
        {
            string query = @"UPDATE Employee
                             SET    EmployeeName = '" + employee.EmployeeName + @"',
                                    Department = '" + employee.Department + @"',
                                    JoinedDate = '" + employee.JoinedDate + @"',
                                    PhotoFileName = '" + employee.PhotoFileName + @"'
                             WHERE  Id='" + employee.Id + "' ";
            return new JsonResult(dbClass.ExecuteQuery(query));
        }

        [HttpDelete("{id}")]
        public JsonResult Delete(int id)
        {
            string query = @"DELETE
                             FROM   Employee
                             WHERE  Id='" + id + "' ";
            return new JsonResult(dbClass.ExecuteQuery(query));
        }

        [Route("SaveProfilePicture")]
        [HttpPost]
        public JsonResult SaveProfilePicture()
        {
            try
            {
                var httpRequest = Request.Form;
                var postedFile = httpRequest.Files[0];
                string fileName = postedFile.FileName;
                var filePhysicalPath = _environment.ContentRootPath + "/Content/ProfilePictures/" + fileName;

                using(var stream = new FileStream(filePhysicalPath, FileMode.Create))
                {
                    postedFile.CopyTo(stream);
                }

                return new JsonResult(fileName);
            }
            catch (Exception e)
            {
                //throw e;
                return new JsonResult("example.png");
            }
        }

    }
}
