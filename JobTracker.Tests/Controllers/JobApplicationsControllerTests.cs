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
    }
} 