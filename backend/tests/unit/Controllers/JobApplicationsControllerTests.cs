using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using JobTracker.API.Controllers;
using JobTracker.API.Models;
using JobTracker.API.Repositories;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace JobTracker.Tests.Controllers
{
    public class JobApplicationsControllerTests
    {
        private readonly Mock<IJobApplicationRepository> _mockRepo;
        private readonly JobApplicationsController _controller;

        public JobApplicationsControllerTests()
        {
            _mockRepo = new Mock<IJobApplicationRepository>();
            _controller = new JobApplicationsController(_mockRepo.Object);
        }

        [Fact]
        public async Task GetApplications_ReturnsOkResult_WithListOfApplications()
        {
            // Arrange
            var applications = new List<JobApplication>
            {
                new JobApplication { Id = 1, CompanyName = "Test Company", Position = "Developer", Status = "Applied" }
            };
            _mockRepo.Setup(repo => repo.GetAllAsync()).ReturnsAsync(applications);

            // Act
            var result = await _controller.GetApplications();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedApplications = Assert.IsType<List<JobApplication>>(okResult.Value);
            Assert.Single(returnedApplications);
        }

        [Fact]
        public async Task GetApplication_ReturnsOkResult_WithApplication_WhenExists()
        {
            // Arrange
            var application = new JobApplication 
            { 
                Id = 1, 
                CompanyName = "Test Company", 
                Position = "Developer", 
                Status = "Applied" 
            };
            _mockRepo.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(application);

            // Act
            var result = await _controller.GetApplication(1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedApplication = Assert.IsType<JobApplication>(okResult.Value);
            Assert.Equal(1, returnedApplication.Id);
            Assert.Equal("Test Company", returnedApplication.CompanyName);
        }

        [Fact]
        public async Task GetApplication_ReturnsNotFound_WhenApplicationDoesNotExist()
        {
            // Arrange
            _mockRepo.Setup(repo => repo.GetByIdAsync(999)).ReturnsAsync((JobApplication?)null);

            // Act
            var result = await _controller.GetApplication(999);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task CreateApplication_ReturnsCreatedAtAction()
        {
            // Arrange
            var newApplication = new JobApplication
            {
                CompanyName = "New Company",
                Position = "Developer",
                Status = "Applied"
            };
            _mockRepo.Setup(repo => repo.AddAsync(It.IsAny<JobApplication>()))
                    .ReturnsAsync((JobApplication app) => { app.Id = 1; return app; });

            // Act
            var result = await _controller.CreateApplication(newApplication);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnedApplication = Assert.IsType<JobApplication>(createdAtActionResult.Value);
            Assert.Equal("New Company", returnedApplication.CompanyName);
            Assert.Equal("GetApplication", createdAtActionResult.ActionName);
            Assert.Equal(1, createdAtActionResult.RouteValues?["id"]);
        }

        [Fact]
        public async Task UpdateApplication_ReturnsOkResult_WhenSuccessful()
        {
            // Arrange
            var applicationToUpdate = new JobApplication
            {
                Id = 1,
                CompanyName = "Updated Company",
                Position = "Updated Position",
                Status = "Interviewing"
            };
            
            _mockRepo.Setup(repo => repo.UpdateAsync(It.IsAny<JobApplication>()))
                    .ReturnsAsync(applicationToUpdate);

            // Act
            var result = await _controller.UpdateApplication(1, applicationToUpdate);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedApplication = Assert.IsType<JobApplication>(okResult.Value);
            Assert.Equal(1, returnedApplication.Id);
            Assert.Equal("Updated Company", returnedApplication.CompanyName);
            Assert.Equal("Interviewing", returnedApplication.Status);
        }

        [Fact]
        public async Task UpdateApplication_ReturnsBadRequest_WhenIdMismatch()
        {
            // Arrange
            var applicationToUpdate = new JobApplication
            {
                Id = 2, // Different from the route ID
                CompanyName = "Updated Company",
                Position = "Developer",
                Status = "Applied"
            };

            // Act
            var result = await _controller.UpdateApplication(1, applicationToUpdate);

            // Assert
            Assert.IsType<BadRequestResult>(result.Result);
        }

        [Fact]
        public async Task UpdateApplication_ReturnsNotFound_WhenApplicationDoesNotExist()
        {
            // Arrange
            var applicationToUpdate = new JobApplication
            {
                Id = 999,
                CompanyName = "Non-existent Company",
                Position = "Developer",
                Status = "Applied"
            };
            
            _mockRepo.Setup(repo => repo.UpdateAsync(It.IsAny<JobApplication>()))
                    .ReturnsAsync((JobApplication?)null);

            // Act
            var result = await _controller.UpdateApplication(999, applicationToUpdate);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task DeleteApplication_ReturnsNoContent_WhenSuccessful()
        {
            // Arrange
            _mockRepo.Setup(repo => repo.DeleteAsync(1)).ReturnsAsync(true);

            // Act
            var result = await _controller.DeleteApplication(1);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task DeleteApplication_ReturnsNotFound_WhenApplicationDoesNotExist()
        {
            // Arrange
            _mockRepo.Setup(repo => repo.DeleteAsync(999)).ReturnsAsync(false);

            // Act
            var result = await _controller.DeleteApplication(999);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }
    }
}