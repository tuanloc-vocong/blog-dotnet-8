﻿using AutoMapper;
using Blog.Core.Domain.Content;
using System.ComponentModel.DataAnnotations;

namespace Blog.Core.Models.Content
{
    public class PostInListDto
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public required string Slug { get; set; }

        [MaxLength(500)]
        public required string Description { get; set; }
        public string? Thumnail { get; set; }
        public int ViewCount { get; set; }
        public DateTime DateCreated { get; set; }

        public class AutoMapperProfiles : Profile
        {
            public AutoMapperProfiles()
            {
                CreateMap<Post, PostInListDto>();
            }
        }
    }
}
