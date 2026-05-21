using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SkinVision.Application.Interfaces.Repositories;
using SkinVision.Application.Interfaces.Services;
using SkinVision.Application.Services;
using SkinVision.Extensions;
using SkinVision.Infrastructure.Context;
using SkinVision.Infrastructure.InfraServices;
using SkinVision.Infrastructure.Repositories;
using SkinVision.ExceptionHandling;
using System.Text;
using Serilog;
using Serilog.Events;
using System.Diagnostics;
using Serilog.Context;
using Serilog.Formatting.Json;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((context, loggerConfiguration) =>
{
    loggerConfiguration
        .ReadFrom.Configuration(context.Configuration)
        .Enrich.FromLogContext()
        .WriteTo.Console(outputTemplate:
            "[{Timestamp:HH:mm:ss} {Level:u3}] {SourceContext} {Message:lj} {Properties:j}{NewLine}{Exception}");

    if (!context.HostingEnvironment.IsDevelopment())
    {
        loggerConfiguration.WriteTo.File(
            path: "logs/skinvision-.json",
            rollingInterval: RollingInterval.Day,
            formatter: new JsonFormatter());
    }
});



builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

// Add services to the container
builder.Services.AddControllers();

// Configure DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var googleConfig = builder.Configuration.GetSection("Authentication:Google");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    })
    .AddCookie("ExternalCookies", options =>
    {
        options.ExpireTimeSpan = TimeSpan.FromMinutes(5);
    })
    .AddGoogle(options =>
    {
        options.ClientId = googleConfig["ClientId"]!;
        options.ClientSecret = googleConfig["ClientSecret"]!;
        options.CallbackPath = "/signin-google";
        options.SignInScheme = "ExternalCookies";
    });
// Register Unit of Work (Infrastructure)
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Register services (Application)
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IExaminationService, ExaminationService>();
builder.Services.AddScoped<IDoctorProfileService, DoctorProfileService>();
builder.Services.AddScoped<IImageService, ImageService>();
builder.Services.AddScoped<IFileStorageService, LocalFileStorageService>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<IReportGeneratorService, PdfReportGeneratorService>();
builder.Services.AddScoped<IOAuthService, GoogleOAuthService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddHttpClient<IDlPredictionService, DlPredictionService>(client =>
{
    client.BaseAddress = new Uri(builder.Configuration["DlService:BaseUrl"]!);
    client.Timeout = TimeSpan.FromSeconds(
        builder.Configuration.GetValue<int>("DlService:TimeoutSeconds", 30));
});

// Configure CORS for Angular frontend
var frontendUrl = builder.Configuration["Frontend:BaseUrl"] ?? "http://localhost:4200";
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins(frontendUrl)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSkinVisionSwagger();
builder.Services.AddProblemDetails();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsDevelopment())
    app.UseHttpsRedirection();

app.UseCors("AllowAngular");

app.Use(async (context, next) =>
{
    var traceId = Activity.Current?.Id ?? context.TraceIdentifier;

    using (LogContext.PushProperty("TraceId", traceId))
    {
        await next();
    }
});

app.UseExceptionHandler();

app.UseSerilogRequestLogging(options =>
{
    options.MessageTemplate =
        "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms";

    options.GetLevel = (httpContext, _, exception) => exception is null
        && httpContext.Response.StatusCode < StatusCodes.Status500InternalServerError
            ? LogEventLevel.Information
            : LogEventLevel.Error;
});

app.UseAuthentication();

app.UseAuthorization();

app.UseStaticFiles();

app.MapControllers();

app.Run();
