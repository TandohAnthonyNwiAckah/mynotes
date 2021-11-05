
	using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using TANA.Models;
using Microsoft.AspNetCore.Mvc.RazorPages;
public class Rbac
{
	private readonly List<UserRolePage> UsersRolePermissions = new List<UserRolePage>();
	public List<string> GetRolePages(string role)
	{
		var rolePages = UsersRolePermissions.FirstOrDefault(x => x.Role.ToLower() == role.ToLower());
		if (rolePages !=null)
		{
			return rolePages.Pages;
		}
		return new List<string>();
	}

	public bool GetPageAccess(string role, string page, string action)
	{
		if (action == "" || action.ToLower() == "index")
		{
			action = "list";
		}
		else if (action.ToLower() == "detail")
		{
			action = "view";
		}
		var pagePath = $"{page}/{action}".ToLower();
		List<string> userPages  = GetRolePages(role);
		return userPages.Contains(pagePath, StringComparer.OrdinalIgnoreCase);
	}
}
