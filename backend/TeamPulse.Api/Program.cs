using TeamPulse.Api.Endpoints;
using TeamPulse.Api.Services;

var builder = WebApplication.CreateBuilder(args);

const string AngularDevelopmentCorsPolicy = "AngularDevelopment";

builder.Services.AddCors(options =>
{
    options.AddPolicy(AngularDevelopmentCorsPolicy, policy =>
    {
        policy
            .SetIsOriginAllowed(origin => Uri.TryCreate(origin, UriKind.Absolute, out var uri) && uri.Host == "localhost")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<TeamPulseDataStore>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(AngularDevelopmentCorsPolicy);

app.MapHealthEndpoints();
app.MapAuthEndpoints();
app.MapDashboardEndpoints();
app.MapUserEndpoints();
app.MapTeamEndpoints();
app.MapMemberEndpoints();
app.MapEvaluationEndpoints();
app.MapGoalEndpoints();
app.MapFeedbackEndpoints();
app.MapNoteEndpoints();

app.Run();
