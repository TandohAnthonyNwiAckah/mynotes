
namespace TANA.Controller{

using System;
using Microsoft.AspNetCore.Mvc;
	public class HomeController:Controller{
		public ActionResult index(){
			return View();
		}
	}
}
