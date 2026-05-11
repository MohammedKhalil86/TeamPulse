using TeamPulse.Api.Models;
using TeamPulse.Api.Services;

namespace TeamPulse.Api.Endpoints;

public static class NoteEndpoints
{
    public static IEndpointRouteBuilder MapNoteEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/members/{memberId:int}/notes", (int memberId, TeamPulseDataStore store) =>
            Results.Ok(store.GetNotesByMember(memberId)))
            .WithTags("Notes")
            .WithName("GetMemberNotes");

        var group = app.MapGroup("/api/notes").WithTags("Notes");

        group.MapPost("/", (OneToOneNote note, TeamPulseDataStore store) =>
            Results.Created($"/api/notes/{store.AddNote(note).Id}", note))
            .WithName("CreateNote");

        group.MapDelete("/{id:int}", (int id, TeamPulseDataStore store) =>
            store.DeleteNote(id) ? Results.NoContent() : Results.NotFound())
            .WithName("DeleteNote");

        return app;
    }
}
