#nullable enable
#pragma warning disable CS8602 // Dereference of a possibly null reference.
#pragma warning disable CS8600 // Converting null literal or possible null value to non-nullable type.
#pragma warning disable CS8604 // Possible null reference argument.
#pragma warning disable CS8629 // Nullable value type may be null.


namespace TANA.Controller{
	using System;
	using Microsoft.AspNetCore.Mvc;
	using System.Collections.Generic;
	using Microsoft.Extensions.Logging;
	using System.Linq;
	using CsvHelper;
    using System.IO;
	using System.Threading.Tasks;
    using Microsoft.AspNetCore.Http;
	using Microsoft.AspNetCore.Hosting;
    using Newtonsoft.Json;
	using TANA.Models;
	using TANA.Helpers;
	using Microsoft.EntityFrameworkCore;
	using System.Linq.Dynamic.Core;
    using Microsoft.Extensions.Configuration;
	using AutoMapper;
	using WkWrap.Core;
    using System.Text;
	
	

	/// <summary>
	/// Controller for Notes api
	/// </summary>
	public class NotesController:BaseController
	{
		private readonly IConfiguration Config;
		private readonly EmailHelper Mailer;
		private readonly IHttpContextAccessor HttpAccessor;
		private readonly AppDBContext DB;
		private readonly IMapper Mapper;
		private readonly IWebHostEnvironment hostEnvironment;
		
		public NotesController(AppDBContext dbContext, IMapper mapper, IHttpContextAccessor httpContextAccessor, IWebHostEnvironment environment, IConfiguration Configuration, EmailHelper mailer) :base(dbContext, httpContextAccessor, environment, Configuration)
		{
			Config = Configuration;
			Mailer = mailer;
			HttpAccessor = httpContextAccessor;
			DB = dbContext;
			Mapper = mapper;
			hostEnvironment = environment;
			
		}
		
		/// <summary>
		/// List  Notes records
		/// Support searching, filtering and ordering of table records
		/// </summary>
		/// <param name="fieldname">Filter records based on table field.</param>
		/// <param name="fieldvalue">Filter value.</param>
   		/// <returns>JSON Array of Notes records</returns>
		[HttpGet]
		public async Task<IActionResult> Index(string? fieldname, string? fieldvalue, string? search, string? orderby, string ordertype = "desc", int page = 1, int limit = 10){
			try{
				var query = (from Notes in DB.Notes
					select new Notes{
						notesid = Notes.notesid,
						title = Notes.title,
						notes = Notes.notes,
						languagecode = Notes.languagecode
					}
				);
				if(search != null){
					query = query.Where(
						p => EF.Functions.Like(p.title, $"%{search}%") || 
						EF.Functions.Like(p.notes, $"%{search}%") 
					);
				}
				if(orderby != null){
					bool asc = (ordertype.ToLower() == "asc" ? true : false);
					query = query.OrderByField(orderby, asc);
				}
				else{
					query = query.OrderByField("title", false);
				}
				if(fieldvalue != null)
				{
					// filter record by table field
					query = query.Where(fieldname + " == @0", fieldvalue);
				}
				if (!string.IsNullOrEmpty(Request.Query["notes_languagecode"]))
				{
					string notes_languagecode = Request.Query["notes_languagecode"];
					query = query.Where("languagecode == @0",  notes_languagecode);
				}
				if (Request.Query.ContainsKey("export")){
					var exportRecords = query.ToList();
					return await ExportRecords(exportRecords, "ExportList");
				}


				int total_records = query.Count();


				int currentPage = ((page - 1) * limit);
				var records = query.Skip(currentPage).Take(limit).ToList();
				int record_count = records.Count;
				double t = total_records / limit;
				int total_page = (int)Math.Ceiling(t);
				
				var result = new { records, total_records, record_count, total_page};


               // Displaying the result API
				return Ok(result);



                // If I want to pass the record to the view 
				// return View(records);


			}
			catch (Exception ex){
				return StatusCode(500, $"{ex}");
			}
		}
	
	/// <summary>
	/// Import csv file data into Notes
	/// </summary>
	/// <returns>Number of records imported</returns>
	public ActionResult ImportData([FromForm(Name = "file")] List<IFormFile> CsvFiles)
	{
		try
		{
			int totalRows = 0;
			foreach (IFormFile file in CsvFiles)
			{
				if (file.Length > 0) // ensures file has readable content
				{
					string fileName = Path.GetFileName(file.FileName);
					string ext = Path.GetExtension(fileName).Trim('.').ToLower();
					if (ext != "csv")
					{
						return BadRequest(ext + " files not allowed");
					}
					using (var memoryStream = new MemoryStream())
					{
						file.CopyTo(memoryStream);
						memoryStream.Position = 0;
						TextReader textReader = new StreamReader(memoryStream);
						var csvReader = new CsvReader(textReader);
						csvReader.Configuration.HasHeaderRecord = true;
						var records = csvReader.GetRecords<Notes>().ToList();
						DB.Notes.AddRange(records);
						DB.SaveChanges();
						totalRows +=  records.Count;
					}
				}
			}
			return Ok(totalRows + " Records Imported");
		}
		catch (Exception ex)
		{
			return StatusCode(500, ex);
		}
	}
		

