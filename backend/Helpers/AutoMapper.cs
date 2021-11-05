
// AutoMapping.cs
using AutoMapper;
using TANA.Models;
public class AutoMapping : Profile
{
    public AutoMapping()
    {
    		CreateMap<NotesAddDTO, Notes>();
		CreateMap<NotesEditDTO, Notes>();
    }
}
