namespace TANA.Controller
{
    using Microsoft.AspNetCore.Mvc;
    using System.Collections.Generic;
    using Microsoft.AspNetCore.Http;
    using System.IO;
    using Microsoft.AspNetCore.Hosting;
	using Microsoft.Extensions.Configuration;
    using System;
    using System.Linq;
    using SixLabors.ImageSharp;
    using SixLabors.ImageSharp.Processing;
    using System.ComponentModel.DataAnnotations;
    using TANA.Models;
    public class FileUploaderController : Controller
    {
        private readonly IWebHostEnvironment hostEnvironment;
        private readonly IConfiguration Config;
        private UploadModel UploadSettings;
        private string UploadDir = "";
        private string UploadPath = "";
        string WebRootPath = "";
        public FileUploaderController(IWebHostEnvironment environment, IConfiguration iConfig)
        {
            hostEnvironment = environment;
			Config = iConfig;
            UploadSettings = new UploadModel();
            WebRootPath = hostEnvironment.WebRootPath;
        }

        [HttpPost]
        public ActionResult Upload( string id, [FromForm(Name = "file")] List<IFormFile> files)
        {
            try
            {
                UploadSettings = Config.GetSection("UploadSettings:" + id).Get<UploadModel>();
                if (UploadSettings == null)
                {
                    return BadRequest($"No upload setting found for [{id}]");
                }
                if (files != null)
                {
                    UploadDir = Config["UPLOAD_TEMP_DIR"];
                    UploadPath = Path.Combine(WebRootPath, UploadDir);
                    if (!Directory.Exists(UploadPath))
                    {
                        Directory.CreateDirectory(UploadPath);
                    }
                    List<string> uploadedFiles = new List<string>();
                    int indx = 0;
                    foreach (IFormFile file in files)
                    {
                        indx++;
                        if (file.Length > 0)
                        {
                            string fileName = Path.GetFileName(file.FileName);
                            string fileExt = Path.GetExtension(fileName).Trim('.').ToLower();
                            List<string> allowedExts = UploadSettings.extensions.Replace(" ","").Split(",").ToList();
                            if (allowedExts.Contains(fileExt) == false)
                            {
                                return BadRequest(fileExt + " files not allowed");
                            }
                            string fileNewName = GetFileName(fileName, indx);
                            fileNewName = UploadSettings.filenamePrefix +  fileNewName + "." + fileExt;
                            string fullPath = Path.Combine(UploadPath, fileNewName);
                            using (var stream = new FileStream(fullPath, FileMode.Create))
                            {
                                file.CopyTo(stream);
                            }
                            string fileUrl = Path.Combine(UploadDir, fileNewName);
                            
                            fileUrl = fileUrl.Replace("\\", "/"); //normalize url for web
                            uploadedFiles.Add(fileUrl);
                        }
                    }
                    return Ok(uploadedFiles);
                }
                return BadRequest("No file selected for upload");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        public ActionResult Remove_Temp_File([FromBody] TempFileDTO postdata)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest("Invalid temp file");
                }
                var file = postdata.temp_file;
                var fileName = Path.GetFileName(file);
                var tempDir = Config["UPLOAD_TEMP_DIR"];
                string fullPath = Path.Combine(WebRootPath, tempDir, fileName);
                if (System.IO.File.Exists(fullPath))
                {
                    System.IO.File.Delete(fullPath);
                    return Ok("File Deleted");
                }
                return BadRequest("Invalid temp file");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        private string GetFileName(string fileName, int indx)
        {
            string fileNewName = Path.GetFileNameWithoutExtension(fileName);
            string fileNametype = UploadSettings.filenameType;
            if (fileNametype == "random")
            {
                fileNewName = Guid.NewGuid().ToString();
            }
            else if (fileNametype == "date")
            {
                fileNewName = indx + "_" + DateTime.Now.ToString("yyyy-MMM-dd_HH-mm-ss");
            }
            else if (fileNametype == "timestamp")
            {
                fileNewName = indx + "_" + DateTime.Now.Ticks.ToString();
            }
            else if (fileNametype == "filecount")
            {
                fileNewName = (Directory.GetFiles(UploadPath, "*.*", SearchOption.TopDirectoryOnly).Length + 1).ToString();
            }
            return fileNewName;
        }

        public string moveUploadedFiles(string files, string fieldname)
        {
            if (!String.IsNullOrEmpty(files))
            {
                UploadSettings = Config.GetSection("UploadSettings:" + fieldname).Get<UploadModel>();
                UploadDir = UploadSettings.uploadDir;
                UploadPath = Path.Combine(WebRootPath, UploadDir);
                if (!Directory.Exists(UploadPath))
                {
                    Directory.CreateDirectory(UploadPath);
                }

                UploadSettings = Config.GetSection("UploadSettings:" + fieldname).Get<UploadModel>();
                var arrFiles = files.Split(',').ToList();
                var uploadedFiles = new List<String>();
                foreach (string file in arrFiles)
                {
                    string tmpFile = Path.Combine(WebRootPath, file);
                    if (System.IO.File.Exists(tmpFile))
                    {
                        string movedFile = this.moveFile(tmpFile);
                        uploadedFiles.Add(movedFile);
                    }
                    else
                    {
                        uploadedFiles.Add(file);
                    }
                }
                return string.Join(",", uploadedFiles);
            }
            return "";
        }

        private string moveFile(string file)
        {
            string filename = Path.GetFileName(file);
            string newFileName = Path.Combine(UploadPath, filename);
            System.IO.File.Move(file, newFileName);
            if (IsImage(newFileName))
            {
                ResizeImage(newFileName);
            }
            string fileUrl = Path.Combine(UploadDir, filename);
            if(UploadSettings.returnFullpath == true){
                fileUrl = Path.Combine(Config["SITE_ADDR"], fileUrl);
            }
            fileUrl = fileUrl.Replace("\\", "/"); //normalize url for web
            return fileUrl;
        }

        private bool IsImage(string filepath)
        {
            List<String> imgExt = new List<string>() { "jpg", "png", "jpeg", "gif" };
            string fileExt = Path.GetExtension(filepath).Trim('.').ToLower();
            return imgExt.Contains(fileExt);
        }

        private void ResizeImage(string FilePath)
        {
            List<ResizeSetting> resizeSettings = UploadSettings.imageResize;
            foreach (var resize in resizeSettings)
            {
                var thumb_name = resize.name;

                var thumbDir = Path.Combine(UploadPath, resize.name);
                if (!Directory.Exists(thumbDir))
                {
                    Directory.CreateDirectory(thumbDir);
                }
                var fileName = Path.GetFileName(FilePath);
                var thumbFileName = Path.Combine(UploadPath, thumbDir, fileName);
                using (Image image = Image.Load(FilePath))
                {
                    var width = resize.width;
                    var height = resize.height;

                    if (width < 1 || image.Width < width)
                    {
                        width = image.Width;
                    }

                    if (height < 1 || image.Height < height)
                    {
                        height = image.Height;
                    }

                    if (resize.mode == "contain")
                    {
                        image.Mutate(x => x.Resize(new ResizeOptions { Mode = ResizeMode.Max, Size = new Size(width, height) }));
                    }
                    else
                    {
                        image.Mutate(x => x.Resize(new ResizeOptions { Mode = ResizeMode.Crop, Size = new Size(width, height) }));
                    }
                    image.Save(thumbFileName);
                }
            }
        }

    }
}