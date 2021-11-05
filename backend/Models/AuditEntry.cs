
#nullable enable
#pragma warning disable CS8601 // Possible null reference argument.
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
namespace TANA.Models
{
	public class AuditEntry
	{
		public Dictionary<string, object> OldValues { get; } = new Dictionary<string, object>();
		public Dictionary<string, object> NewValues { get; } = new Dictionary<string, object>();
		public string RecordId { get; set; } = "";
		public List<PropertyEntry> TemporaryProperties { get; } = new List<PropertyEntry>();
		public bool HasTemporaryProperties => TemporaryProperties.Any();
		/*public Audits ToAudit(Audits audit)
		{
			audit.old_values = OldValues.Count == 0 ? null : JsonConvert.SerializeObject(OldValues);
			audit.new_values = NewValues.Count == 0 ? null : JsonConvert.SerializeObject(NewValues);
			audit.record_id = RecordId;
			return audit;
		}*/
	}
}
