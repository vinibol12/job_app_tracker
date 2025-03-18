using Microsoft.EntityFrameworkCore;
using JobTracker.API.Data;
using JobTracker.API.Repositories;

public partial class Program 
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Configure server port for Azure App Service
        // This must be done before building the app
        ConfigureKestrel(builder);

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

        // Define explicit CORS origins including both local and production. Would set this dynamically
        // in a real world scenario. 
        var corsOrigins = new[] { 
            "http://localhost:3000",
            "https://green-grass-025347d00.6.azurestaticapps.net",
            "https://green-grass-025347d00-preview.eastasia.6.azurestaticapps.net/"
        };

        // Update CORS policy
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowAll", builder =>
            {
                builder.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
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

        app.UseCors("AllowAll");
        app.UseAuthorization();
        app.MapControllers();
        
        // Add a diagnostic endpoint
        app.MapGet("/", () => $"Job Tracker API is running. Go to /swagger for API documentation. Server time: {DateTime.UtcNow}");
        
        app.Run();
    }

    private static void ConfigureKestrel(WebApplicationBuilder builder)
    {
        // Get port from environment variables for Azure App Service compatibility
        var port = Environment.GetEnvironmentVariable("PORT") ?? 
                  Environment.GetEnvironmentVariable("WEBSITES_PORT") ?? 
                  "8080";
            
        Console.WriteLine($"Configuring Kestrel to listen on port {port}");
            
        builder.WebHost.ConfigureKestrel(serverOptions =>
        {
            serverOptions.ListenAnyIP(int.Parse(port));
        });
            
        builder.WebHost.UseUrls($"http://*:{port}");
    }
}