#nullable enable
#pragma warning disable CS8602 // Dereference of a possibly null reference.
#pragma warning disable CS8604 // Possible null reference argument.
#pragma warning disable CS8600 // Converting null literal or possible null value to non-nullable type.
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Security.Claims;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true, Inherited = true)]
public class AuthorizeRole : AuthorizeAttribute, IAuthorizationFilter
{
    public AuthorizeRole()
    {
      
    }
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var user = context.HttpContext.User;
        if (!user.Identity.IsAuthenticated)
        {
            // it isn't needed to set unauthorized result 
            // as the base class already requires the user to be authenticated
            return;
        }
        Rbac rbac = context.HttpContext.RequestServices.GetService<Rbac>();
        string page = context.RouteData.Values["controller"].ToString();
        string action = context.RouteData.Values["action"].ToString();
        var userRole = user.FindFirstValue(ClaimTypes.Role);
        bool allow = rbac.GetPageAccess(userRole, page, action);
        if (!allow)
        {
            context.Result = new ForbidResult();
            return;
        }
    }
}