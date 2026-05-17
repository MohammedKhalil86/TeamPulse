using TeamPulse.Api.Data;
using TeamPulse.Api.Models;

namespace TeamPulse.Api.Services;

public sealed class TeamPulseDataStore
{
    private readonly object _sync = new();
    private readonly List<User> _users;
    private readonly List<Team> _teams;
    private readonly List<MemberProfile> _members;
    private readonly List<Evaluation> _evaluations;
    private readonly List<Goal> _goals;
    private readonly List<Feedback> _feedback;
    private readonly List<OneToOneNote> _notes;

    public TeamPulseDataStore(IHostEnvironment environment)
    {
        var seed = SeedData.Create(environment.ContentRootPath);
        _users = seed.Users;
        _teams = seed.Teams;
        _members = seed.Members;
        _evaluations = seed.Evaluations;
        _goals = seed.Goals;
        _feedback = seed.Feedback;
        _notes = seed.Notes;
    }

    public LoginSession? Login(LoginRequest request)
    {
        var user = _users.FirstOrDefault(candidate =>
            candidate.Email.Equals(request.Email, StringComparison.OrdinalIgnoreCase) &&
            candidate.Password == request.Password);

        return user is null ? null : ToSession(user);
    }

    public IReadOnlyList<UserResponse> GetUsers() => _users.Select(ToUserResponse).ToList();

    public UserResponse? GetUser(int id) => _users.FirstOrDefault(user => user.Id == id) is { } user ? ToUserResponse(user) : null;

    public IReadOnlyList<Team> GetTeams() => _teams.ToList();

    public Team? GetTeam(int id) => _teams.FirstOrDefault(team => team.Id == id);

    public Team AddTeam(Team team)
    {
        lock (_sync)
        {
            team.Id = NextId(_teams);
            _teams.Add(team);
            return team;
        }
    }

    public Team? UpdateTeam(int id, Team updated)
    {
        lock (_sync)
        {
            var existing = GetTeam(id);
            if (existing is null)
            {
                return null;
            }

            existing.Name = updated.Name;
            existing.Mission = updated.Mission;
            existing.ManagerId = updated.ManagerId;
            existing.HealthScore = updated.HealthScore;
            existing.DeliveryScore = updated.DeliveryScore;
            existing.EngagementScore = updated.EngagementScore;
            existing.RiskLevel = updated.RiskLevel;
            return existing;
        }
    }

    public bool DeleteTeam(int id)
    {
        lock (_sync)
        {
            var team = GetTeam(id);
            return team is not null && _teams.Remove(team);
        }
    }

    public IReadOnlyList<MemberProfile> GetMembers() => _members.ToList();

    public MemberProfile? GetMember(int id) => _members.FirstOrDefault(member => member.Id == id);

    public MemberProfile? GetMemberByUserId(int userId) => _members.FirstOrDefault(member => member.UserId == userId);

    public IReadOnlyList<MemberProfile> GetMembersByTeam(int teamId) =>
        _members.Where(member => member.TeamId == teamId).ToList();

    public MemberProfile AddMember(MemberProfile member)
    {
        lock (_sync)
        {
            member.Id = NextId(_members);
            _members.Add(member);
            return member;
        }
    }

    public MemberProfile? UpdateMember(int id, MemberProfile updated)
    {
        lock (_sync)
        {
            var existing = GetMember(id);
            if (existing is null)
            {
                return null;
            }

            existing.UserId = updated.UserId;
            existing.FullName = updated.FullName;
            existing.Role = updated.Role;
            existing.Seniority = updated.Seniority;
            existing.TeamId = updated.TeamId;
            existing.Skills = updated.Skills;
            existing.PerformanceScore = updated.PerformanceScore;
            existing.EngagementScore = updated.EngagementScore;
            existing.RiskLevel = updated.RiskLevel;
            return existing;
        }
    }

    public bool DeleteMember(int id)
    {
        lock (_sync)
        {
            var member = GetMember(id);
            return member is not null && _members.Remove(member);
        }
    }

    public IReadOnlyList<Evaluation> GetEvaluations() => _evaluations.ToList();

    public IReadOnlyList<Evaluation> GetEvaluationsByMember(int memberId) =>
        _evaluations.Where(evaluation => evaluation.MemberId == memberId).ToList();

    public Evaluation AddEvaluation(Evaluation evaluation)
    {
        lock (_sync)
        {
            evaluation.Id = NextId(_evaluations);
            evaluation.CreatedAt = evaluation.CreatedAt == default ? DateTimeOffset.UtcNow : evaluation.CreatedAt;
            _evaluations.Add(evaluation);
            return evaluation;
        }
    }

    public Evaluation? UpdateEvaluation(int id, Evaluation updated)
    {
        lock (_sync)
        {
            var existing = _evaluations.FirstOrDefault(evaluation => evaluation.Id == id);
            if (existing is null)
            {
                return null;
            }

            existing.MemberId = updated.MemberId;
            existing.Period = updated.Period;
            existing.TechnicalScore = updated.TechnicalScore;
            existing.CommunicationScore = updated.CommunicationScore;
            existing.OwnershipScore = updated.OwnershipScore;
            existing.TeamworkScore = updated.TeamworkScore;
            existing.DeliveryScore = updated.DeliveryScore;
            existing.Comments = updated.Comments;
            existing.CreatedAt = updated.CreatedAt == default ? existing.CreatedAt : updated.CreatedAt;
            return existing;
        }
    }

