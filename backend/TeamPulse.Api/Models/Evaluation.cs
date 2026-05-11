namespace TeamPulse.Api.Models;

public sealed class Evaluation
{
    public int Id { get; set; }
    public int MemberId { get; set; }
    public string Period { get; set; } = "";
    public int TechnicalScore { get; set; }
    public int CommunicationScore { get; set; }
    public int OwnershipScore { get; set; }
    public int TeamworkScore { get; set; }
    public int DeliveryScore { get; set; }
    public string Comments { get; set; } = "";
    public DateTimeOffset CreatedAt { get; set; }
}
