using Microsoft.EntityFrameworkCore;
using JobTracker.API.Data;
using JobTracker.API.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add DbContext
builder.Services.AddDbContext<JobTrackerContext>(options =>
    options.UseInMemoryDatabase("JobTracker"));

// Add Repository
builder.Services.AddScoped<IJobApplicationRepository, JobApplicationRepository>();

// Update CORS policy to be more specific
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:3000")  // React's default port
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Remove or comment out HTTPS redirection in development
// app.UseHttpsRedirection();

app.UseCors("AllowReact");
app.UseAuthorization();
app.MapControllers();

app.Run(); 