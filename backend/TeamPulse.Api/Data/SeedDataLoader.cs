using System.Text.Json;
using System.Text.Json.Serialization;
using TeamPulse.Api.Models;

namespace TeamPulse.Api.Data;

public sealed record SeedMetadata(
    string SeedVersion,
    DateTimeOffset GeneratedAt,
    string Source,
    SeedCounts Counts);

public sealed record SeedCounts(
    int Users,
    int Managers,
    int TeamMembers,
    int Teams,
    int Members,
    int Evaluations,
    int Goals,
    int Feedback,
    int Notes);

public static class SeedDataLoader
{
    private const string SharedSeedDataFolder = "shared";
    private const string SeedDataFolder = "seed-data";

    private static readonly JsonSerializerOptions JsonOptions = CreateJsonOptions();

    public static TeamPulseSeed Load(string contentRootPath)
    {
        var seedDataPath = FindSeedDataPath(contentRootPath);
        var metadata = LoadRequired<SeedMetadata>(seedDataPath, "seed-metadata.json");

        // Learning Lab: Shared JSON seed data
        // The backend and static Angular build read the same root shared/seed-data files.
        var seed = new TeamPulseSeed(
            LoadRequired<List<User>>(seedDataPath, "users.json"),
            LoadRequired<List<Team>>(seedDataPath, "teams.json"),
            LoadRequired<List<MemberProfile>>(seedDataPath, "members.json"),
            LoadRequired<List<Evaluation>>(seedDataPath, "evaluations.json"),
            LoadRequired<List<Goal>>(seedDataPath, "goals.json"),
            LoadRequired<List<Feedback>>(seedDataPath, "feedback.json"),
            LoadRequired<List<OneToOneNote>>(seedDataPath, "notes.json"));

        ValidateSeed(metadata, seed, seedDataPath);

        return seed;
    }

    private static JsonSerializerOptions CreateJsonOptions()
    {
        var options = new JsonSerializerOptions(JsonSerializerDefaults.Web)
        {
            PropertyNameCaseInsensitive = true
        };

        options.Converters.Add(new JsonStringEnumConverter());

        return options;
    }

    private static string FindSeedDataPath(string contentRootPath)
    {
        if (string.IsNullOrWhiteSpace(contentRootPath))
        {
            throw new InvalidOperationException("TeamPulse seed data load failed: content root path is empty.");
        }

        var current = new DirectoryInfo(contentRootPath);
        while (current is not null)
        {
            var candidate = Path.Combine(current.FullName, SharedSeedDataFolder, SeedDataFolder);
            if (Directory.Exists(candidate))
            {
                return candidate;
            }

            current = current.Parent;
        }

        throw new InvalidOperationException(
            $"TeamPulse seed data folder was not found. Expected '{SharedSeedDataFolder}/{SeedDataFolder}' under the repository root while starting from '{contentRootPath}'.");
    }

    private static T LoadRequired<T>(string seedDataPath, string fileName)
    {
        var filePath = Path.Combine(seedDataPath, fileName);
        if (!File.Exists(filePath))
        {
            throw new InvalidOperationException($"TeamPulse seed data file is missing: '{filePath}'.");
        }

        try
        {
            var json = File.ReadAllText(filePath);
            return JsonSerializer.Deserialize<T>(json, JsonOptions)
                ?? throw new InvalidOperationException($"TeamPulse seed data file is empty or invalid: '{filePath}'.");
        }
        catch (JsonException exception)
        {
            throw new InvalidOperationException($"TeamPulse seed data file contains invalid JSON: '{filePath}'.", exception);
        }
    }

    private static void ValidateSeed(SeedMetadata metadata, TeamPulseSeed seed, string seedDataPath)
    {
        if (string.IsNullOrWhiteSpace(metadata.SeedVersion))
        {
            throw InvalidSeed(seedDataPath, "seed metadata must include a seedVersion.");
        }

        ValidateCounts(metadata, seed, seedDataPath);
        ValidateUniqueIds(seed, seedDataPath);
        ValidateRelationships(seed, seedDataPath);
        ValidatePasswords(seed, seedDataPath);
    }

    private static void ValidateCounts(SeedMetadata metadata, TeamPulseSeed seed, string seedDataPath)
    {
        Require(seed.Users.Count == metadata.Counts.Users, seedDataPath, "users count does not match seed metadata.");
        Require(seed.Users.Count(user => user.AppRole == AppRole.Manager) == metadata.Counts.Managers, seedDataPath, "manager user count does not match seed metadata.");
        Require(seed.Users.Count(user => user.AppRole == AppRole.TeamMember) == metadata.Counts.TeamMembers, seedDataPath, "team member user count does not match seed metadata.");
        Require(seed.Teams.Count == metadata.Counts.Teams, seedDataPath, "teams count does not match seed metadata.");
        Require(seed.Members.Count == metadata.Counts.Members, seedDataPath, "members count does not match seed metadata.");
        Require(seed.Evaluations.Count == metadata.Counts.Evaluations, seedDataPath, "evaluations count does not match seed metadata.");
        Require(seed.Goals.Count == metadata.Counts.Goals, seedDataPath, "goals count does not match seed metadata.");
        Require(seed.Feedback.Count == metadata.Counts.Feedback, seedDataPath, "feedback count does not match seed metadata.");
        Require(seed.Notes.Count == metadata.Counts.Notes, seedDataPath, "notes count does not match seed metadata.");
    }

