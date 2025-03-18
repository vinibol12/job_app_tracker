using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using JobTracker.API.Models;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace JobTracker.API.IntegrationTests.Endpoints
{
    public class JobApplicationsEndpointTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;
        private readonly HttpClient _client;
        private readonly JsonSerializerOptions _jsonOptions = new() 
        { 
            PropertyNameCaseInsensitive = true 
        };

        public JobApplicationsEndpointTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
            _client = _factory.CreateClient();
        }

        [Fact]
        public async Task GetAllApplications_ReturnsSuccessStatusCode()
        {
            // Act
            var response = await _client.GetAsync("/api/JobApplications");

            // Assert
            response.EnsureSuccessStatusCode();
            Assert.Equal("application/json; charset=utf-8", response.Content.Headers.ContentType?.ToString());
        }

        [Fact]
        public async Task CreateApplication_ReturnsCreatedAndRetrievable()
        {
            // Arrange
            var newApplication = new JobApplication
            {
                CompanyName = "Integration Test Company",
                Position = "Software Developer",
                Status = "Applied",
                DateApplied = DateTime.UtcNow
            };

            // Act - Create
            var createResponse = await _client.PostAsJsonAsync("/api/JobApplications", newApplication);
            
            // Assert - Create
            createResponse.EnsureSuccessStatusCode();
            Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);
            
            // Get the created application from the response
            var createdApplication = await createResponse.Content.ReadFromJsonAsync<JobApplication>(_jsonOptions);
            Assert.NotNull(createdApplication);
            Assert.Equal(newApplication.CompanyName, createdApplication.CompanyName);
            Assert.Equal(newApplication.Position, createdApplication.Position);
            Assert.Equal(newApplication.Status, createdApplication.Status);
            
            // Act - Get by ID
            var getResponse = await _client.GetAsync($"/api/JobApplications/{createdApplication.Id}");
            
            // Assert - Get by ID
            getResponse.EnsureSuccessStatusCode();
            var retrievedApplication = await getResponse.Content.ReadFromJsonAsync<JobApplication>(_jsonOptions);
            Assert.NotNull(retrievedApplication);
            Assert.Equal(createdApplication.Id, retrievedApplication.Id);
            Assert.Equal(createdApplication.CompanyName, retrievedApplication.CompanyName);
        }

        [Fact]
        public async Task GetNonExistentApplication_ReturnsNotFound()
        {
            // Act
            var response = await _client.GetAsync("/api/JobApplications/99999");
            
            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task UpdateApplication_ReturnsSuccess()
        {
            // Arrange - Create an application to update
            var newApplication = new JobApplication
            {
                CompanyName = "Update Test Company",
                Position = "Test Position",
                Status = "Applied",
                DateApplied = DateTime.UtcNow
            };
            
            var createResponse = await _client.PostAsJsonAsync("/api/JobApplications", newApplication);
            createResponse.EnsureSuccessStatusCode();
            var createdApplication = await createResponse.Content.ReadFromJsonAsync<JobApplication>(_jsonOptions);
            Assert.NotNull(createdApplication);
            
            // Update the application
            createdApplication.CompanyName = "Updated Company Name";
            createdApplication.Position = "Updated Position";
            createdApplication.Status = "Interviewing";
            
            // Act
            var updateResponse = await _client.PutAsJsonAsync($"/api/JobApplications/{createdApplication.Id}", createdApplication);
            
            // Assert
            updateResponse.EnsureSuccessStatusCode();
            var updatedApplication = await updateResponse.Content.ReadFromJsonAsync<JobApplication>(_jsonOptions);
            Assert.NotNull(updatedApplication);
            Assert.Equal(createdApplication.Id, updatedApplication.Id);
            Assert.Equal("Updated Company Name", updatedApplication.CompanyName);
            Assert.Equal("Updated Position", updatedApplication.Position);
            Assert.Equal("Interviewing", updatedApplication.Status);
            
            // Verify the update with a GET request
            var getResponse = await _client.GetAsync($"/api/JobApplications/{createdApplication.Id}");
            getResponse.EnsureSuccessStatusCode();
            var retrievedApplication = await getResponse.Content.ReadFromJsonAsync<JobApplication>(_jsonOptions);
            Assert.NotNull(retrievedApplication);
            Assert.Equal("Updated Company Name", retrievedApplication.CompanyName);
        }

        [Fact]
        public async Task DeleteApplication_ReturnsNoContent()
        {
            // Arrange - Create an application to delete
            var newApplication = new JobApplication
            {
                CompanyName = "Delete Test Company",
                Position = "Test Position",
                Status = "Applied",
                DateApplied = DateTime.UtcNow
            };
            
            var createResponse = await _client.PostAsJsonAsync("/api/JobApplications", newApplication);
            createResponse.EnsureSuccessStatusCode();
            var createdApplication = await createResponse.Content.ReadFromJsonAsync<JobApplication>(_jsonOptions);
            Assert.NotNull(createdApplication);
            
            // Act
            var deleteResponse = await _client.DeleteAsync($"/api/JobApplications/{createdApplication.Id}");
            
            // Assert
            Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
            
            // Verify deletion
            var getResponse = await _client.GetAsync($"/api/JobApplications/{createdApplication.Id}");
            Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
        }

        [Fact]
        public async Task CompleteWorkflow_CreateUpdateDelete()
        {
            // 1. Create a new job application
            var newApplication = new JobApplication
            {
                CompanyName = "Workflow Test Company",
                Position = "Software Engineer",
                Status = "Applied",
                DateApplied = DateTime.UtcNow
            };
            
            var createResponse = await _client.PostAsJsonAsync("/api/JobApplications", newApplication);
            createResponse.EnsureSuccessStatusCode();
            var createdApplication = await createResponse.Content.ReadFromJsonAsync<JobApplication>(_jsonOptions);
            Assert.NotNull(createdApplication);
            Assert.Equal("Workflow Test Company", createdApplication.CompanyName);
            
            // 2. Update the application status
            createdApplication.Status = "Interviewing";
            var updateResponse = await _client.PutAsJsonAsync($"/api/JobApplications/{createdApplication.Id}", createdApplication);
            updateResponse.EnsureSuccessStatusCode();
            var updatedApplication = await updateResponse.Content.ReadFromJsonAsync<JobApplication>(_jsonOptions);
            Assert.NotNull(updatedApplication);
            Assert.Equal("Interviewing", updatedApplication.Status);
            
            // 3. Get the updated application
            var getResponse = await _client.GetAsync($"/api/JobApplications/{createdApplication.Id}");
            getResponse.EnsureSuccessStatusCode();
            var retrievedApplication = await getResponse.Content.ReadFromJsonAsync<JobApplication>(_jsonOptions);
            Assert.NotNull(retrievedApplication);
            Assert.Equal("Interviewing", retrievedApplication.Status);
            
            // 4. Delete the application
            var deleteResponse = await _client.DeleteAsync($"/api/JobApplications/{createdApplication.Id}");
            Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
            
            // 5. Verify it's deleted
            var finalGetResponse = await _client.GetAsync($"/api/JobApplications/{createdApplication.Id}");
            Assert.Equal(HttpStatusCode.NotFound, finalGetResponse.StatusCode);
        }
    }
}