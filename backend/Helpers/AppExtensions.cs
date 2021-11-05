#nullable enable
#pragma warning disable CS8602 // Dereference of a possibly null reference.
#pragma warning disable CS8600 // Converting null literal or possible null value to non-nullable type.
#pragma warning disable CS8604 // Possible null reference argument.

using System;
using AutoMapper;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Linq;
using System.Data.Common;
using System.Data;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using ClosedXML.Excel;
using CsvHelper;
using TANA.Models;

namespace TANA.Helpers
{
    public static class AppExtensions
    {
		public static IQueryable<T> OrderByField<T>(this IQueryable<T> q, string SortField, bool Ascending)
		{
			var param = Expression.Parameter(typeof(T), "p");
			var prop = Expression.Property(param, SortField);
			var exp = Expression.Lambda(prop, param);
			string method = Ascending ? "OrderBy" : "OrderByDescending";
			Type[] types = new Type[] { q.ElementType, exp.Body.Type };
			var mce = Expression.Call(typeof(Queryable), method, types, q.Expression, exp);
			return q.Provider.CreateQuery<T>(mce);
		}
		public static IQueryable<T> WhereEquals<T>(this IQueryable<T> source, string propertyName, object value)
		{
			var item = Expression.Parameter(typeof(T), "item");
			var memberValue = Expression.PropertyOrField(item, propertyName);
			var memberType = memberValue.Type;
			if (value != null && value.GetType() != memberType)
				value = Convert.ChangeType(value, Nullable.GetUnderlyingType(memberType));
			var condition = Expression.Equal(memberValue, Expression.Constant(value, memberType));
			var predicate = Expression.Lambda<Func<T, bool>>(condition, item);
			return source.Where(predicate);
		}
		public static List<T> RawSqlQuery<T>(this DbContext context, string query, List<QueryParam>? parameters, Func<DbDataReader, T> map)
		{
			using (var command = context.Database.GetDbConnection().CreateCommand())
			{
				command.CommandText = query;
				command.CommandType = CommandType.Text;
				if (parameters != null)
				{
					foreach (var param in parameters)
					{
						DbParameter dbParameter = command.CreateParameter();
						dbParameter.ParameterName = param.Placeholder;
						dbParameter.Value = param.Value;
						command.Parameters.Add(dbParameter);
					}
				}
				context.Database.OpenConnection();
				using (var result = command.ExecuteReader())
				{
					var entities = new List<T>();
					while (result.Read())
					{
						entities.Add(map(result));
					}
					return entities;
				}
			}
		}
		public static object RawSqlQueryScalar(this DbContext context, string query, List<QueryParam>? parameters = null)
		{
			using (var command = context.Database.GetDbConnection().CreateCommand())
			{
				command.CommandText = query;
				command.CommandType = CommandType.Text;
				if (parameters != null)
				{
					foreach (var param in parameters)
					{
						DbParameter dbParameter = command.CreateParameter();
						dbParameter.ParameterName = param.Placeholder;
						dbParameter.Value = param.Value;
						command.Parameters.Add(dbParameter);
					}
				}
				context.Database.OpenConnection();
				var result = command.ExecuteScalar();
				context.Database.CloseConnection();
				return result;
			}
		}
		public static List<ModelError> GetErrors(this ModelStateDictionary modelState)
		{
			var errors = modelState.Values.SelectMany(x => x.Errors).ToList();
			return errors;
		}
		public static object? GetPropertyValue(this object T, string PropName)
		{
			return T.GetType().GetProperty(PropName)?.GetValue(T, null); ;
		}
		public static DataTable ToDataTable<T>(this List<T> Records, List<DataHeader> Columns)
		{
			DataTable table = new DataTable();
			foreach (var column in Columns)
			{
				table.Columns.Add(column.Header);
			}
			foreach (var record in Records)
			{
				DataRow row = table.NewRow();
				foreach (var column in Columns)
				{
					row[column.Header] = record.GetPropertyValue(column.Key);
				}
				table.Rows.Add(row);
			}
			return table;
		}
		public static byte[] ToExcel(this DataTable Records)
		{
			using (var workbook = new XLWorkbook())
			{
				var worksheet = workbook.Worksheets.Add(Records, Records.TableName);
				using (var stream = new MemoryStream())
				{
					workbook.SaveAs(stream);
					return stream.ToArray();
				}
			}
		}
		public static byte[] ToCsv(this DataTable Records)
		{
			using (var stream = new MemoryStream())
			using (var writer = new StreamWriter(stream))
			using (var csv = new CsvWriter(writer))
			{
				foreach (DataColumn dc in Records.Columns)
				{
					csv.WriteField(dc.ColumnName);
				}
				csv.NextRecord();
				foreach (DataRow dr in Records.Rows)
				{
					foreach (DataColumn dc in Records.Columns)
					{
						csv.WriteField(dr[dc]);
					}
					csv.NextRecord();
				}
				return stream.ToArray();
			}
		}

		

		public static async Task<string> RenderViewAsync<TModel>(this BaseController controller, string viewName, TModel model, bool partial = false)
        {
            if (string.IsNullOrEmpty(viewName))
            {
                viewName = controller.ControllerContext.ActionDescriptor.ActionName;
            }

            controller.ViewData.Model = model;

            using (var writer = new StringWriter())
            {
                IViewEngine viewEngine = controller.HttpContext.RequestServices.GetService(typeof(ICompositeViewEngine)) as ICompositeViewEngine;
				ViewEngineResult viewResult;

				if (viewName.StartsWith("~/"))
				{
					var hostingEnv = controller.HttpContext.RequestServices.GetService(typeof(IWebHostEnvironment)) as IWebHostEnvironment;
					viewResult= viewEngine.GetView(hostingEnv.WebRootPath, viewName, !partial);
				}
				else
				{
					viewResult= viewEngine.FindView(controller.ControllerContext, viewName, !partial);
				}

                if (viewResult.Success == false)
                {
                    return $"A view with the name {viewName} could not be found";
                }

                ViewContext viewContext = new ViewContext(
                    controller.ControllerContext,
                    viewResult.View,
                    controller.ViewData,
                    controller.TempData,
                    writer,
                    new HtmlHelperOptions()
                );

                await viewResult.View.RenderAsync(viewContext);

                return writer.GetStringBuilder().ToString();
            }
        }

        public static void CreateDualMapping<TSource, TDestination>(this IMapperConfigurationExpression cfg)
        {
            cfg.CreateMap<TSource, TDestination>().ReverseMap().ForAllMembers(opt => opt.Condition((source, dest, sourceMember, destMember) => (sourceMember != null)));
            cfg.CreateMap<TDestination, TSource>().ReverseMap().ForAllMembers(opt => opt.Condition((source, dest, sourceMember, destMember) => (sourceMember != null)));
        }
    }
}