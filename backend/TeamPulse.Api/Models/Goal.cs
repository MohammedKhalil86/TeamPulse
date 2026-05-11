namespace TeamPulse.Api.Models;

public sealed class Goal
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public OwnerType OwnerType { get; set; }
    public int OwnerId { get; set; }
    public int Progress { get; set; }
    public GoalStatus Status { get; set; }
    public DateOnly DueDate { get; set; }
}