    public bool DeleteEvaluation(int id)
    {
        lock (_sync)
        {
            var evaluation = _evaluations.FirstOrDefault(item => item.Id == id);
            return evaluation is not null && _evaluations.Remove(evaluation);
        }
    }

    public IReadOnlyList<Goal> GetGoals() => _goals.ToList();

    public IReadOnlyList<Goal> GetMemberGoals(int memberId) =>
        _goals.Where(goal => goal.OwnerType == OwnerType.Member && goal.OwnerId == memberId).ToList();

    public IReadOnlyList<Goal> GetTeamGoals(int teamId) =>
        _goals.Where(goal => goal.OwnerType == OwnerType.Team && goal.OwnerId == teamId).ToList();

    public Goal AddGoal(Goal goal)
    {
        lock (_sync)
        {
            goal.Id = NextId(_goals);
            _goals.Add(goal);
            return goal;
        }
    }

    public Goal? UpdateGoal(int id, Goal updated)
    {
        lock (_sync)
        {
            var existing = _goals.FirstOrDefault(goal => goal.Id == id);
            if (existing is null)
            {
                return null;
            }

            existing.Title = updated.Title;
            existing.Description = updated.Description;
            existing.OwnerType = updated.OwnerType;
            existing.OwnerId = updated.OwnerId;
            existing.Progress = updated.Progress;
            existing.Status = updated.Status;
            existing.DueDate = updated.DueDate;
            return existing;
        }
    }

    public bool DeleteGoal(int id)
    {
        lock (_sync)
        {
            var goal = _goals.FirstOrDefault(item => item.Id == id);
            return goal is not null && _goals.Remove(goal);
        }
    }

    public IReadOnlyList<Feedback> GetFeedback() => _feedback.ToList();

    public IReadOnlyList<Feedback> GetFeedbackByMember(int memberId) =>
        _feedback.Where(item => item.MemberId == memberId).OrderByDescending(item => item.CreatedAt).ToList();

    public Feedback AddFeedback(Feedback feedback)
    {
        lock (_sync)
        {
            feedback.Id = NextId(_feedback);
            feedback.CreatedAt = feedback.CreatedAt == default ? DateTimeOffset.UtcNow : feedback.CreatedAt;
            _feedback.Add(feedback);
            return feedback;
        }
    }

    public bool DeleteFeedback(int id)
    {
        lock (_sync)
        {
            var feedback = _feedback.FirstOrDefault(item => item.Id == id);
            return feedback is not null && _feedback.Remove(feedback);
        }
    }

    public IReadOnlyList<OneToOneNote> GetNotesByMember(int memberId) =>
        _notes.Where(note => note.MemberId == memberId).OrderByDescending(note => note.CreatedAt).ToList();

    public OneToOneNote AddNote(OneToOneNote note)
    {
        lock (_sync)
        {
            note.Id = NextId(_notes);
            note.CreatedAt = note.CreatedAt == default ? DateTimeOffset.UtcNow : note.CreatedAt;
            _notes.Add(note);
            return note;
        }
    }

    public bool DeleteNote(int id)
    {
        lock (_sync)
        {
            var note = _notes.FirstOrDefault(item => item.Id == id);
            return note is not null && _notes.Remove(note);
        }
    }

    public ManagerDashboardResponse GetManagerDashboard()
    {
        var teams = GetTeams();
        var members = GetMembers();

        return new ManagerDashboardResponse(
            teams.Count,
            members.Count,
            Convert.ToInt32(teams.Average(team => team.HealthScore)),
            Convert.ToInt32(teams.Average(team => team.DeliveryScore)),
            Convert.ToInt32(teams.Average(team => team.EngagementScore)),
            members.Count(member => member.RiskLevel == RiskLevel.High),
            teams,
            _goals.OrderBy(goal => goal.DueDate).Take(8).ToList(),
            _feedback.OrderByDescending(item => item.CreatedAt).Take(8).ToList());
    }

    public MemberDashboardResponse? GetMemberDashboard(int userId)
    {
        var user = GetUser(userId);
        var profile = GetMemberByUserId(userId);
        if (user is null)
        {
            return null;
        }

        var team = profile is null ? null : GetTeam(profile.TeamId);
        var latestEvaluation = profile is null
            ? null
            : GetEvaluationsByMember(profile.Id).OrderByDescending(evaluation => evaluation.CreatedAt).FirstOrDefault();

        return new MemberDashboardResponse(
            user,
            profile,
            team,
            latestEvaluation,
            profile is null ? [] : GetMemberGoals(profile.Id),
            profile is null ? [] : GetFeedbackByMember(profile.Id).Take(8).ToList(),
            profile is null ? [] : GetNotesByMember(profile.Id).Take(8).ToList());
    }

    private static LoginSession ToSession(User user) =>
        new(user.Id, user.FullName, user.Email, user.AppRole, user.BusinessTitle, user.TeamId);

    private static UserResponse ToUserResponse(User user) =>
        new(user.Id, user.FullName, user.Email, user.AppRole, user.BusinessTitle, user.TeamId, user.AvatarUrl);

    private static int NextId<T>(IReadOnlyCollection<T> items)
    {
        if (items.Count == 0)
        {
            return 1;
        }

        return items.Select(item => (int)(item?.GetType().GetProperty("Id")?.GetValue(item) ?? 0)).Max() + 1;
    }
}