    private static void ValidateUniqueIds(TeamPulseSeed seed, string seedDataPath)
    {
        RequireUnique(seed.Users.Select(user => user.Id), seedDataPath, "users must have unique ids.");
        RequireUnique(seed.Users.Select(user => user.Email.ToLowerInvariant()), seedDataPath, "users must have unique emails.");
        RequireUnique(seed.Teams.Select(team => team.Id), seedDataPath, "teams must have unique ids.");
        RequireUnique(seed.Members.Select(member => member.Id), seedDataPath, "members must have unique ids.");
        RequireUnique(seed.Members.Select(member => member.UserId), seedDataPath, "members must have unique userIds.");
        RequireUnique(seed.Evaluations.Select(evaluation => evaluation.Id), seedDataPath, "evaluations must have unique ids.");
        RequireUnique(seed.Goals.Select(goal => goal.Id), seedDataPath, "goals must have unique ids.");
        RequireUnique(seed.Feedback.Select(feedback => feedback.Id), seedDataPath, "feedback records must have unique ids.");
        RequireUnique(seed.Notes.Select(note => note.Id), seedDataPath, "notes must have unique ids.");
    }

    private static void ValidateRelationships(TeamPulseSeed seed, string seedDataPath)
    {
        var usersById = seed.Users.ToDictionary(user => user.Id);
        var teamsById = seed.Teams.ToDictionary(team => team.Id);
        var membersById = seed.Members.ToDictionary(member => member.Id);

        foreach (var team in seed.Teams)
        {
            Require(usersById.TryGetValue(team.ManagerId, out var manager) && manager.AppRole == AppRole.Manager, seedDataPath, $"team {team.Id} must reference a manager user.");
        }

        foreach (var member in seed.Members)
        {
            Require(usersById.TryGetValue(member.UserId, out var user) && user.AppRole == AppRole.TeamMember, seedDataPath, $"member {member.Id} must reference a team member user.");
            Require(teamsById.ContainsKey(member.TeamId), seedDataPath, $"member {member.Id} must reference an existing team.");
        }

        foreach (var evaluation in seed.Evaluations)
        {
            Require(membersById.ContainsKey(evaluation.MemberId), seedDataPath, $"evaluation {evaluation.Id} must reference an existing member.");
        }

        foreach (var goal in seed.Goals)
        {
            var ownerExists = goal.OwnerType == OwnerType.Member
                ? membersById.ContainsKey(goal.OwnerId)
                : teamsById.ContainsKey(goal.OwnerId);

            Require(ownerExists, seedDataPath, $"goal {goal.Id} must reference an existing {goal.OwnerType.ToString().ToLowerInvariant()}.");
        }

        foreach (var feedback in seed.Feedback)
        {
            Require(membersById.ContainsKey(feedback.MemberId), seedDataPath, $"feedback {feedback.Id} must reference an existing member.");
            Require(usersById.ContainsKey(feedback.FromUserId), seedDataPath, $"feedback {feedback.Id} must reference an existing fromUserId.");
        }

        foreach (var note in seed.Notes)
        {
            Require(membersById.ContainsKey(note.MemberId), seedDataPath, $"note {note.Id} must reference an existing member.");
            Require(usersById.TryGetValue(note.ManagerId, out var manager) && manager.AppRole == AppRole.Manager, seedDataPath, $"note {note.Id} must reference a manager user.");
        }
    }

    private static void ValidatePasswords(TeamPulseSeed seed, string seedDataPath)
    {
        foreach (var user in seed.Users)
        {
            var expectedPassword = user.AppRole == AppRole.Manager
                ? "TeamPulse-Manager-2026!"
                : "TeamPulse-Member-2026!";

            Require(user.Password == expectedPassword, seedDataPath, $"user {user.Id} must use the TeamPulse v2 demo password for {user.AppRole}.");
        }
    }

    private static void RequireUnique<T>(IEnumerable<T> values, string seedDataPath, string message) where T : notnull
    {
        var items = values.ToList();
        Require(items.Count == items.Distinct().Count(), seedDataPath, message);
    }

    private static void Require(bool condition, string seedDataPath, string message)
    {
        if (!condition)
        {
            throw InvalidSeed(seedDataPath, message);
        }
    }

    private static InvalidOperationException InvalidSeed(string seedDataPath, string message) =>
        new($"TeamPulse seed data validation failed for '{seedDataPath}': {message}");
}
