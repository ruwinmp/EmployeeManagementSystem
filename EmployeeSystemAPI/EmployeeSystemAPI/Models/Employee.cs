using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EmployeeSystemAPI.Models
{
    public class Employee
    {
        public int Id { get; set; }
        public string EmployeeName { get; set; }
        public DateTime JoinedDate { get; set; }
        public string PhotoFileName { get; set; }
        public int Department { get; set; }
    }
}