		/// <summary>
		/// Select single Notes record by ID
		/// </summary>
		/// <param name="id">Table primary key.</param>
   		/// <returns>JSON Object of Notes record</returns>
		[HttpGet]
		[Route("api/notes/view/{id}")]
		public ActionResult Detail(string id){
			try{
				var query = (from Notes in DB.Notes
					select new Notes{
						title = Notes.title,
						notes = Notes.notes,
						languagecode = Notes.languagecode
					}
				);
				query = query.Where(p => p.title.Equals(id));
				var record = query.FirstOrDefault();
				if(record != null ){
					return Ok(record);
				}
				return NotFound("No record found");
			}
			catch (Exception ex){
				return StatusCode(500, ex);
			}
		}
		

		/// <summary>
		/// Save form record to the  table
		/// </summary>
   		/// <returns>JSON Object of newly created Notes record</returns>
		[HttpPost]
		public ActionResult Add([FromBody] NotesAddDTO postdata){
			try{
				if (!ModelState.IsValid)
				{
					return BadRequest(ModelState);
				}
				var modeldata = Mapper.Map<Notes>(postdata);
				// save  record
				DB.Notes.Add(modeldata);
				var record = modeldata; //newly created record
				var recId = record.title;
				DB.SaveChanges();
				return Ok(record);
			}
			catch (Exception ex){
				return StatusCode(500, ex);
			}
		}
		

		/// <summary>
		/// Get  Notes record for edit
		/// </summary>
		/// <param name="id">Select record by table primary key.</param>
   		/// <returns>JSON Object of Notes record</returns>
		[HttpGet]
		public ActionResult Edit(string id){
			try{
				var query = (
					from Notes in DB.Notes
					select new Notes{
						title = Notes.title,
						notes = Notes.notes,
						languagecode = Notes.languagecode
					}
				);
				query = query.Where(p => p.title.Equals(id));
				var record = query.FirstOrDefault();
				if (record != null){
					return Ok(record);
				}
				return NotFound("No record found");
			}
			catch (Exception ex){
				return StatusCode(500, ex);
			}
		}
		

		/// <summary>
		/// Update  Notes record with form data
		/// </summary>
		/// <param name="id">Select record by table primary key.</param>
   		/// <returns>JSON Object of Notes record</returns>
		[HttpPost]
		public ActionResult Edit(string id, [FromBody] NotesEditDTO postdata){
			try{
				if (!ModelState.IsValid)
				{
					return BadRequest(ModelState);
				}
				var query = (
					from Notes in DB.Notes
					select Notes
				);
				query = query.Where(p => p.title.Equals(id));
				var record = query.FirstOrDefault();
				if(record != null){
					var modeldata = Mapper.Map(postdata, record);
					DB.Update(modeldata);
					DB.SaveChanges();
					return Ok(record);
				}
				return NotFound("No record found");
			}
			catch (Exception ex){
				return StatusCode(500, ex);
			}
		}
		

		/// <summary>
		/// Delete Notes record
		/// Support multi delete by separating record id by comma.
		/// </summary>
		/// <param name="id">Table primary key.</param>
   		/// <returns>JSON Object of Notes record</returns>
		[HttpGet]
		public ActionResult Delete(string id){
			try{
				var query = DB.Notes.AsQueryable();
				List<string> arrId = id.Split(",").ToList();
				query = query.Where(p => arrId.Contains(p.title.ToString()));
				DB.Notes.RemoveRange(query);
				DB.SaveChanges();
				return Ok(id);
			}
			catch (Exception ex){
				return StatusCode(500, ex);
			}
		}
		

		/// <summary>
		/// Export  Notes records to different format such as: pdf, cvs, excel, html
		/// </summary>
   		/// <returns>PDF | CSV | Excel | HTML File</returns>
		[HttpGet]
		private async Task<IActionResult> ExportRecords(List<Notes> records, string viewName)
		{
			string export = Request.Query["export"];
			try{
				var fileName = "NotesReport";
				if (export == "excel" || export == "csv")
				{
					List<DataHeader> Columns = new List<DataHeader>()
					{
					    new DataHeader { Header = "ID", Key = "notesid" },
					    new DataHeader { Header = "TITLE", Key = "title" },
					    new DataHeader { Header = "NOTE", Key = "notes" }
					};
					var dataTable = records.ToDataTable(Columns);
					dataTable.TableName = "Notes";
					if (export == "excel")
					{
						var excelContent = dataTable.ToExcel();
						var mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
						return File(excelContent, mimeType, $"{fileName}.xlsx");
					}
					else
					{
						var csvText = dataTable.ToCsv();
						var mimeType = "text/csv";
						return File(csvText, mimeType, $"{fileName}.csv");
					}
				}
				else if (export == "pdf")
				{
					var htmlContent = await this.RenderViewAsync(viewName, records, true);
					var wkhtmltoExePath = Config["WKHTML_EXE_PATH"];
					var wkhtmltopdf = new FileInfo(wkhtmltoExePath);
					var converter = new HtmlToPdfConverter(wkhtmltopdf);
					var settings = new ConversionSettings(pageSize: PageSize.A3, orientation: PageOrientation.Portrait, enableExternalLinks: true, enableImages: true);
					var pdfBytes = converter.ConvertToPdf(htmlContent, Encoding.UTF8, settings);
					return File(pdfBytes, "application/pdf", $"{fileName}.pdf");
				}
				else if (export == "print")
				{
					return View(viewName, records);
				}
				return StatusCode(400, "Export Format not Supported");
			}
			catch (Exception ex){
				return StatusCode(500, $"{ex}");
			}
		}
		
	}
}
