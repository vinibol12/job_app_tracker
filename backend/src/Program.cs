using Microsoft.EntityFrameworkCore;
using JobTracker.API.Data;
using JobTracker.API.Repositories;

public partial class Program 
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        
        // Add Swagger in all environments for API documentation
        builder.Services.AddSwaggerGen();

        // Add DbContext
        builder.Services.AddDbContext<JobTrackerContext>(options =>
            options.UseInMemoryDatabase("JobTracker"));

        // Add Repository
        builder.Services.AddScoped<IJobApplicationRepository, JobApplicationRepository>();

        // Read CORS configuration from appsettings.json
        var corsOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() 
            ?? new[] { "http://localhost:3000" };  // Default to localhost if not configured

        // Update CORS policy
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowReact", policy =>
            {
                policy.WithOrigins(corsOrigins)
                      .AllowAnyMethod()
                      .AllowAnyHeader()
                      .AllowCredentials();
            });
        });

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        
        // Enable Swagger in all environments for API documentation
        // (For demo purposes, we want this available in production)
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "Job Tracker API v1");
            c.RoutePrefix = "swagger";
        });

        // Remove or comment out HTTPS redirection in development
        // app.UseHttpsRedirection();

        app.UseCors("AllowReact");
        app.UseAuthorization();
        app.MapControllers();

        app.Run();
    }
}