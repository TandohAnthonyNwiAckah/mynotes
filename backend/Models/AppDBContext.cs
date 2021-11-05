#nullable enable
#pragma warning disable CS8602 // Dereference of a possibly null reference.
#pragma warning disable CS8600 // Converting null literal or possible null value to non-nullable type.
#pragma warning disable CS8604 // Possible null reference argument.
#pragma warning disable CS8629 // Nullable value type may be null.
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Data;
namespace TANA.Models{
	public class AppDBContext : DbContext
	{
	public DbSet<Notes> Notes { get; set; } = null!;
		public DbSet<QueryNumCount> NumCount { get; set; } = null!;
		public DbSet<QueryLabelValue> LabelValue { get; set; } = null!;
		public DbSet<QueryLabelValueCount> LabelValueCount { get; set; } = null!;
		public DbSet<QueryValueCount> ValueCount { get; set; } = null!;
		public AppDBContext(DbContextOptions<AppDBContext> options): base(options){ }
		public AppDBContext(){ }
		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder){ }
		protected override void OnModelCreating(ModelBuilder builder)
		{
			base.OnModelCreating(builder);
		}
		
	}
}
