using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;
using System.Data;

namespace EmployeeSystemAPI.DbClass
{
    public class DbClass
    {
        private readonly IConfiguration _configuration;

        public DbClass(IConfiguration configuration)
        {
            _configuration = configuration;
        }


        public bool ExecuteQuery(string query)
        {
            bool result = false;
            string connectionString = _configuration.GetConnectionString("EmployeeSystemDb");
            DataTable dataTable = new DataTable();
            SqlDataReader sqlDataReader;
            using (SqlConnection sqlConnection = new SqlConnection(connectionString))
            {
                sqlConnection.Open();
                using (SqlCommand sqlCommand = new SqlCommand(query, sqlConnection))
                {
                    sqlDataReader = sqlCommand.ExecuteReader();
                    dataTable.Load(sqlDataReader);
                    sqlDataReader.Close();
                    sqlConnection.Close();
                    result = true;
                }
            }
            return result;
        }

        public DataTable RetriewQuery(string query)
        {
            string connectionString = _configuration.GetConnectionString("EmployeeSystemDb");
            DataTable dataTable = new DataTable();
            SqlDataReader sqlDataReader;
            using(SqlConnection sqlConnection = new SqlConnection(connectionString))
            {
                sqlConnection.Open();
                using(SqlCommand sqlCommand = new SqlCommand(query, sqlConnection))
                {
                    sqlDataReader = sqlCommand.ExecuteReader();
                    dataTable.Load(sqlDataReader);
                    sqlDataReader.Close();
                    sqlConnection.Close();
                }
            }
            return dataTable;
        }
    }
}
