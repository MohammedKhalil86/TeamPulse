namespace TeamPulse.Api.Models;

public sealed class Feedback
{
    public int Id { get; set; }
    public int MemberId { get; set; }
    public int FromUserId { get; set; }
    public FeedbackType Type { get; set; }
    public string Message { get; set; } = "";
    public DateTimeOffset CreatedAt { get; set; }
}
