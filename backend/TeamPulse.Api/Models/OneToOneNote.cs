namespace TeamPulse.Api.Models;

public sealed class OneToOneNote
{
    public int Id { get; set; }
    public int MemberId { get; set; }
    public int ManagerId { get; set; }
    public string Note { get; set; } = "";
    public DateTimeOffset CreatedAt { get; set; }
}
