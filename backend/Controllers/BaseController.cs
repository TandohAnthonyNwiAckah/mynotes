using System.Linq;
using System;
using Newtonsoft.Json;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TANA.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Extensions;
using System.IO;
using Microsoft.Extensions.Configuration;


public class BaseController : Controller
{
	public new ObjectResult Response = null!;
	
	private readonly AppDBContext DB;
	private readonly IHttpContextAccessor HttpAccessor;
	private readonly IWebHostEnvironment hostEnvironment;
	private readonly IConfiguration Config;
	public BaseController(AppDBContext dbContext, IHttpContextAccessor httpContextAccessor, IWebHostEnvironment environment, IConfiguration Configuration)
	{
		DB = dbContext;
		HttpAccessor = httpContextAccessor;
		hostEnvironment = environment;
		Config = Configuration;
	}


	public string moveUploadedFiles(string files, string fieldname)
	{
		var uploader = new TANA.Controller.FileUploaderController(hostEnvironment, Config);
		return uploader.moveUploadedFiles(files, fieldname);
	}
	public void deleteRecordFiles(string filePath, string fieldName)
	{
		try
		{
			var filesToBeDeleted = filePath.Split(",").ToList();

			var UploadSettings = Config.GetSection("UploadSettings:" + fieldName).Get<UploadModel>();
			var imgThumbDirs = UploadSettings.imageResize.Select(a => a.name).ToList();
			var imgExts = new List<string> { "jpg", "png", "jpeg" };
			foreach (var file in filesToBeDeleted)
			{
				string fullPath = Path.Combine(hostEnvironment.WebRootPath, file);
				if (System.IO.File.Exists(fullPath))
				{
					System.IO.File.Delete(fullPath);
					string fileExt = Path.GetExtension(fullPath).Trim('.').ToLower();
					if (imgExts.Contains(fileExt))
					{
						foreach (var thumbDir in imgThumbDirs)
						{
							var paths = fullPath.Split("/").ToList();
							var lastpath = paths.Count - 1;
							paths.Insert(lastpath, thumbDir);
							var thumbFullPath = String.Join("/", paths);
							if (System.IO.File.Exists(thumbFullPath))
							{
								System.IO.File.Delete(thumbFullPath);
							}
						}
					}
				}
			}
		}
		catch (Exception err)
		{
			Console.WriteLine(err.Message);
		}
	}
}