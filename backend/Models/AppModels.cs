using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace TANA.Models
{
	public class BaseRecord
	{
		[NotMapped]
		public string nextRecordId { get; set; } = default!;

		[NotMapped]
		public string previousRecordId { get; set; } = default!;
	}

	public class LoginModel
	{
		[Required]
		[DataType(DataType.Password)]
		public string Password { get; set; } = null!;
		[Required]
		public string Username { get; set; } = null!;
	}
	

	public class ForgotPassword
	{
		[Required]
		[EmailAddress]
		public string Email { get; set; } = null!;
	}
	public class ResetPassword
	{
		[Required]
		[DataType(DataType.Password)]
		public string Password { get; set; } = null!;
		[Required]
		[DataType(DataType.Password)]
		[Compare("Password")]
		public string Confirm_Password { get; set; } = null!;
	}
	public class ChangePassword
	{
		[Required]
		[DataType(DataType.Password)]
		public string OldPassword { get; set; } = null!;

		[Required]
		[DataType(DataType.Password)]
		public string NewPassword { get; set; } = null!;

		[Required]
		[DataType(DataType.Password)]
		[Compare("NewPassword")]
		public string ConfirmPassword { get; set; } = null!;
	}
	public class UserRolePage
	{
		public UserRolePage(string rolename, List<String> pages)
		{
			Role = rolename;
			Pages = pages;
		}
		public string Role { get; set; }
		public List<String> Pages { get; set; }
	}
	public class QueryParam
	{
		public QueryParam(string placeHolder, object val)
		{
			Placeholder = placeHolder;
			Value = val;
		}
		public string Placeholder { get; set; }
		public object Value { get; set; }
	}
	public class QueryNumCount
	{
		[Key]
		public int Num { get; set; }
	}
	public class QueryLabelValue
	{
		[Key]
		public string Value { get; set; } = null!;
		public string Label { get; set; } = null!;
	}
	public class QueryLabelValueCount
	{
		[Key]
		public string Value { get; set; } = null!;
		public string Label { get; set; } = null!;
		public int Num { get; set; }
	}
	public class QueryValueCount
	{
		[Key]
		public string Value { get; set; } = null!;
		public int Num { get; set; }
	}
	public class DataHeader
	{
		public string Header { get; set; } = null!;
		public string Key { get; set; } = null!;
	}

	public class UploadModel
    {
        public string filenameType { get; set; } = "random";
        public string extensions { get; set; } = "jpg,png,gif,jpeg";
        public int maxFiles { get; set; } = 3;
        public float maxFileSize { get; set; } = 10;
        public bool returnFullpath { get; set; } = false;
        public string filenamePrefix { get; set; } = "";
        public string uploadDir { get; set; } = "";
        public List<ResizeSetting> imageResize { get; set; } = new List<ResizeSetting>();
    }
    public class ResizeSetting
    {
        public string name { get; set; } = "medium";
        public int width { get; set; } = 400;
        public int height { get; set; } = 400;
        public string mode { get; set; } = "contain";
    }
    public class TempFileDTO
    {
        [Required]
        public string temp_file { get; set; } = "";
    }

}
