
namespace TANA.Controller{
	
	using System;
	using Microsoft.AspNetCore.Mvc;
	using System.Collections.Generic;
	using System.Linq;
    using Microsoft.AspNetCore.Http;
	using Microsoft.AspNetCore.Hosting;
	using System.Linq.Dynamic.Core;
	using TANA.Models;
	using TANA.Helpers;
    using Microsoft.Extensions.Configuration;
	using Microsoft.EntityFrameworkCore;
	

	/// <summary>
	/// Components Data Controller
	/// </summary>
	
	public class Components_Data:BaseController
	{
		private readonly IConfiguration Config;
		private readonly AppDBContext DB;
		private readonly IWebHostEnvironment hostEnvironment;
		public Components_Data(AppDBContext dbContext, IHttpContextAccessor httpContextAccessor, IWebHostEnvironment environment, IConfiguration Configuration) :base(dbContext, httpContextAccessor, environment, Configuration)
		{
			DB = dbContext;
			Config = Configuration;
			hostEnvironment = environment;
		}
	

	/// <summary>
	/// Get notes_languagecode_option_list records
	/// </summary>
	/// <returns>Array of option labels and value object</returns>
	[HttpGet]
	public ActionResult notes_languagecode_option_list()
	{
		string sqlText = "SELECT  DISTINCT languagecode AS value,languagecode AS label FROM dbo.NOTES" ;
		var queryParams = new List<QueryParam>();
		var records =  DB.RawSqlQuery(sqlText, queryParams,
			record => new {
				
				
				value = record["value"],
				label = record["label"]
			}
		);
		return Ok(records) ;
	}
	

	/// <summary>
	/// Get getcount_notes record
	/// </summary>
	/// <returns>Single value</returns>
	[HttpGet]
	public ActionResult  getcount_notes(){
		string sqlText = "SELECT COUNT(*) AS num FROM dbo.NOTES where languagecode = 'EN'" ;
		var queryParams = new List<QueryParam>();
		var value =  DB.RawSqlQueryScalar(sqlText, queryParams);
		return Ok(value) ;
	}
	

	/// <summary>
	/// Get getcount_remarque record
	/// </summary>
	/// <returns>Single value</returns>
	[HttpGet]
	public ActionResult  getcount_remarque(){
		string sqlText = "SELECT COUNT(*) AS num FROM dbo.NOTES where languagecode = 'FR'" ;
		var queryParams = new List<QueryParam>();
		var value =  DB.RawSqlQueryScalar(sqlText, queryParams);
		return Ok(value) ;
	}

	/// <summary>
	/// Get getcount_all record
	/// </summary>
	/// <returns>Single value</returns>
	[HttpGet]
	public ActionResult  getcount_all(){
		string sqlText = "SELECT COUNT(*) AS num FROM dbo.NOTES" ;
		var queryParams = new List<QueryParam>();
		var value =  DB.RawSqlQueryScalar(sqlText, queryParams);
		return Ok(value) ;
	}
	}


}
