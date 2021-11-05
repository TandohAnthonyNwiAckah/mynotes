#nullable enable
#pragma warning disable CS8602 // Dereference of a possibly null reference.
#pragma warning disable CS8604 // Possible null reference argument.
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using TANA.Models;
using Microsoft.AspNetCore.Http;

namespace TANA.Helpers
{
    public class RecordUnique : ValidationAttribute
    {
        public string FieldName { get; }
        public string TableName { get; }
        private string Message = "";

        public RecordUnique(string fieldname, string table, string message = "")
        {
            FieldName = fieldname;
            TableName = table;
        }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var postValue = value.ToString();
            var DB = (AppDBContext)validationContext.GetService(typeof(AppDBContext));
            var sqlText = $"SELECT count(*) from {TableName} WHERE {FieldName} = @fieldvalue";
            var queryParams = new List<QueryParam>();
            queryParams.Add(new QueryParam("@fieldvalue", postValue));
            var result = DB.RawSqlQueryScalar(sqlText, queryParams);
            int  count = Convert.ToInt32(result);
            if (count > 0 )
            {
                return new ValidationResult(GetErrorMessage(postValue));
            }
            return ValidationResult.Success;
        }

        public string GetErrorMessage(string value)
        {
            if (Message == "")
            {
                return $"{value} is already in use";
            }
            return Message;
        }
    }

    public class RequiredIfEmpty : ValidationAttribute
    {
        private string Message = "";

        public RequiredIfEmpty(string message = "Field is required")
        {
            Message = message;
        }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var inputValue = value as string;
            if (inputValue != null && inputValue == "")
            {
                return new ValidationResult("Field is required");
            }
            return ValidationResult.Success;
        }
    }
}