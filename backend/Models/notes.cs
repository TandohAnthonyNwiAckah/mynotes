using TANA.Helpers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace TANA.Models{
	[Table("NOTES", Schema = "dbo")]
	public class Notes : BaseRecord
	{
		[Key]
		public string? title { get; set; } = default!;
		public string? notes { get; set; } = default!;
		public string? languagecode { get; set; } = default!;
		public int notesid { get; set; } = default!;
	}
	public class NotesAddDTO
	{
		public string? title { get; set; } = default!;
		public string? notes { get; set; } = default!;
		public string? languagecode { get; set; } = default!;
	}
	public class NotesEditDTO
	{
		public string? title { get; set; } = default!;
		public string? notes { get; set; } = default!;
		public string? languagecode { get; set; } = default!;
	}
}
