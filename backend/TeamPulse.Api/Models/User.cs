namespace TeamPulse.Api.Models;

public sealed class User
{
    public int Id { get; set; }
    public string FullName { get; set; } = "";
    public string Email { get; set; } = "";
    public string Password { get; set; } = "";
    public AppRole AppRole { get; set; }
    public string BusinessTitle { get; set; } = "";
    public int? TeamId { get; set; }
    public string? AvatarUrl { get; set; }
}
